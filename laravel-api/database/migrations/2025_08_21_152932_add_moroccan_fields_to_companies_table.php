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
            // Check if columns exist before trying to drop them
            if (Schema::hasColumn('companies', 'external_id')) {
                $table->dropColumn('external_id');
            }
            if (Schema::hasColumn('companies', 'external_source')) {
                $table->dropColumn('external_source');
            }
            if (Schema::hasColumn('companies', 'external_data')) {
                $table->dropColumn('external_data');
            }
            if (Schema::hasColumn('companies', 'jurisdiction')) {
                $table->dropColumn('jurisdiction');
            }
            if (Schema::hasColumn('companies', 'company_type')) {
                $table->dropColumn('company_type');
            }
            if (Schema::hasColumn('companies', 'registered_address')) {
                $table->dropColumn('registered_address');
            }
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
