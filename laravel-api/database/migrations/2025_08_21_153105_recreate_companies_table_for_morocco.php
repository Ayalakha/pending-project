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
        // Drop and recreate the companies table for Moroccan companies only
        Schema::dropIfExists('companies');
        
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->string('phone_number')->nullable();
            $table->decimal('capital', 15, 2)->nullable(); // Company capital in MAD
            $table->string('rc')->nullable(); // Registre de Commerce
            $table->enum('legal_form', ['SA', 'SARL', 'SARL_AU', 'SNC', 'SCS', 'SCA', 'EP', 'GIE', 'EI'])
                ->default('SARL'); // Moroccan legal forms
            $table->string('city')->nullable(); // Moroccan city
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
            ])->nullable(); // Moroccan regions
            $table->string('ice')->nullable()->unique(); // ICE number
            $table->string('cnss')->nullable(); // CNSS number
            $table->string('patent_number')->nullable(); // Patent number
            $table->string('activity_sector')->nullable(); // Business sector
            $table->date('incorporation_date')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes
            $table->index(['city', 'region']);
            $table->index(['legal_form', 'activity_sector']);
            $table->index(['rc', 'ice']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
