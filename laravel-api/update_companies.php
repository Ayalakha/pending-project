<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Update existing companies to have approved status
$companies = App\Models\Company::all();
echo "Total companies: " . $companies->count() . "\n";

foreach ($companies as $company) {
    if (empty($company->status)) {
        $company->status = 'approved';
        $company->save();
        echo "Updated company: " . $company->name . " to approved\n";
    } else {
        echo "Company: " . $company->name . " already has status: " . $company->status . "\n";
    }
}

echo "Done updating companies!\n";
