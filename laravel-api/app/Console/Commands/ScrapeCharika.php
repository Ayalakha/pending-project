<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\User;
use DOMDocument;
use DOMXPath;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ScrapeCharika extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:charika
                            {--limit=30 : Number of company URLs to attempt (not all will necessarily be imported)}
                            {--sitemap=0 : Which charika.ma sub-sitemap to pull company URLs from (sitemap-{n}.xml)}
                            {--delay=2 : Seconds to wait between requests}
                            {--dry-run : Do not write to the database; print what would be imported instead}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pull a small batch of real Moroccan companies from Charika.ma for dev/seed data (manual, one-off use only)';

    private const USER_AGENT = 'IndexMA-DevSeed/1.0 (one-off local development data import)';

    private const SYSTEM_OWNER_EMAIL = 'directory@indexma.com';

    /**
     * Charika's own legal-form labels (as printed on company pages) mapped to our
     * Moroccan legal_form enum. Anything not listed here is skipped, not force-fit
     * (e.g. "SOCIETE PAR ACTIONS SIMPLIFIEE" / SAS has no equivalent in our enum).
     */
    private const LEGAL_FORM_MAP = [
        'SOCIETE A RESPONSABILITE LIMITEE' => 'SARL',
        'SOCIETE A RESPONSABILITE LIMITEE D\'ASSOCIE UNIQUE' => 'SARL_AU',
        'SOCIETE A RESPONSABILITE LIMITEE A ASSOCIE UNIQUE' => 'SARL_AU',
        'SOCIETE ANONYME' => 'SA',
        'SOCIETE EN NOM COLLECTIF' => 'SNC',
        'SOCIETE EN COMMANDITE SIMPLE' => 'SCS',
        'SOCIETE EN COMMANDITE PAR ACTIONS' => 'SCA',
        'GROUPEMENT D\'INTERET ECONOMIQUE' => 'GIE',
        'ENTREPRISE INDIVIDUELLE' => 'EI',
        'PERSONNE PHYSIQUE' => 'EI',
        'ETABLISSEMENT PUBLIC' => 'EP',
    ];

    /**
     * Best-effort keyword classifier: free-text activity descriptions (as shown on each
     * company's own page) are matched against Charika's own 15-value sector taxonomy
     * (confirmed from the site's search-filter dropdown), since that categorized value
     * itself isn't printed on individual company pages. Order matters - first match wins,
     * so "Industries extractives" is deliberately checked LAST: its keywords ("mine" via
     * "carriere", "minier") are prone to appearing as secondary/incidental mentions in
     * otherwise clearly-manufacturing or construction activity text (e.g. a brick
     * manufacturer that also "exploite des carrieres" for raw material) - putting more
     * specific, common categories first lets the dominant activity win instead.
     */
    private const CHARIKA_SECTOR_KEYWORDS = [
        'Pêche, aquaculture' => ['peche', 'aquaculture', 'poisson'],
        'Agriculture, chasse, sylviculture' => ['agricole', 'agriculture', 'elevage', 'foret', 'sylviculture', 'chasse'],
        'Industries manufacturières' => ['fabrication', 'manufacture', 'usine', 'scierie', 'transformation', 'confection', 'tissage', 'filature', 'teinturerie', 'bonneterie', 'conserverie', 'conserve'],
        'Production et distribution d\'électricité, de gaz et d\'eau' => ['electricite', 'energie', 'gaz', 'distribution d\'eau'],
        'Bâtiment et travaux publics' => ['batiment', 'construction', 'travaux publics', 'btp', 'genie civil', 'beton', 'architecte', 'architecture', 'metre', 'promotion immobiliere', 'lotissement', 'plomberie'],
        'Commerce; réparations automobile et d\'articles domestiques' => ['commerc', 'negoc', 'distribution', 'reparation automobile', 'vente', 'marchand', 'import', 'export', 'grossiste', 'detaillant', 'consignation'],
        'Hôtels et Restaurants' => ['hotel', 'restaur', 'traiteur', 'boulangerie', 'patisserie', 'cafe', 'voyage', 'tourisme'],
        'Transports et Communications' => ['transport', 'logistique', 'telecommunication', 'fret'],
        'Activités financières' => ['banque', 'financ', 'assurance', 'credit'],
        'Immobiliers, location et services aux entreprises' => ['immobilier', 'location', 'conseil', 'ingenierie', 'informatique', 'bureau'],
        'Education' => ['education', 'enseignement', 'formation', 'ecole'],
        'Santé et action sociale' => ['sante', 'medical', 'clinique', 'pharmaceutique', 'action sociale'],
        'Services collectifs, sociaux et personnels' => ['services collectifs', 'associatif', 'culturel', 'sportif', 'comptable', 'fiduciaire'],
        'Services domestiques' => ['services domestiques', 'menage', 'aide a domicile'],
        'Industries extractives' => ['minier', 'carriere'],
    ];

    /**
     * Charika's own sector taxonomy translated to our BUSINESS_SECTORS list
     * (react/src/pages/CompanyFormPage.jsx). Two Charika buckets genuinely
     * conflate two concepts ("Transports et Communications", "Immobiliers,
     * location et services aux entreprises") - mapped to the dominant term.
     */
    private const SECTOR_TRANSLATION = [
        'Agriculture, chasse, sylviculture' => 'Agriculture & Food',
        'Pêche, aquaculture' => 'Agriculture & Food',
        'Industries extractives' => 'Other',
        'Industries manufacturières' => 'Manufacturing',
        'Production et distribution d\'électricité, de gaz et d\'eau' => 'Energy & Utilities',
        'Bâtiment et travaux publics' => 'Construction',
        'Commerce; réparations automobile et d\'articles domestiques' => 'Retail & Commerce',
        'Hôtels et Restaurants' => 'Tourism & Hospitality',
        'Transports et Communications' => 'Transportation',
        'Activités financières' => 'Finance & Banking',
        'Immobiliers, location et services aux entreprises' => 'Real Estate',
        'Education' => 'Education',
        'Santé et action sociale' => 'Healthcare',
        'Services collectifs, sociaux et personnels' => 'Professional Services',
        'Services domestiques' => 'Other',
    ];

    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        $sitemap = (int) $this->option('sitemap');
        $delay = (int) $this->option('delay');
        $dryRun = (bool) $this->option('dry-run');

        $this->info($dryRun
            ? "Dry run: attempting up to {$limit} companies from sitemap-{$sitemap}.xml (nothing will be written to the database)"
            : "Importing up to {$limit} companies from sitemap-{$sitemap}.xml");

        $urls = $this->fetchCompanyUrls($sitemap, $limit);
        if (empty($urls)) {
            $this->error('Could not read any company URLs from the sitemap. Aborting.');
            return Command::FAILURE;
        }

        $this->info('Found ' . count($urls) . ' company URLs to attempt.');

        $ownerId = $dryRun ? null : $this->getOrCreateSystemOwner();

        $imported = 0;
        $skipped = 0;
        $consecutiveFailures = 0;
        $rows = [];

        foreach ($urls as $index => $url) {
            if ($index > 0) {
                sleep($delay);
            }

            if ($consecutiveFailures >= 5) {
                $this->error('Too many consecutive failures, stopping early to avoid hammering the server.');
                break;
            }

            $this->line("Fetching: {$url}");

            try {
                $response = $this->httpClient()->get($url);
            } catch (\Throwable $e) {
                $this->warn("  request failed: {$e->getMessage()}");
                $consecutiveFailures++;
                $skipped++;
                continue;
            }

            if (!$response->successful()) {
                $this->warn("  HTTP {$response->status()}, skipping");
                $consecutiveFailures++;
                $skipped++;
                continue;
            }
            $consecutiveFailures = 0;

            if (!$dryRun && Company::where('external_source_url', $url)->exists()) {
                $this->line('  already imported, skipping');
                $skipped++;
                continue;
            }

            $data = $this->parseCompanyPage($response->body(), $url);

            if ($data === null) {
                $this->warn('  could not parse a company name, skipping');
                $skipped++;
                continue;
            }

            if ($data['legal_form'] === null) {
                $this->warn("  legal form '{$data['raw_legal_form']}' has no clean match in our enum, skipping");
                $skipped++;
                continue;
            }

            $rows[] = $data;
            $imported++;

            if ($dryRun) {
                $this->line("  OK: {$data['name']} | {$data['legal_form']} | {$data['activity_sector']} | {$data['city']}");
            } else {
                Company::create([
                    'name' => $data['name'],
                    'description' => null,
                    'website' => $data['website'],
                    'phone_number' => $data['phone_number'],
                    'capital' => $data['capital'],
                    'rc' => null,
                    'legal_form' => $data['legal_form'],
                    'city' => $data['city'],
                    'region' => null,
                    'ice' => null,
                    'cnss' => null,
                    'patent_number' => null,
                    'activity_sector' => $data['activity_sector'],
                    'incorporation_date' => null,
                    'is_verified' => false,
                    'status' => 'active',
                    'owner_id' => $ownerId,
                    'external_source_url' => $url,
                ]);
                $this->line("  imported: {$data['name']}");
            }
        }

        if ($dryRun && !empty($rows)) {
            $path = storage_path('app/charika-dry-run-' . now()->format('Y-m-d-His') . '.json');
            file_put_contents($path, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            $this->info("Dry-run details written to {$path}");
        }

        $this->info("\nDone. Imported: {$imported}, skipped: {$skipped}, total attempted: " . count($urls));

        return Command::SUCCESS;
    }

    /**
     * PHP's curl extension has no CA bundle configured on some Windows dev setups,
     * causing "unable to get local issuer certificate" on otherwise-valid HTTPS
     * requests. Point at a vendored Mozilla CA bundle when present, matching what
     * the system curl binary already trusts by default.
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

    /**
     * @return string[]
     */
    private function fetchCompanyUrls(int $sitemap, int $limit): array
    {
        try {
            $response = $this->httpClient()
                ->get("https://www.charika.ma/sitemap-{$sitemap}.xml");
        } catch (\Throwable $e) {
            $this->error("Failed to fetch sitemap: {$e->getMessage()}");
            return [];
        }

        if (!$response->successful()) {
            $this->error("Sitemap request returned HTTP {$response->status()}");
            return [];
        }

        preg_match_all('/<loc>(.*?)<\/loc>/', $response->body(), $matches);

        return array_slice($matches[1] ?? [], 0, $limit);
    }

    /**
     * @return array{name: string, website: string, phone_number: ?string, capital: ?float,
     *     legal_form: ?string, raw_legal_form: string, city: ?string, activity_sector: string}|null
     */
    private function parseCompanyPage(string $html, string $url): ?array
    {
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
        libxml_use_internal_errors(false);
        $xpath = new DOMXPath($dom);

        $name = $this->textContent($xpath, "//h1[contains(@class,'society-name')]//a");
        if ($name === null || $name === '') {
            return null;
        }

        $rawLegalForm = null;
        $capitalRaw = null;
        foreach ($xpath->query("//table[contains(@class,'informations-entreprise')]//tr") as $row) {
            $icon = $xpath->query(".//i", $row)->item(0);
            $iconClass = $icon?->getAttribute('class') ?? '';
            $valueCell = $xpath->query(".//td[2]", $row)->item(0);
            $value = $valueCell ? trim($valueCell->textContent) : null;

            if (str_contains($iconClass, 'folder-openicon')) {
                $rawLegalForm = $value;
            } elseif (str_contains($iconClass, 'moneyicon')) {
                $capitalRaw = $value;
            }
        }

        $phone = $this->textContent($xpath, "//i[contains(@class,'phoneicon')]/following-sibling::span[contains(@class,'marketingInfoTelFax')][1]")
            ?? $this->textContent($xpath, "//span[contains(@class,'mrg-fiche1')]/following-sibling::span[contains(@class,'marketingInfoTelFax')][1]");

        $activityRaw = $xpath->query("//div[contains(@class,'truncate-m')]//span[@title]")->item(0)?->getAttribute('title');
        $activityRaw = $activityRaw !== null ? trim($activityRaw) : '';

        $addressRaw = $this->textContent($xpath, "//span[contains(@class,'mrg-fiche0')]/following-sibling::span[1]/label");
        $city = $this->extractCity($addressRaw);

        return [
            'name' => trim($name),
            'website' => $url,
            'phone_number' => $phone !== null && $phone !== '' ? trim($phone) : null,
            'capital' => $this->parseCapital($capitalRaw),
            'legal_form' => $rawLegalForm !== null ? (self::LEGAL_FORM_MAP[$this->normalizeLegalForm($rawLegalForm)] ?? null) : null,
            'raw_legal_form' => $rawLegalForm ?? '(none listed)',
            'city' => $city,
            'activity_sector' => $this->classifySector($activityRaw),
        ];
    }

    private function textContent(DOMXPath $xpath, string $query): ?string
    {
        $node = $xpath->query($query)->item(0);
        if ($node === null) {
            return null;
        }
        $text = trim($node->textContent);
        return $text !== '' ? $text : null;
    }

    private function parseCapital(?string $raw): ?float
    {
        if ($raw === null) {
            return null;
        }
        $digits = preg_replace('/[^\d]/', '', $raw);
        return $digits !== '' ? (float) $digits : null;
    }

    private function extractCity(?string $address): ?string
    {
        if ($address === null || $address === '') {
            return null;
        }
        // Charika addresses end in "... <postal code> - <city>" or "... - <city>".
        // Some end in "- <district> (AR)" (an arrondissement of a larger city, e.g.
        // "Gueliz (AR)" in Marrakech) rather than the city itself - the "(AR)" marker
        // is stripped, but note this yields a district name, not always a full city.
        if (preg_match('/-\s*([^-\d]+?)\s*(?:\(AR\))?$/u', $address, $m)) {
            $city = trim($m[1]);
            return $city !== '' ? $city : null;
        }
        return null;
    }

    private function classifySector(string $activityText): string
    {
        $normalized = $this->stripAccents(mb_strtolower($activityText));

        foreach (self::CHARIKA_SECTOR_KEYWORDS as $bucket => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($normalized, $this->stripAccents($keyword))) {
                    return self::SECTOR_TRANSLATION[$bucket] ?? 'Other';
                }
            }
        }

        return 'Other';
    }

    private function normalizeLegalForm(string $raw): string
    {
        return strtoupper(trim($this->stripAccents($raw)));
    }

    /**
     * iconv's ASCII//TRANSLIT behaves inconsistently across platforms (on this
     * environment it renders "é" as "'e" rather than dropping the accent), so
     * accents are stripped via an explicit map instead.
     */
    private function stripAccents(string $text): string
    {
        static $map = [
            'à' => 'a', 'â' => 'a', 'ä' => 'a', 'á' => 'a',
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e',
            'ì' => 'i', 'î' => 'i', 'ï' => 'i', 'í' => 'i',
            'ò' => 'o', 'ô' => 'o', 'ö' => 'o', 'ó' => 'o',
            'ù' => 'u', 'û' => 'u', 'ü' => 'u', 'ú' => 'u',
            'ç' => 'c', 'ñ' => 'n', 'ÿ' => 'y',
            'À' => 'A', 'Â' => 'A', 'Ä' => 'A', 'Á' => 'A',
            'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E',
            'Ì' => 'I', 'Î' => 'I', 'Ï' => 'I', 'Í' => 'I',
            'Ò' => 'O', 'Ô' => 'O', 'Ö' => 'O', 'Ó' => 'O',
            'Ù' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ú' => 'U',
            'Ç' => 'C', 'Ñ' => 'N', 'Ÿ' => 'Y',
        ];

        return strtr($text, $map);
    }

    private function getOrCreateSystemOwner(): int
    {
        $owner = User::firstOrCreate(
            ['email' => self::SYSTEM_OWNER_EMAIL],
            [
                'username' => 'indexma-directory',
                'password' => bcrypt(str()->random(32)),
                'role' => 'owner',
                'first_name' => 'IndexMA',
                'last_name' => 'Directory',
            ]
        );

        return $owner->id;
    }
}
