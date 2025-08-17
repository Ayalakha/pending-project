<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Company;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Get some users and companies
        $users = User::where('role', 'user')->take(5)->get();
        $companies = Company::take(3)->get();

        if ($users->count() === 0 || $companies->count() === 0) {
            $this->command->info('Skipping review seeder - no users or companies found');
            return;
        }

        $reviewData = [
            [
                'rating' => 5,
                'title' => 'Excellent Service!',
                'comment' => 'Outstanding customer service and high-quality products. I was impressed with their professionalism and attention to detail. Highly recommended!'
            ],
            [
                'rating' => 4,
                'title' => 'Very Good Experience',
                'comment' => 'Great experience overall. The team was responsive and delivered on time. There\'s always room for minor improvements, but I\'m satisfied with the service.'
            ],
            [
                'rating' => 5,
                'title' => 'Top Quality Work',
                'comment' => 'This company exceeded my expectations. The quality of work is exceptional and the pricing is fair. Will definitely work with them again.'
            ],
            [
                'rating' => 3,
                'title' => 'Average Service',
                'comment' => 'The service was okay. Nothing spectacular but they got the job done. Could improve communication and response times.'
            ],
            [
                'rating' => 4,
                'title' => 'Good Value for Money',
                'comment' => 'Decent service at a reasonable price. The team is knowledgeable and friendly. A few minor issues but overall a positive experience.'
            ],
            [
                'rating' => 5,
                'title' => 'Highly Professional',
                'comment' => 'Professional, reliable, and efficient. They understood our requirements perfectly and delivered exactly what we needed. Excellent communication throughout the project.'
            ],
            [
                'rating' => 2,
                'title' => 'Room for Improvement',
                'comment' => 'The service didn\'t meet my expectations. There were delays and some miscommunication. However, they did eventually resolve the issues.'
            ],
            [
                'rating' => 4,
                'title' => 'Solid Performance',
                'comment' => 'Good solid work. The team is experienced and knows what they\'re doing. Delivery was on schedule and the quality was good.'
            ]
        ];

        foreach ($companies as $company) {
            // Add reviews based on available users
            $reviewCount = min(count($users), 3); // Don't exceed available users
            $selectedUsers = $users->take($reviewCount);
            
            foreach ($selectedUsers as $index => $user) {
                // Skip if this user already reviewed this company
                if (Review::where('user_id', $user->id)->where('company_id', $company->id)->exists()) {
                    continue;
                }
                
                $reviewTemplate = $reviewData[$index % count($reviewData)];
                
                Review::create([
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'rating' => $reviewTemplate['rating'],
                    'title' => $reviewTemplate['title'],
                    'comment' => $reviewTemplate['comment'],
                    'is_verified' => rand(0, 1) === 1,
                    'is_approved' => true,
                    'helpful_votes' => [], // Start with no helpful votes
                ]);
            }
        }

        $this->command->info('Review seeder completed successfully!');
    }
}
