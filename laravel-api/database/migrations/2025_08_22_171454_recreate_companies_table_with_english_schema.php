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
        // Drop and recreate the companies table with English business schema
        Schema::dropIfExists('companies');
        
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->string('phone_number')->nullable();
            $table->decimal('capital', 15, 2)->nullable(); // Company capital in USD
            $table->string('rc')->nullable(); // Registration Code
            $table->enum('legal_form', ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'LLP', 'S-Corp', 'C-Corp', 'Non-Profit'])
                ->default('LLC'); // English legal forms
            $table->string('city')->nullable(); // City
            $table->string('region')->nullable(); // State/Region
            $table->string('ice')->nullable(); // Tax ID/EIN
            $table->string('cnss')->nullable(); // Social Security Number
            $table->string('patent_number')->nullable(); // License number
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
