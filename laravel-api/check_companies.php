<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Company;

echo "=== COMPANIES RESTORED ===\n";
echo "Total companies: " . Company::count() . "\n\n";

$companies = Company::select('id', 'name', 'city', 'legal_form')->get();

foreach ($companies as $company) {
    echo "ID: {$company->id}\n";
    echo "Name: {$company->name}\n";
    echo "City: {$company->city}\n";
    echo "Legal Form: {$company->legal_form}\n";
    echo "---\n";
}
