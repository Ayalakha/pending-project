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
            // Drop indexes first
            $table->dropIndex(['external_source', 'external_id']);
            
            // Remove external/global fields since we're focusing only on Moroccan companies
            $table->dropColumn(['external_id', 'external_source', 'external_data', 'jurisdiction', 'company_type', 'registered_address']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // Re-add the external fields if rolling back
            $table->string('external_id')->nullable();
            $table->string('external_source')->nullable();
            $table->json('external_data')->nullable();
            $table->string('jurisdiction')->nullable();
            $table->string('company_type')->nullable();
            $table->text('registered_address')->nullable();
        });
    }
};
