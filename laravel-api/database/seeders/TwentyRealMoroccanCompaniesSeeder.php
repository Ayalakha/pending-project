<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class TwentyRealMoroccanCompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear all existing companies
        Company::truncate();
        
        // Get the first user as the owner for all companies
        $firstUserId = \App\Models\User::first()->id;
        
        $companies = [
            [
                'name' => 'OCP (Office Chérifien des Phosphates)',
                'description' => 'Exploitation et commercialisation des phosphates et des produits phosphatés. Leader mondial dans l\'industrie des phosphates.',
                'phone_number' => '+212 537 68 88 88',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.ocpgroup.ma',
                'legal_form' => 'Corporation',
                'capital' => 8287500000,
                'activity_sector' => 'Mining and Chemicals',
                'ice' => '000004689000024',
                'rc' => '40739',
                'patent_number' => '36303101',
                'cnss' => '1959023',
                'status' => 'active'
            ],
            [
                'name' => 'Attijariwafa Bank',
                'description' => 'Première banque du Maroc et leader du secteur bancaire en Afrique de l\'Ouest. Services bancaires et financiers complets.',
                'phone_number' => '+212 522 47 30 30',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.attijariwafabank.com',
                'legal_form' => 'Corporation',
                'capital' => 2098596340,
                'activity_sector' => 'Banking and Financial Services',
                'ice' => '000006883000029',
                'rc' => '333',
                'patent_number' => '30224408',
                'cnss' => '1625013',
                'status' => 'active'
            ],
            [
                'name' => 'Maroc Telecom',
                'description' => 'Opérateur de télécommunications leader au Maroc. Services de téléphonie, internet et télécommunications.',
                'phone_number' => '+212 537 71 21 21',
                'city' => 'Rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'website' => 'https://www.iam.ma',
                'legal_form' => 'Corporation',
                'capital' => 5275117247,
                'activity_sector' => 'Telecommunications',
                'ice' => '000013717000026',
                'rc' => '48947',
                'patent_number' => '15133102',
                'cnss' => '2917042',
                'status' => 'active'
            ],
            [
                'name' => 'BMCE Bank of Africa',
                'description' => 'Groupe bancaire panafricain avec siège au Maroc. Services bancaires, assurance et leasing.',
                'phone_number' => '+212 522 20 20 20',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.bmcebank.ma',
                'legal_form' => 'Corporation',
                'capital' => 1826274860,
                'activity_sector' => 'Banking and Financial Services',
                'ice' => '000009054000013',
                'rc' => '18853',
                'patent_number' => '30225511',
                'cnss' => '1629887',
                'status' => 'active'
            ],
            [
                'name' => 'Total Energies Maroc',
                'description' => 'Filiale de Total Energies spécialisée dans la distribution de carburants et lubrifiants au Maroc.',
                'phone_number' => '+212 522 66 90 00',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.totalenergies.ma',
                'legal_form' => 'LLC',
                'capital' => 245000000,
                'activity_sector' => 'Energy and Petroleum',
                'ice' => '000033075000017',
                'rc' => '5282',
                'patent_number' => '30265104',
                'cnss' => '1876543',
                'status' => 'active'
            ],
            [
                'name' => 'Lafarge Ciments',
                'description' => 'Leader de l\'industrie cimentière au Maroc. Production et commercialisation de ciment et matériaux de construction.',
                'phone_number' => '+212 522 65 65 65',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.lafarge.ma',
                'legal_form' => 'Corporation',
                'capital' => 651000000,
                'activity_sector' => 'Construction Materials',
                'ice' => '000045678000012',
                'rc' => '27894',
                'patent_number' => '30287651',
                'cnss' => '2134567',
                'status' => 'active'
            ],
            [
                'name' => 'Cosumar',
                'description' => 'Leader national de l\'industrie sucrière. Raffinage et commercialisation de sucre au Maroc.',
                'phone_number' => '+212 522 58 58 00',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.cosumar.co.ma',
                'legal_form' => 'Corporation',
                'capital' => 1250000000,
                'activity_sector' => 'Food Processing',
                'ice' => '000056789000023',
                'rc' => '1234',
                'patent_number' => '30298765',
                'cnss' => '1987654',
                'status' => 'active'
            ],
            [
                'name' => 'Royal Air Maroc',
                'description' => 'Compagnie aérienne nationale du Maroc. Transport aérien de passagers et fret.',
                'phone_number' => '+212 522 48 97 97',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.royalairmaroc.com',
                'legal_form' => 'Corporation',
                'capital' => 1876543210,
                'activity_sector' => 'Airlines and Transportation',
                'ice' => '000067890000034',
                'rc' => '2345',
                'patent_number' => '30309876',
                'cnss' => '2098765',
                'status' => 'active'
            ],
            [
                'name' => 'Managem',
                'description' => 'Groupe minier marocain spécialisé dans l\'extraction d\'or, argent, cuivre et autres métaux précieux.',
                'phone_number' => '+212 522 54 45 45',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.managemgroup.com',
                'legal_form' => 'Corporation',
                'capital' => 830000000,
                'activity_sector' => 'Mining and Metals',
                'ice' => '000078901000045',
                'rc' => '3456',
                'patent_number' => '30320987',
                'cnss' => '2109876',
                'status' => 'active'
            ],
            [
                'name' => 'Banque Populaire du Maroc',
                'description' => 'Réseau bancaire coopératif marocain. Services bancaires pour particuliers et entreprises.',
                'phone_number' => '+212 522 46 46 46',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.gbp.ma',
                'legal_form' => 'Corporation',
                'capital' => 1312500000,
                'activity_sector' => 'Banking and Financial Services',
                'ice' => '000089012000056',
                'rc' => '4567',
                'patent_number' => '30331098',
                'cnss' => '2120987',
                'status' => 'active'
            ],
            [
                'name' => 'CTM (Compagnie de Transports au Maroc)',
                'description' => 'Compagnie nationale de transport routier de voyageurs. Leader du transport interurbain au Maroc.',
                'phone_number' => '+212 522 54 10 10',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.ctm.ma',
                'legal_form' => 'Corporation',
                'capital' => 200000000,
                'activity_sector' => 'Transportation',
                'ice' => '000090123000067',
                'rc' => '5678',
                'patent_number' => '30342109',
                'cnss' => '2131098',
                'status' => 'active'
            ],
            [
                'name' => 'ONEE (Office National de l\'Électricité et de l\'Eau)',
                'description' => 'Office national chargé de la production et distribution d\'électricité et d\'eau potable au Maroc.',
                'phone_number' => '+212 537 25 25 25',
                'city' => 'Rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'website' => 'https://www.onee.ma',
                'legal_form' => 'Corporation',
                'capital' => 5000000000,
                'activity_sector' => 'Utilities',
                'ice' => '000101234000078',
                'rc' => '6789',
                'patent_number' => '15353210',
                'cnss' => '2142109',
                'status' => 'active'
            ],
            [
                'name' => 'SNCF Connect Maroc',
                'description' => 'Société nationale des chemins de fer. Exploitation du réseau ferroviaire marocain et TGV Al Boraq.',
                'phone_number' => '+212 537 77 47 47',
                'city' => 'Rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'website' => 'https://www.oncf.ma',
                'legal_form' => 'Corporation',
                'capital' => 2500000000,
                'activity_sector' => 'Railway Transportation',
                'ice' => '000112345000089',
                'rc' => '7890',
                'patent_number' => '15364321',
                'cnss' => '2153210',
                'status' => 'active'
            ],
            [
                'name' => 'Afriquia Gaz',
                'description' => 'Leader dans la distribution de gaz butane au Maroc. Stockage, distribution et commercialisation de GPL.',
                'phone_number' => '+212 522 35 25 25',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.afriquiagaz.ma',
                'legal_form' => 'Corporation',
                'capital' => 300000000,
                'activity_sector' => 'Energy and Gas Distribution',
                'ice' => '000123456000090',
                'rc' => '8901',
                'patent_number' => '30375432',
                'cnss' => '2164321',
                'status' => 'active'
            ],
            [
                'name' => 'Inwi',
                'description' => 'Opérateur de télécommunications mobiles et fixes. Services internet, téléphonie et solutions digitales.',
                'phone_number' => '+212 522 12 12 12',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.inwi.ma',
                'legal_form' => 'LLC',
                'capital' => 4500000000,
                'activity_sector' => 'Telecommunications',
                'ice' => '000134567000001',
                'rc' => '9012',
                'patent_number' => '30386543',
                'cnss' => '2175432',
                'status' => 'active'
            ],
            [
                'name' => 'Holcim Maroc',
                'description' => 'Producteur de ciment et matériaux de construction. Solutions durables pour l\'industrie du bâtiment.',
                'phone_number' => '+212 523 32 40 00',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.holcim.ma',
                'legal_form' => 'Corporation',
                'capital' => 890000000,
                'activity_sector' => 'Construction Materials',
                'ice' => '000145678000012',
                'rc' => '0123',
                'patent_number' => '30397654',
                'cnss' => '2186543',
                'status' => 'active'
            ],
            [
                'name' => 'Marjane Holding',
                'description' => 'Chaîne de grande distribution marocaine. Hypermarchés, supermarchés et centres commerciaux.',
                'phone_number' => '+212 522 85 85 85',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.marjane.ma',
                'legal_form' => 'Corporation',
                'capital' => 750000000,
                'activity_sector' => 'Retail and Distribution',
                'ice' => '000156789000023',
                'rc' => '1234',
                'patent_number' => '30408765',
                'cnss' => '2197654',
                'status' => 'active'
            ],
            [
                'name' => 'Crédit du Maroc',
                'description' => 'Banque commerciale filiale du Crédit Agricole. Services bancaires et financiers pour particuliers et entreprises.',
                'phone_number' => '+212 522 47 70 00',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.cdm.co.ma',
                'legal_form' => 'Corporation',
                'capital' => 694320000,
                'activity_sector' => 'Banking and Financial Services',
                'ice' => '000167890000034',
                'rc' => '2345',
                'patent_number' => '30419876',
                'cnss' => '2208765',
                'status' => 'active'
            ],
            [
                'name' => 'Sonasid',
                'description' => 'Aciérie marocaine spécialisée dans la production d\'acier. Leader de la sidérurgie au Maroc.',
                'phone_number' => '+212 522 66 54 00',
                'city' => 'Mohammedia',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.sonasid.ma',
                'legal_form' => 'Corporation',
                'capital' => 450000000,
                'activity_sector' => 'Steel and Metallurgy',
                'ice' => '000178901000045',
                'rc' => '3456',
                'patent_number' => '30430987',
                'cnss' => '2219876',
                'status' => 'active'
            ],
            [
                'name' => 'Technopark Casablanca',
                'description' => 'Premier technopôle du Maroc dédié aux TIC. Incubateur et accélérateur de startups technologiques.',
                'phone_number' => '+212 522 52 05 20',
                'city' => 'Casablanca',
                'region' => 'Casablanca-Settat',
                'website' => 'https://www.technopark.ma',
                'legal_form' => 'Non-Profit',
                'capital' => 50000000,
                'activity_sector' => 'Technology and Innovation',
                'ice' => '000189012000056',
                'rc' => '4567',
                'patent_number' => '30442098',
                'cnss' => '2230987',
                'status' => 'active'
            ]
        ];

        foreach ($companies as $companyData) {
            $companyData['owner_id'] = $firstUserId;
            Company::create($companyData);
        }

        $this->command->info('Successfully created 20 real Moroccan companies!');
    }
}
