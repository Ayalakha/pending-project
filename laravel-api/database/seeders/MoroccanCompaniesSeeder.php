<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;

class MoroccanCompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the first user to be the owner, or create a test user
        $owner = User::first() ?? User::factory()->create([
            'username' => 'testowner',
            'email' => 'owner@test.ma',
            'role' => 'owner'
        ]);

        $companies = [
            [
                'name' => 'OCP Group',
                'description' => 'Office Chérifien des Phosphates - Leader mondial dans l\'industrie des phosphates et des engrais.',
                'website' => 'https://www.ocpgroup.ma',
                'phone_number' => '+212-522-230-000',
                'capital' => 8300000000.00,
                'rc' => 'RC001',
                'legal_form' => 'SA',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'ice' => '000001234000001',
                'cnss' => '1234567',
                'patent_number' => 'P001234',
                'activity_sector' => 'Énergie et mines',
                'incorporation_date' => '1920-08-07',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Attijariwafa Bank',
                'description' => 'Première banque du Maroc et leader bancaire au Maghreb et en Afrique de l\'Ouest.',
                'website' => 'https://www.attijariwafabank.com',
                'phone_number' => '+212-522-470-470',
                'capital' => 2035595850.00,
                'rc' => 'RC002',
                'legal_form' => 'SA',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'ice' => '000001234000002',
                'cnss' => '2345678',
                'patent_number' => 'P002345',
                'activity_sector' => 'Banques et assurances',
                'incorporation_date' => '1904-01-01',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Maroc Telecom',
                'description' => 'Opérateur de télécommunications leader au Maroc, filiale d\'Orange.',
                'website' => 'https://www.iam.ma',
                'phone_number' => '+212-537-717-171',
                'capital' => 5314616490.00,
                'rc' => 'RC003',
                'legal_form' => 'SA',
                'city' => 'Rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'ice' => '000001234000003',
                'cnss' => '3456789',
                'patent_number' => 'P003456',
                'activity_sector' => 'Télécommunications',
                'incorporation_date' => '1998-02-26',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'BMCE Bank',
                'description' => 'Banque marocaine d\'origine privée, acteur majeur du financement de l\'économie marocaine.',
                'website' => 'https://www.bmcebank.ma',
                'phone_number' => '+212-522-209-595',
                'capital' => 1315000000.00,
                'rc' => 'RC004',
                'legal_form' => 'SA',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'ice' => '000001234000004',
                'cnss' => '4567890',
                'patent_number' => 'P004567',
                'activity_sector' => 'Banques et assurances',
                'incorporation_date' => '1959-09-01',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'ONCF',
                'description' => 'Office National des Chemins de Fer - Société nationale marocaine de transport ferroviaire.',
                'website' => 'https://www.oncf.ma',
                'phone_number' => '+212-537-775-547',
                'capital' => 2000000000.00,
                'rc' => 'RC005',
                'legal_form' => 'EP',
                'city' => 'Rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'ice' => '000001234000005',
                'cnss' => '5678901',
                'patent_number' => 'P005678',
                'activity_sector' => 'Transport et logistique',
                'incorporation_date' => '1963-08-05',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ]
        ];

        foreach ($companies as $companyData) {
            Company::create($companyData);
        }
    }
}
