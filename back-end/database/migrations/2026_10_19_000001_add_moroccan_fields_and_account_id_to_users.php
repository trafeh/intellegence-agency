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
        Schema::table('accounts', function (Blueprint $table) {
            $table->string('ice', 20)->nullable()->after('primary_contact');
            $table->string('if_number', 20)->nullable()->after('ice');
            $table->string('rc_number', 30)->nullable()->after('if_number');
            $table->string('patente', 20)->nullable()->after('rc_number');
            $table->string('tier', 10)->default('Tier B')->after('status');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('account_id')->nullable()->after('role')->constrained('accounts')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
            $table->dropColumn('account_id');
        });

        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn(['ice', 'if_number', 'rc_number', 'patente', 'tier']);
        });
    }
};
