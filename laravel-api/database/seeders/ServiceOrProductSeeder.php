<?php

namespace Database\Seeders;

use App\Models\ServiceOrProduct;
use App\Models\Company;
use Illuminate\Database\Seeder;

class ServiceOrProductSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $companies = Company::all();
        
        $servicesAndProducts = [
            // TechFlow Solutions
            1 => [
                ['name' => 'Custom Web Development', 'description' => 'Full-stack web application development using modern technologies', 'type' => 'service', 'price' => 5000.00],
                ['name' => 'Cloud Migration Services', 'description' => 'Complete cloud infrastructure setup and migration services', 'type' => 'service', 'price' => 8000.00],
                ['name' => 'Mobile App Development', 'description' => 'Native and cross-platform mobile application development', 'type' => 'service', 'price' => 12000.00],
            ],
            // Green Earth Consulting
            2 => [
                ['name' => 'Sustainability Assessment', 'description' => 'Comprehensive environmental impact assessment and recommendations', 'type' => 'service', 'price' => 2500.00],
                ['name' => 'Carbon Footprint Analysis', 'description' => 'Detailed analysis and reduction strategies for carbon emissions', 'type' => 'service', 'price' => 1800.00],
                ['name' => 'Eco-Friendly Business Solutions', 'description' => 'Implementation of sustainable business practices', 'type' => 'service', 'price' => 3500.00],
            ],
            // Metro Marketing Agency
            3 => [
                ['name' => 'Digital Marketing Strategy', 'description' => 'Comprehensive digital marketing campaigns and strategy development', 'type' => 'service', 'price' => 3000.00],
                ['name' => 'Social Media Management', 'description' => 'Complete social media presence management and content creation', 'type' => 'service', 'price' => 1500.00],
                ['name' => 'SEO Optimization', 'description' => 'Search engine optimization for improved online visibility', 'type' => 'service', 'price' => 2200.00],
            ],
            // HealthFirst Medical Center
            4 => [
                ['name' => 'General Health Checkups', 'description' => 'Comprehensive health examinations and preventive care', 'type' => 'service', 'price' => 150.00],
                ['name' => 'Specialized Consultations', 'description' => 'Expert medical consultations in various specialties', 'type' => 'service', 'price' => 300.00],
                ['name' => 'Telemedicine Services', 'description' => 'Remote medical consultations and health monitoring', 'type' => 'service', 'price' => 120.00],
            ],
            // Urban Architecture Studio
            5 => [
                ['name' => 'Residential Design', 'description' => 'Modern residential architecture and interior design services', 'type' => 'service', 'price' => 15000.00],
                ['name' => 'Commercial Architecture', 'description' => 'Innovative commercial building design and planning', 'type' => 'service', 'price' => 25000.00],
                ['name' => '3D Visualization', 'description' => 'Photorealistic 3D renders and architectural visualization', 'type' => 'service', 'price' => 800.00],
            ],
            // FoodCraft Catering
            6 => [
                ['name' => 'Corporate Catering', 'description' => 'Professional catering services for corporate events and meetings', 'type' => 'service', 'price' => 45.00],
                ['name' => 'Wedding Packages', 'description' => 'Complete wedding catering with customized menu options', 'type' => 'service', 'price' => 85.00],
                ['name' => 'Gourmet Meal Kits', 'description' => 'Pre-prepared gourmet meal kits for home cooking', 'type' => 'product', 'price' => 25.00],
            ],
        ];

        foreach ($companies as $index => $company) {
            $companyIndex = $index + 1;
            if (isset($servicesAndProducts[$companyIndex])) {
                foreach ($servicesAndProducts[$companyIndex] as $item) {
                    ServiceOrProduct::create([
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'type' => $item['type'],
                        'price' => $item['price'],
                        'company_id' => $company->id,
                    ]);
                }
            }
        }

        $this->command->info('Services and Products seeded successfully!');
    }
}
