<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Blog;
use App\Models\Comment;
use App\Models\User;

echo "=== BLOG COMMENTS DEBUG ===\n\n";

// Check if blogs exist
$blogsCount = Blog::count();
echo "Total blogs: $blogsCount\n";

// Check if comments exist
$commentsCount = Comment::count();
echo "Total comments: $commentsCount\n";

// Check comments for first few blogs
$blogs = Blog::take(3)->get();
foreach ($blogs as $blog) {
    $commentCount = $blog->comments()->count();
    $approvedCommentCount = $blog->comments()->where('status', 'approved')->count();
    echo "\nBlog ID: {$blog->id} - {$blog->title}\n";
    echo "Total comments: $commentCount\n";
    echo "Approved comments: $approvedCommentCount\n";
    
    // Show first few comments
    $comments = $blog->comments()->with('user:id,username')->where('status', 'approved')->take(2)->get();
    foreach ($comments as $comment) {
        echo "  - Comment by {$comment->user->username}: " . substr($comment->content, 0, 50) . "...\n";
    }
}

echo "\n=== RECENT COMMENTS ===\n";
$recentComments = Comment::with(['blog:id,title', 'user:id,username'])
    ->where('status', 'approved')
    ->orderBy('created_at', 'desc')
    ->take(5)
    ->get();

foreach ($recentComments as $comment) {
    echo "Blog: {$comment->blog->title}\n";
    echo "User: {$comment->user->username}\n";
    echo "Comment: " . substr($comment->content, 0, 100) . "...\n";
    echo "Status: {$comment->status}\n";
    echo "---\n";
}
