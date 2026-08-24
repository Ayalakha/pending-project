<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get or create owner users
        $owners = [];
        for ($i = 1; $i <= 5; $i++) {
            $owners[] = User::firstOrCreate([
                'email' => "owner{$i}@business.com"
            ], [
                'username' => "Business Owner {$i}",
                'first_name' => 'Business',
                'last_name' => "Owner {$i}",
                'password' => bcrypt('password'),
                'role' => 'owner'
            ]);
        }

        // Sample companies with complete business information
        $companies = [
            [
                'name' => 'TechFlow Solutions',
                'description' => 'Leading software development company specializing in web and mobile applications. We help businesses transform their digital presence.',
                'logo' => 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
                'website' => 'https://techflow-solutions.com',
                'phone_number' => '+1-555-0123',
                'capital' => '2,500,000 USD',
                'rc' => 'RC-TECH-001',
                'legal_form' => 'LLC',
                'owner_id' => $owners[0]->id
            ],
            [
                'name' => 'Green Earth Consulting',
                'description' => 'Environmental consulting firm providing sustainable solutions for businesses. Expert advice on eco-friendly practices and compliance.',
                'logo' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
                'website' => 'https://greenearth-consulting.org',
                'phone_number' => '+1-555-0456',
                'capital' => '750,000 USD',
                'rc' => 'RC-GREEN-002',
                'legal_form' => 'Corporation',
                'owner_id' => $owners[1]->id
            ],
            [
                'name' => 'Metro Marketing Agency',
                'description' => 'Full-service digital marketing agency. We create compelling campaigns that drive results and build brand awareness.',
                'logo' => 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=200',
                'website' => 'https://metro-marketing.co',
                'phone_number' => '+1-555-0789',
                'capital' => '1,200,000 USD',
                'rc' => 'RC-METRO-003',
                'legal_form' => 'LLC',
                'owner_id' => $owners[2]->id
            ],
            [
                'name' => 'HealthFirst Medical Center',
                'description' => 'Modern healthcare facility offering comprehensive medical services. Committed to providing quality care with cutting-edge technology.',
                'logo' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200',
                'website' => 'https://healthfirst-medical.com',
                'phone_number' => '+1-555-0321',
                'capital' => '5,000,000 USD',
                'rc' => 'RC-HEALTH-004',
                'legal_form' => 'Corporation',
                'owner_id' => $owners[3]->id
            ],
            [
                'name' => 'Urban Architecture Studio',
                'description' => 'Award-winning architectural firm designing innovative spaces. We blend functionality with aesthetic appeal in every project.',
                'logo' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200',
                'website' => 'https://urban-architecture.studio',
                'phone_number' => '+1-555-0654',
                'capital' => '3,200,000 USD',
                'rc' => 'RC-URBAN-005',
                'legal_form' => 'Partnership',
                'owner_id' => $owners[4]->id
            ],
            [
                'name' => 'FoodCraft Catering',
                'description' => 'Premium catering services for events and corporate functions. Fresh ingredients, creative menus, exceptional service.',
                'logo' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200',
                'website' => 'https://foodcraft-catering.com',
                'phone_number' => '+1-555-0987',
                'capital' => '850,000 USD',
                'rc' => 'RC-FOOD-006',
                'legal_form' => 'LLC',
                'owner_id' => $owners[0]->id
            ]
        ];

        foreach ($companies as $companyData) {
            Company::create($companyData);
        }

        $this->command->info('Companies seeded successfully!');
    }
}
