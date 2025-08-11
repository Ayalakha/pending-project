<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Blog;
use App\Models\Comment;

class CheckComments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:comments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check blogs and comments in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $blogs = Blog::all(['id', 'title', 'user_id']);
        $this->info('Blogs in database:');
        foreach ($blogs as $blog) {
            $this->line("Blog ID: {$blog->id}, Title: {$blog->title}, Author ID: {$blog->user_id}");
        }
        
        $this->info('');
        $comments = Comment::with('user:id,username')->get(['id', 'content', 'user_id', 'blog_id']);
        $this->info('Comments in database:');
        foreach ($comments as $comment) {
            $username = $comment->user ? $comment->user->username : 'Unknown';
            $this->line("Comment ID: {$comment->id}, User: {$username} (ID: {$comment->user_id}), Blog ID: {$comment->blog_id}");
        }
        return 0;
    }
}
