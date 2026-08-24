<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get or create superAdmin user
        $superAdmin = User::firstOrCreate([
            'email' => 'superadmin@test.com'
        ], [
            'username' => 'Super Administrator',
            'first_name' => 'Super',
            'last_name' => 'Administrator',
            'password' => bcrypt('password'),
            'role' => 'superAdmin'
        ]);

        $blogs = [
            [
                'title' => 'Welcome to Our Business Directory Platform',
                'content' => 'We are excited to launch our comprehensive business directory platform that connects businesses with potential customers. Our platform features advanced search capabilities, detailed company profiles, and a robust service catalog.',
                'image' => 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
                'user_id' => $superAdmin->id
            ],
            [
                'title' => 'The Future of Digital Business Transformation',
                'content' => 'Digital transformation is no longer a luxury—it\'s a necessity for businesses to remain competitive in today\'s market. From cloud migration to mobile-first strategies, companies must embrace technology.',
                'image' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
                'user_id' => $superAdmin->id
            ],
            [
                'title' => 'Sustainable Business Practices: A Growing Trend',
                'content' => 'Environmental consciousness is reshaping how businesses operate. Companies are increasingly adopting sustainable practices not just for compliance, but as a competitive advantage.',
                'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                'user_id' => $superAdmin->id
            ]
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }

        $this->command->info('Blogs seeded successfully!');
    }
}
