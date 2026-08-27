<?php

namespace App\Console\Commands;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use SimpleXMLElement;

class ImportBlogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:blogs
                            {--limit=5 : Max number of articles to import per feed}
                            {--delay=1 : Seconds to wait between feed requests}
                            {--dry-run : Do not write to the database; print what would be imported instead}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pull recent articles from a handful of Moroccan business/economy RSS feeds to populate the blog (manual, re-runnable)';

    private const USER_AGENT = 'IndexMA-DevSeed/1.0 (one-off local development data import)';

    private const EDITORIAL_EMAIL = 'editorial@indexma.com';

    /**
     * Verified 2026-08-27: all four returned same-day articles under a business/economy
     * section (not just the outlet's general feed), see PR discussion for the ones ruled
     * out (stale category feed, blocked by bot protection, or empty/broken).
     */
    private const FEEDS = [
        'Hespress Français' => 'https://fr.hespress.com/economie/feed',
        'La Vie Éco' => 'https://www.lavieeco.com/affaires/feed/',
        'LeSiteInfo' => 'https://www.lesiteinfo.com/economie/feed',
        'LesEco.ma' => 'https://leseco.ma/business/feed',
    ];

    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        $delay = (int) $this->option('delay');
        $dryRun = (bool) $this->option('dry-run');

        $this->info($dryRun
            ? "Dry run: attempting up to {$limit} articles per feed (nothing will be written to the database)"
            : "Importing up to {$limit} articles per feed");

        $editorialId = $dryRun ? null : $this->getOrCreateEditorialAccount();

        $imported = 0;
        $skipped = 0;
        $rows = [];

        $feedIndex = 0;
        foreach (self::FEEDS as $outlet => $url) {
            if ($feedIndex > 0) {
                sleep($delay);
            }
            $feedIndex++;

            $this->line("Fetching feed: {$outlet} ({$url})");

            $xml = $this->fetchFeed($url);
            if ($xml === null) {
                continue;
            }

            $count = 0;
            foreach ($xml->channel->item as $item) {
                if ($count >= $limit) {
                    break;
                }

                $link = trim((string) $item->link);
                if ($link === '' || !str_starts_with($link, 'http')) {
                    continue;
                }

                if (Blog::where('external_source_url', $link)->exists()) {
                    $this->line("  already imported, skipping: {$link}");
                    $skipped++;
                    continue;
                }

                $descriptionHtml = (string) $item->description;
                $excerpt = $this->extractExcerpt($descriptionHtml);
                if ($excerpt === '') {
                    $this->warn("  no usable excerpt, skipping: {$link}");
                    $skipped++;
                    continue;
                }

                $title = $this->cleanTitle((string) $item->title);
                $image = $this->extractImage($item, $descriptionHtml);
                $content = $this->buildContent($excerpt);

                $count++;
                $imported++;

                if ($dryRun) {
                    $rows[] = [
                        'title' => $title,
                        'excerpt' => $excerpt,
                        'image' => $image,
                        'link' => $link,
                        'outlet' => $outlet,
                    ];
                    $this->line('  OK: ' . $title . ($image ? ' [image]' : ' [no image]'));
                } else {
                    Blog::create([
                        'title' => $title,
                        'content' => $content,
                        'image' => $image,
                        'external_source_url' => $link,
                        'user_id' => $editorialId,
                        'status' => 'approved',
                        'moderated_by' => $editorialId,
                        'moderated_at' => now(),
                    ]);
                    $this->line("  imported: {$title}");
                }
            }
        }

        if ($dryRun && !empty($rows)) {
            $path = storage_path('app/blogs-dry-run-' . now()->format('Y-m-d-His') . '.json');
            file_put_contents($path, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            $this->info("Dry-run details written to {$path}");
        }

        $this->info("\nDone. Imported: {$imported}, skipped: {$skipped}");

        return Command::SUCCESS;
    }

    /**
     * Mirrors ScrapeCharika's CA-bundle workaround for local Windows dev setups.
     */
    private function httpClient()
    {
        $client = Http::withHeaders(['User-Agent' => self::USER_AGENT])->timeout(15);

        $caBundle = storage_path('app/cacert.pem');
        if (file_exists($caBundle)) {
            $client = $client->withOptions(['verify' => $caBundle]);
        }

        return $client;
    }

    private function fetchFeed(string $url): ?SimpleXMLElement
    {
        try {
            $response = $this->httpClient()->get($url);
        } catch (\Throwable $e) {
            $this->warn("  request failed: {$e->getMessage()}");
            return null;
        }

        if (!$response->successful()) {
            $this->warn("  HTTP {$response->status()}, skipping feed");
            return null;
        }

        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($response->body());
        libxml_use_internal_errors(false);

        if ($xml === false || !isset($xml->channel->item)) {
            $this->warn('  could not parse feed XML, skipping');
            return null;
        }

        return $xml;
    }

    private function cleanTitle(string $raw): string
    {
        $title = html_entity_decode(trim($raw), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $title = preg_replace('/\s+/u', ' ', $title);
        return mb_substr($title, 0, 255);
    }

    /**
     * WordPress/Jetpack feeds append a boilerplate "The post ... appeared first on ..."
     * (or French "L'article ... est apparu en premier sur ...") paragraph to every
     * description - stripped here since we build our own attribution line separately.
     * Remaining HTML (including any leading <img> tags) is stripped to plain text since
     * we only want an excerpt, not a reproduction of the source's markup/full article.
     */
    private function extractExcerpt(string $descriptionHtml): string
    {
        $html = preg_replace('/<p>\s*(?:The post|L.article).*?<\/p>\s*$/isu', '', trim($descriptionHtml));

        $text = strip_tags($html ?? '');
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = trim(preg_replace('/\s+/u', ' ', $text));

        $maxLength = 400;
        if (mb_strlen($text) > $maxLength) {
            $text = mb_substr($text, 0, $maxLength);
            $text = preg_replace('/\s+\S*$/u', '', $text) . '…';
        }

        return $text;
    }

    private function extractImage(SimpleXMLElement $item, string $descriptionHtml): ?string
    {
        $media = $item->children('http://search.yahoo.com/mrss/');
        if (isset($media->content)) {
            $url = trim((string) $media->content->attributes()->url);
            if ($this->isValidImageUrl($url)) {
                return mb_substr($url, 0, 255);
            }
        }

        if (isset($item->enclosure)) {
            $url = trim((string) $item->enclosure->attributes()->url);
            $type = (string) $item->enclosure->attributes()->type;
            if ($this->isValidImageUrl($url) && ($type === '' || str_starts_with($type, 'image/'))) {
                return mb_substr($url, 0, 255);
            }
        }

        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $descriptionHtml, $m)) {
            $url = trim($m[1]);
            if ($this->isValidImageUrl($url)) {
                return mb_substr($url, 0, 255);
            }
        }

        return null;
    }

    private function isValidImageUrl(string $url): bool
    {
        return $url !== '' && (str_starts_with($url, 'http://') || str_starts_with($url, 'https://'));
    }

    /**
     * Content is rendered on the frontend via dangerouslySetInnerHTML, so this builds a
     * small fixed HTML shape from an already-plain-text/escaped value rather than ever
     * re-embedding raw feed HTML (the feed's own markup is discarded in extractExcerpt).
     * Attribution/link-back to the source lives in the `external_source_url` column and
     * is rendered as a proper "Continue reading" CTA on the frontend (BlogDetailPage),
     * not duplicated as inline text here.
     */
    private function buildContent(string $excerpt): string
    {
        return '<p>' . e($excerpt) . '</p>';
    }

    private function getOrCreateEditorialAccount(): int
    {
        $editor = User::firstOrCreate(
            ['email' => self::EDITORIAL_EMAIL],
            [
                'username' => 'indexma-editorial',
                'password' => bcrypt(str()->random(32)),
                'role' => 'superAdmin',
                'first_name' => 'IndexMA',
                'last_name' => 'Editorial',
            ]
        );

        return $editor->id;
    }
}
