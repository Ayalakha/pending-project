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
        // Update the companies table to use English legal forms and remove Moroccan-specific constraints
        Schema::table('companies', function (Blueprint $table) {
            // Drop the existing enum constraint and recreate with English legal forms
            $table->dropColumn('legal_form');
        });
        
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('legal_form', ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'LLP', 'S-Corp', 'C-Corp', 'Non-Profit'])
                ->default('LLC')->after('rc');
        });
        
        // Also update the region field to be a simple string instead of enum
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('region');
        });
        
        Schema::table('companies', function (Blueprint $table) {
            $table->string('region')->nullable()->after('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('legal_form');
        });
        
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('legal_form', ['SA', 'SARL', 'SARL_AU', 'SNC', 'SCS', 'SCA', 'EP', 'GIE', 'EI'])
                ->default('SARL')->after('rc');
        });
        
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('region');
        });
        
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('region', [
                'Tanger-Tétouan-Al Hoceïma',
                'Oriental', 
                'Fès-Meknès',
                'Rabat-Salé-Kénitra',
                'Béni Mellal-Khénifra',
                'Casablanca-Settat',
                'Marrakech-Safi',
                'Drâa-Tafilalet',
                'Souss-Massa',
                'Guelmim-Oued Noun',
                'Laâyoune-Sakia El Hamra',
                'Dakhla-Oued Ed-Dahab'
            ])->nullable()->after('city');
        });
    }
};
