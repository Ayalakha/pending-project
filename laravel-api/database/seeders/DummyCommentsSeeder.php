<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\Blog;
use App\Models\User;

class DummyCommentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all blogs and users
        $blogs = Blog::all();
        $users = User::all();
        
        if ($blogs->isEmpty() || $users->isEmpty()) {
            echo "No blogs or users found. Please run the blog and user seeders first.\n";
            return;
        }

        $comments = [
            [
                'content' => 'Great insights on digital transformation! This really helps understand the importance of adapting to new technologies in today\'s business environment.',
                'status' => 'approved'
            ],
            [
                'content' => 'I completely agree with the points made about customer experience. In our company, we\'ve seen significant improvements after implementing some of these strategies.',
                'status' => 'approved'
            ],
            [
                'content' => 'Excellent article on remote work! The hybrid model is definitely the future. We\'ve been implementing this approach and seeing great results.',
                'status' => 'approved'
            ],
            [
                'content' => 'Sustainability is indeed crucial for modern businesses. This article provides practical steps that any company can implement.',
                'status' => 'approved'
            ],
            [
                'content' => 'The leadership section really resonated with me. Digital age leadership requires a completely different mindset and skill set.',
                'status' => 'approved'
            ],
            [
                'content' => 'As a small business owner, the innovation strategies mentioned here are very applicable. Thank you for sharing these practical tips!',
                'status' => 'approved'
            ],
            [
                'content' => 'AI is transforming our industry rapidly. This article gives a good overview of how businesses can leverage these technologies effectively.',
                'status' => 'approved'
            ],
            [
                'content' => 'Supply chain resilience has become so important, especially after recent global events. These strategies are very valuable.',
                'status' => 'approved'
            ],
            [
                'content' => 'Cybersecurity awareness is critical for all businesses today. This article covers the essential points every business owner should know.',
                'status' => 'approved'
            ],
            [
                'content' => 'Financial planning for growth is often overlooked by many businesses. These insights are extremely helpful for planning our company\'s future.',
                'status' => 'approved'
            ],
            [
                'content' => 'I\'ve implemented several of these digital transformation strategies in my organization and can confirm their effectiveness.',
                'status' => 'approved'
            ],
            [
                'content' => 'The customer experience focus has helped us retain more clients and improve our service quality significantly.',
                'status' => 'approved'
            ],
            [
                'content' => 'Remote work has been a game-changer for our team productivity. The tips mentioned here are spot on.',
                'status' => 'approved'
            ],
            [
                'content' => 'Sustainability practices not only help the environment but also improve our bottom line. Win-win situation!',
                'status' => 'approved'
            ],
            [
                'content' => 'Leadership in the digital age requires continuous learning. This article highlights the key areas to focus on.',
                'status' => 'approved'
            ]
        ];

        foreach ($comments as $index => $commentData) {
            // Assign comment to a random blog and user
            $commentData['blog_id'] = $blogs->random()->id;
            $commentData['user_id'] = $users->random()->id;
            
            Comment::create($commentData);
        }

        echo "15 dummy comments created successfully!\n";
    }
}
