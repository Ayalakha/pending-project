<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;

class DummyCompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get an owner user to assign companies to
        $owner = User::where('role', 'owner')->first();
        
        if (!$owner) {
            echo "No owner user found. Creating one...\n";
            $owner = User::create([
                'username' => 'companyowner',
                'email' => 'companies@example.com',
                'password' => bcrypt('password123'),
                'role' => 'owner',
                'first_name' => 'Company',
                'last_name' => 'Owner'
            ]);
        }

        $companies = [
            [
                'name' => 'TechFlow Solutions',
                'description' => 'Leading software development company specializing in web and mobile applications. We help businesses transform their ideas into powerful digital solutions.',
                'website' => 'https://techflow.example.com',
                'phone_number' => '+1-555-0123',
                'capital' => 2500000.00,
                'rc' => 'REG001',
                'legal_form' => 'LLC',
                'city' => 'San Francisco',
                'region' => 'California',
                'ice' => '123456789012345',
                'cnss' => '987654321',
                'patent_number' => 'LIC001',
                'activity_sector' => 'Technology',
                'incorporation_date' => '2020-03-15',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Green Energy Corp',
                'description' => 'Renewable energy solutions provider focused on solar and wind power installations for residential and commercial properties.',
                'website' => 'https://greenenergy.example.com',
                'phone_number' => '+1-555-0234',
                'capital' => 5000000.00,
                'rc' => 'REG002',
                'legal_form' => 'Corporation',
                'city' => 'Austin',
                'region' => 'Texas',
                'ice' => '234567890123456',
                'cnss' => '876543210',
                'patent_number' => 'LIC002',
                'activity_sector' => 'Energy & Utilities',
                'incorporation_date' => '2019-07-22',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Urban Bistro',
                'description' => 'Modern restaurant chain offering farm-to-table dining experiences with locally sourced ingredients and contemporary cuisine.',
                'website' => 'https://urbanbistro.example.com',
                'phone_number' => '+1-555-0345',
                'capital' => 750000.00,
                'rc' => 'REG003',
                'legal_form' => 'Partnership',
                'city' => 'New York',
                'region' => 'New York',
                'ice' => '345678901234567',
                'cnss' => '765432109',
                'patent_number' => 'LIC003',
                'activity_sector' => 'Tourism & Hospitality',
                'incorporation_date' => '2021-01-10',
                'is_verified' => false,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'MediCare Plus',
                'description' => 'Healthcare technology company providing telemedicine solutions and digital health records management for clinics and hospitals.',
                'website' => 'https://medicareplus.example.com',
                'phone_number' => '+1-555-0456',
                'capital' => 3200000.00,
                'rc' => 'REG004',
                'legal_form' => 'LLC',
                'city' => 'Boston',
                'region' => 'Massachusetts',
                'ice' => '456789012345678',
                'cnss' => '654321098',
                'patent_number' => 'LIC004',
                'activity_sector' => 'Healthcare',
                'incorporation_date' => '2018-11-05',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'EduBright Academy',
                'description' => 'Online education platform offering professional development courses and certification programs for various industries.',
                'website' => 'https://edubright.example.com',
                'phone_number' => '+1-555-0567',
                'capital' => 1800000.00,
                'rc' => 'REG005',
                'legal_form' => 'Corporation',
                'city' => 'Seattle',
                'region' => 'Washington',
                'ice' => '567890123456789',
                'cnss' => '543210987',
                'patent_number' => 'LIC005',
                'activity_sector' => 'Education',
                'incorporation_date' => '2020-09-12',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'FinanceFlow',
                'description' => 'Fintech startup providing digital banking solutions and payment processing services for small and medium businesses.',
                'website' => 'https://financeflow.example.com',
                'phone_number' => '+1-555-0678',
                'capital' => 4500000.00,
                'rc' => 'REG006',
                'legal_form' => 'LLC',
                'city' => 'Chicago',
                'region' => 'Illinois',
                'ice' => '678901234567890',
                'cnss' => '432109876',
                'patent_number' => 'LIC006',
                'activity_sector' => 'Finance & Banking',
                'incorporation_date' => '2019-04-18',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'BuildRight Construction',
                'description' => 'Full-service construction company specializing in residential and commercial building projects with sustainable practices.',
                'website' => 'https://buildright.example.com',
                'phone_number' => '+1-555-0789',
                'capital' => 3800000.00,
                'rc' => 'REG007',
                'legal_form' => 'Corporation',
                'city' => 'Denver',
                'region' => 'Colorado',
                'ice' => '789012345678901',
                'cnss' => '321098765',
                'patent_number' => 'LIC007',
                'activity_sector' => 'Construction',
                'incorporation_date' => '2017-12-03',
                'is_verified' => false,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Logistics Express',
                'description' => 'Transportation and logistics company providing freight forwarding, warehousing, and supply chain management services.',
                'website' => 'https://logisticsexpress.example.com',
                'phone_number' => '+1-555-0890',
                'capital' => 2200000.00,
                'rc' => 'REG008',
                'legal_form' => 'LLC',
                'city' => 'Atlanta',
                'region' => 'Georgia',
                'ice' => '890123456789012',
                'cnss' => '210987654',
                'patent_number' => 'LIC008',
                'activity_sector' => 'Transportation',
                'incorporation_date' => '2020-06-08',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Fashion Forward',
                'description' => 'Contemporary fashion retailer offering trendy clothing and accessories through online and physical stores across the country.',
                'website' => 'https://fashionforward.example.com',
                'phone_number' => '+1-555-0901',
                'capital' => 1500000.00,
                'rc' => 'REG009',
                'legal_form' => 'Partnership',
                'city' => 'Los Angeles',
                'region' => 'California',
                'ice' => '901234567890123',
                'cnss' => '109876543',
                'patent_number' => 'LIC009',
                'activity_sector' => 'Retail & Commerce',
                'incorporation_date' => '2021-08-25',
                'is_verified' => false,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'CloudNine Consulting',
                'description' => 'Business consulting firm helping companies optimize their operations, improve efficiency, and develop strategic growth plans.',
                'website' => 'https://cloudnineconsulting.example.com',
                'phone_number' => '+1-555-1012',
                'capital' => 950000.00,
                'rc' => 'REG010',
                'legal_form' => 'LLC',
                'city' => 'Miami',
                'region' => 'Florida',
                'ice' => '012345678901234',
                'cnss' => '098765432',
                'patent_number' => 'LIC010',
                'activity_sector' => 'Professional Services',
                'incorporation_date' => '2022-02-14',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ]
        ];

        foreach ($companies as $companyData) {
            Company::create($companyData);
        }

        echo "10 dummy companies created successfully!\n";
    }
}
