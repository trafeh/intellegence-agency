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
        // 1. Accounts
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('industry')->nullable();
            $table->string('annual_revenue')->nullable();
            $table->string('city')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('status')->default('Active');
            $table->string('primary_contact')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 2. Leads
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('source')->nullable();
            $table->string('status')->default('New');
            $table->integer('ai_score')->default(50);
            $table->text('score_reason')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('account_id')->nullable()->constrained('accounts')->nullOnDelete();
            $table->timestamps();
        });

        // 3. Deals (Pipeline Opportunities)
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('amount', 14, 2);
            $table->string('stage')->default('leads'); // leads, qualification, discovery, proposal, negotiation, won, lost
            $table->integer('probability')->default(20);
            $table->date('expected_close_date')->nullable();
            $table->text('ai_recommendation')->nullable();
            $table->json('products')->nullable();
            $table->string('lost_reason')->nullable();
            $table->timestamps();
        });

        // 4. Quotes (Devis & Propositions)
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('quote_number')->unique();
            $table->foreignId('deal_id')->nullable()->constrained('deals')->nullOnDelete();
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('client_name')->nullable();
            $table->string('client_email')->nullable();
            $table->string('client_company')->nullable();
            $table->string('status')->default('Draft'); // Draft, Pending Approval, Sent, Accepted, Declined
            $table->decimal('subtotal', 14, 2)->default(0);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('discount_amount', 14, 2)->default(0);
            $table->boolean('discount_approved')->default(true);
            $table->decimal('tax_percent', 5, 2)->default(20);
            $table->decimal('tax_amount', 14, 2)->default(0);
            $table->decimal('total_amount', 14, 2)->default(0);
            $table->string('currency')->default('MAD');
            $table->date('expiry_date')->nullable();
            $table->string('public_token', 64)->unique();
            $table->timestamp('client_signed_at')->nullable();
            $table->string('client_signer_name')->nullable();
            $table->string('client_po_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 5. Quote Items
        Schema::create('quote_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained('quotes')->cascadeOnDelete();
            $table->string('description');
            $table->integer('qty')->default(1);
            $table->decimal('unit_price', 14, 2)->default(0);
            $table->decimal('total', 14, 2)->default(0);
            $table->timestamps();
        });

        // 6. Activities
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('deal_id')->nullable()->constrained('deals')->nullOnDelete();
            $table->foreignId('lead_id')->nullable()->constrained('leads')->nullOnDelete();
            $table->foreignId('account_id')->nullable()->constrained('accounts')->nullOnDelete();
            $table->string('type')->default('note'); // call, meeting, email, quote, note
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
        Schema::dropIfExists('quote_items');
        Schema::dropIfExists('quotes');
        Schema::dropIfExists('deals');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('accounts');
    }
};
