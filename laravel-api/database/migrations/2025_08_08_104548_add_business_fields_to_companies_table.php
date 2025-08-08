<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('logo')->nullable()->comment('URL or path to the company logo');
            $table->string('website')->nullable()->comment('Company website URL');
            $table->string('phone_number', 50)->nullable()->comment('Company contact number');
            $table->string('capital', 100)->nullable()->comment('Company capital');
            $table->string('rc', 100)->nullable()->comment('Company registration number');
            $table->string('legal_form', 100)->nullable()->comment('Legal form of the company, e.g., LLC, Corp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['logo', 'website', 'phone_number', 'capital', 'rc', 'legal_form']);
        });
    }
};
