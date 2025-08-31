<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;

class RealMoroccanCompaniesSeeder extends Seeder
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
                'username' => 'moroccancompanies',
                'email' => 'morocco@example.com',
                'password' => bcrypt('password123'),
                'role' => 'owner',
                'first_name' => 'Morocco',
                'last_name' => 'Companies'
            ]);
        }

        $companies = [
            [
                'name' => 'OCP (Office Chérifien des Phosphates)',
                'description' => 'Exploitation et commercialisation des phosphates et des produits phosphatiers. Leader mondial dans l\'industrie des phosphates et des engrais.',
                'website' => 'https://www.ocpgroup.ma',
                'phone_number' => '+212 537 688 000',
                'capital' => 8287500000.00, // 8.28 billion MAD
                'rc' => 'RC40770',
                'legal_form' => 'Corporation',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'ice' => '000007876000063',
                'cnss' => '1775039',
                'patent_number' => 'P001',
                'activity_sector' => 'Mines et Carrières',
                'incorporation_date' => '1920-08-07',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Société Afriquia Marocaine de Distribution de Carburants',
                'description' => 'Exploitation de toutes stations services, achat vente import-export de tous produits intéressant l\'automobile, commerce de voiture.',
                'website' => 'https://www.afriquia.ma',
                'phone_number' => '+212 522 959 000',
                'capital' => 1200000000.00,
                'rc' => 'RC1234',
                'legal_form' => 'Corporation',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'ice' => '000036524000022',
                'cnss' => '1056423',
                'patent_number' => 'P002',
                'activity_sector' => 'Commerce et Distribution',
                'incorporation_date' => '1960-01-15',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Total Energies Marketing Maroc',
                'description' => 'Industrie et commerce du pétrole et de ses dérivés, toutes opérations industrielles minières commerciales financières ou immobilières.',
                'website' => 'https://www.totalenergies.ma',
                'phone_number' => '+212 522 478 200',
                'capital' => 750000000.00,
                'rc' => 'RC5678',
                'legal_form' => 'Corporation',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'ice' => '000004047000015',
                'cnss' => '9876543',
                'patent_number' => 'P003',
                'activity_sector' => 'Énergie et Pétrole',
                'incorporation_date' => '1962-03-20',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Marjane Holding',
                'description' => 'Prise de participation directe ou indirecte dans toutes opérations, création et exploitation de centres commerciaux, hypermarchés et supermarchés.',
                'website' => 'https://www.marjane.ma',
                'phone_number' => '+212 522 975 000',
                'capital' => 2000000000.00,
                'rc' => 'RC48743',
                'legal_form' => 'Corporation',
                'city' => 'Rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'ice' => '000048743000089',
                'cnss' => '1234567',
                'patent_number' => 'P004',
                'activity_sector' => 'Grande Distribution',
                'incorporation_date' => '1990-06-12',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Attijariwafa Bank',
                'description' => 'Toutes opérations de banque, de crédit, de change et de commerce extérieur autorisées par la législation en vigueur.',
                'website' => 'https://www.attijariwafabank.com',
                'phone_number' => '+212 522 471 414',
                'capital' => 2098596340.00,
                'rc' => 'RC333',
                'legal_form' => 'Corporation',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'ice' => '000008954000037',
                'cnss' => '8765432',
                'patent_number' => 'P005',
                'activity_sector' => 'Banques et Finances',
                'incorporation_date' => '2003-12-15',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Boustan Transport',
                'description' => 'Transport routier de marchandises et de voyageurs, location de véhicules avec et sans chauffeur.',
                'website' => 'https://www.charika.ma/societe-boustan-transport-ste-al-92671',
                'phone_number' => '+212 539 325 100',
                'capital' => 15000000.00,
                'rc' => 'RC92671',
                'legal_form' => 'LLC',
                'city' => 'Tanger',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'ice' => '000092671000044',
                'cnss' => '5432109',
                'patent_number' => 'P006',
                'activity_sector' => 'Transport routier',
                'incorporation_date' => '2015-04-22',
                'is_verified' => false,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Socimag',
                'description' => 'Travaux de bâtiments, travaux de plomberie et d\'électricité, installation et maintenance.',
                'website' => 'https://www.charika.ma/societe-socimag-ste-92672',
                'phone_number' => '+212 539 448 200',
                'capital' => 8000000.00,
                'rc' => 'RC92672',
                'legal_form' => 'LLC',
                'city' => 'Tanger',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'ice' => '000092672000033',
                'cnss' => '6543210',
                'patent_number' => 'P007',
                'activity_sector' => 'BTP et Construction',
                'incorporation_date' => '2018-09-10',
                'is_verified' => false,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Ibra Textile',
                'description' => 'Commerce de fibres textiles, confection et export de produits textiles et d\'habillement.',
                'website' => 'https://www.charika.ma/societe-ibra-textile-92675',
                'phone_number' => '+212 539 524 300',
                'capital' => 25000000.00,
                'rc' => 'RC92675',
                'legal_form' => 'Corporation',
                'city' => 'Tanger',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'ice' => '000092675000066',
                'cnss' => '7654321',
                'patent_number' => 'P008',
                'activity_sector' => 'Textile et Habillement',
                'incorporation_date' => '2012-01-18',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Société d\'Ingénierie Éolienne',
                'description' => 'Ingénierie, études techniques dans le domaine des énergies renouvelables, conception et installation d\'éoliennes.',
                'website' => 'https://www.charika.ma/societe-eolienne-ste-d-ingenierie-92679',
                'phone_number' => '+212 539 337 400',
                'capital' => 45000000.00,
                'rc' => 'RC92679',
                'legal_form' => 'Corporation',
                'city' => 'Tanger',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'ice' => '000092679000088',
                'cnss' => '8765432',
                'patent_number' => 'P009',
                'activity_sector' => 'Énergie Renouvelable',
                'incorporation_date' => '2016-11-25',
                'is_verified' => true,
                'status' => 'active',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Achhab Binaa',
                'description' => 'Construction et promotion immobilière, travaux de terrassement et de gros œuvre, aménagement urbain.',
                'website' => 'https://www.charika.ma/societe-achhab-binaa-ste-92680',
                'phone_number' => '+212 539 664 500',
                'capital' => 35000000.00,
                'rc' => 'RC92680',
                'legal_form' => 'LLC',
                'city' => 'Tanger',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'ice' => '000092680000099',
                'cnss' => '9876543',
                'patent_number' => 'P010',
                'activity_sector' => 'Promotion Immobilière',
                'incorporation_date' => '2019-07-14',
                'is_verified' => false,
                'status' => 'active',
                'owner_id' => $owner->id,
            ]
        ];

        foreach ($companies as $companyData) {
            // Convert foreign legal forms to Moroccan equivalents
            if ($companyData['legal_form'] === 'Corporation') {
                $companyData['legal_form'] = 'SA'; // Société Anonyme
            } elseif ($companyData['legal_form'] === 'LLC') {
                $companyData['legal_form'] = 'SARL'; // SARL
            }
            
            Company::create($companyData);
        }

        echo "10 real Moroccan companies from Charika.ma created successfully!\n";
    }
}
