<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Activity;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CrmAuthorizationAndQuoteLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_protected_routes_reject_unauthenticated_requests(): void
    {
        $this->getJson('/api/deals')->assertUnauthorized();
        $this->getJson('/api/analytics/kpis')->assertUnauthorized();
        $this->postJson('/api/activities', [])->assertUnauthorized();
    }

    public function test_login_returns_the_normal_success_response_for_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'login-check@example.test',
            'password' => 'test-login-password',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'test-login-password',
        ])->assertOk()->assertJsonStructure([
            'success', 'token', 'user' => ['id', 'email'],
        ])->assertJsonPath('success', true);
    }

    public function test_login_attempts_are_rate_limited_with_a_consistent_429_response(): void
    {
        $credentials = ['email' => 'limited-login@example.test', 'password' => 'incorrect-test-password'];

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/auth/login', $credentials)->assertUnauthorized();
        }

        $this->postJson('/api/auth/login', $credentials)
            ->assertStatus(429)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Too many login attempts. Please try again later.')
            ->assertHeader('Retry-After');
    }

    public function test_client_cannot_read_or_write_another_accounts_records(): void
    {
        $accountA = $this->account('Account A');
        $accountB = $this->account('Account B');
        $client = User::factory()->create(['role' => 'client', 'account_id' => $accountA->id]);
        $dealB = $this->deal($accountB);
        $quoteB = $this->quote($accountB, $dealB);
        $activityB = Activity::create([
            'user_id' => User::factory()->create(['role' => 'rep'])->id,
            'account_id' => $accountB->id,
            'deal_id' => $dealB->id,
            'title' => 'Private activity',
            'type' => 'note',
        ]);

        Sanctum::actingAs($client);

        $this->getJson("/api/accounts/{$accountB->id}")->assertNotFound();
        $this->putJson("/api/accounts/{$accountB->id}", ['name' => 'stolen'])->assertForbidden();
        $this->getJson("/api/deals/{$dealB->id}")->assertNotFound();
        $this->putJson("/api/deals/{$dealB->id}/stage", ['stage' => 'won'])->assertForbidden();
        $this->getJson("/api/quotes/{$quoteB->id}")->assertNotFound();
        $this->getJson('/api/activities')->assertOk()->assertJsonPath('data', []);
        $this->putJson("/api/quotes/{$quoteB->id}", ['client_name' => 'Changed'])->assertForbidden();
        $this->postJson("/api/quotes/{$quoteB->id}/record-acceptance", ['client_signer_name' => 'Client'])->assertForbidden();
        $this->postJson("/api/activities/{$activityB->id}/complete")->assertForbidden();
        $this->putJson("/api/accounts/{$accountB->id}", ['name' => 'Changed'])->assertForbidden();
        $this->postJson('/api/accounts', ['name' => 'Unauthorized'])->assertForbidden();

        $this->assertDatabaseHas('accounts', ['id' => $accountB->id, 'name' => 'Account B']);
        $this->assertDatabaseHas('quotes', ['id' => $quoteB->id, 'status' => 'Sent']);
    }

    public function test_representative_cannot_read_or_change_another_representatives_records(): void
    {
        $account = $this->account('Shared Customer');
        $repA = User::factory()->create(['role' => 'rep']);
        $repB = User::factory()->create(['role' => 'rep']);
        $dealB = $this->deal($account, $repB);
        $quoteB = $this->quote($account, $dealB, $repB);
        $leadB = Lead::create(['name' => 'Assigned Lead', 'company' => 'Company B', 'user_id' => $repB->id]);
        $activityB = Activity::create([
            'user_id' => $repB->id,
            'account_id' => $account->id,
            'deal_id' => $dealB->id,
            'title' => 'Other rep activity',
            'type' => 'note',
        ]);

        Sanctum::actingAs($repA);
        $this->getJson("/api/deals/{$dealB->id}")->assertNotFound();
        $this->putJson("/api/deals/{$dealB->id}/stage", ['stage' => 'negotiation'])->assertNotFound();
        $this->getJson("/api/quotes/{$quoteB->id}")->assertNotFound();
        $this->deleteJson("/api/quotes/{$quoteB->id}")->assertNotFound();
        $this->getJson("/api/leads/{$leadB->id}")->assertNotFound();
        $this->postJson("/api/activities/{$activityB->id}/complete")->assertNotFound();
    }

    public function test_representative_account_counts_include_only_deals_and_quotes_they_can_access(): void
    {
        $account = $this->account('Shared Count Account');
        $repA = User::factory()->create(['role' => 'rep']);
        $repB = User::factory()->create(['role' => 'rep']);
        $dealA = $this->deal($account, $repA);
        $dealB = $this->deal($account, $repB);
        $this->quote($account, $dealA, $repA);
        $this->quote($account, $dealB, $repB);

        Sanctum::actingAs($repA);
        $this->getJson('/api/accounts')->assertOk()
            ->assertJsonPath('data.0.deals_count', 1)
            ->assertJsonPath('data.0.quotes_count', 1);

        Sanctum::actingAs($repB);
        $this->getJson('/api/accounts')->assertOk()
            ->assertJsonPath('data.0.deals_count', 1)
            ->assertJsonPath('data.0.quotes_count', 1);
    }

    public function test_client_activity_responses_expose_only_staff_id_and_name(): void
    {
        $account = $this->account('Client Activity Account');
        $client = User::factory()->create(['role' => 'client', 'account_id' => $account->id]);
        $staff = User::factory()->create([
            'role' => 'rep',
            'email' => 'private-staff@example.test',
            'phone' => '+212600000001',
            'title' => 'Private title',
            'quota' => 987654,
        ]);
        Activity::create([
            'user_id' => $staff->id,
            'account_id' => $account->id,
            'title' => 'Client-visible meeting',
            'type' => 'meeting',
        ]);

        Sanctum::actingAs($client);
        $activityResponse = $this->getJson('/api/activities')->assertOk();
        $this->assertSame(['id', 'name'], array_keys($activityResponse->json('data.0.user')));
        $this->assertSame($staff->name, $activityResponse->json('data.0.user.name'));

        $analyticsResponse = $this->getJson('/api/analytics/kpis')->assertOk();
        $recentUser = $analyticsResponse->json('data.recent_activities.0.user');
        $this->assertSame(['id', 'name'], array_keys($recentUser));
        $this->assertSame($staff->name, $recentUser['name']);
    }

    public function test_related_quotes_are_also_scoped_when_records_have_mismatched_account_links(): void
    {
        $accountA = $this->account('Related Account A');
        $accountB = $this->account('Related Account B');
        $client = User::factory()->create(['role' => 'client', 'account_id' => $accountA->id]);
        $dealA = $this->deal($accountA);
        $this->quote($accountB, $dealA);

        Sanctum::actingAs($client);
        $this->getJson("/api/deals/{$dealA->id}")
            ->assertOk()
            ->assertJsonPath('data.quotes', []);
        $this->getJson("/api/accounts/{$accountA->id}")
            ->assertOk()
            ->assertJsonPath('data.quotes', [])
            ->assertJsonPath('data.deals.0.quotes', []);
    }

    public function test_representative_cannot_assign_records_to_another_user(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $other = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Owned Account', $rep);
        Sanctum::actingAs($rep);

        $this->postJson('/api/leads', [
            'name' => 'Lead', 'company' => 'New Co', 'user_id' => $other->id,
        ])->assertUnprocessable();

        $this->postJson('/api/deals', [
            'title' => 'Deal', 'account_id' => $account->id, 'amount' => 100, 'user_id' => $other->id,
        ])->assertUnprocessable();

        $this->postJson('/api/quotes', [
            'account_id' => $account->id,
            'user_id' => $other->id,
            'items' => [['description' => 'Service', 'qty' => 1, 'unit_price' => 100]],
        ])->assertUnprocessable();
    }

    public function test_manager_can_assign_and_reassign_deals_to_a_representative(): void
    {
        $manager = User::factory()->create(['role' => 'manager']);
        $repA = User::factory()->create(['role' => 'rep', 'name' => 'Rep A']);
        $repB = User::factory()->create(['role' => 'rep', 'name' => 'Rep B']);
        $account = $this->account('Managed Account', $manager);
        Sanctum::actingAs($manager);

        // Manager creates deal assigned to Rep A
        $createRes = $this->postJson('/api/deals', [
            'title' => 'Assigned Deal',
            'account_id' => $account->id,
            'amount' => 50000,
            'user_id' => $repA->id,
        ])->assertCreated();

        $dealId = $createRes->json('data.id');
        $this->assertDatabaseHas('deals', ['id' => $dealId, 'user_id' => $repA->id]);

        // Manager reassigns deal to Rep B
        $this->putJson("/api/deals/{$dealId}", [
            'user_id' => $repB->id,
        ])->assertOk();

        $this->assertDatabaseHas('deals', ['id' => $dealId, 'user_id' => $repB->id]);
        $this->assertDatabaseHas('activities', ['deal_id' => $dealId, 'type' => 'deal_assigned']);
    }

    public function test_unassigned_lead_is_claimed_when_a_representative_updates_it_and_cannot_be_converted_twice(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $lead = Lead::create(['name' => 'Inbound', 'company' => 'Prospect', 'status' => 'New']);
        Sanctum::actingAs($rep);

        $this->putJson("/api/leads/{$lead->id}", ['status' => 'Qualified'])->assertOk();
        $this->assertDatabaseHas('leads', ['id' => $lead->id, 'user_id' => $rep->id]);
        $this->postJson("/api/leads/{$lead->id}/convert", ['deal_amount' => 100])->assertOk();
        $this->postJson("/api/leads/{$lead->id}/convert", ['deal_amount' => 100])->assertStatus(409);
        $this->assertDatabaseCount('deals', 1);
    }

    public function test_discount_approval_is_manager_only_and_cannot_be_bypassed_by_status_or_send_routes(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $manager = User::factory()->create(['role' => 'manager']);
        $account = $this->account('Approval Account', $rep);
        $quote = $this->quote($account, null, $rep, ['status' => 'Pending Approval', 'discount_percent' => 20, 'discount_approved' => false]);

        Sanctum::actingAs($rep);
        $this->postJson("/api/quotes/{$quote->id}/approve-discount")->assertForbidden();
        $this->postJson("/api/quotes/{$quote->id}/send")->assertForbidden();
        $this->postJson("/api/public/quotes/{$quote->public_token}/accept", ['signer_name' => 'Signer'])->assertStatus(409);
        $this->putJson("/api/quotes/{$quote->id}", ['status' => 'Accepted'])->assertUnprocessable();
        $this->assertDatabaseHas('quotes', ['id' => $quote->id, 'status' => 'Pending Approval', 'discount_approved' => false]);

        Sanctum::actingAs($manager);
        $this->postJson("/api/quotes/{$quote->id}/approve-discount")->assertOk();
        $this->assertDatabaseHas('quotes', ['id' => $quote->id, 'status' => 'Sent', 'discount_approved' => true]);
    }

    public function test_public_acceptance_rejects_expired_and_revoked_quotes(): void
    {
        $owner = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Portal Account', $owner);
        $expired = $this->quote($account, null, $owner, ['expiry_date' => now()->subDay(), 'status' => 'Sent']);
        $revoked = $this->quote($account, null, $owner, ['status' => 'Sent']);

        $this->postJson("/api/public/quotes/{$expired->public_token}/accept", ['signer_name' => 'Client Signer'])->assertStatus(410);
        Sanctum::actingAs($owner);
        $this->postJson("/api/quotes/{$revoked->id}/revoke-public-token")->assertOk();
        Auth::forgetGuards();
        $this->getJson("/api/public/quotes/{$revoked->public_token}")->assertStatus(410);
        $this->postJson("/api/public/quotes/{$revoked->public_token}/accept", ['signer_name' => 'Client Signer'])->assertStatus(410);
        $this->assertDatabaseHas('quotes', ['id' => $expired->id, 'status' => 'Sent']);
    }

    public function test_acceptance_is_idempotent_and_only_wins_the_quote_associated_deal(): void
    {
        $owner = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Signing Account', $owner);
        $otherAccount = $this->account('Unrelated Account');
        $deal = $this->deal($account, $owner, ['stage' => 'negotiation']);
        $unrelatedDeal = $this->deal($otherAccount, null, ['stage' => 'negotiation']);
        $quote = $this->quote($account, $deal, $owner, ['status' => 'Sent', 'expiry_date' => now()->addDays(2)]);

        $payload = ['signer_name' => 'Authorized Signer', 'po_number' => 'PO-42'];
        $this->postJson("/api/public/quotes/{$quote->public_token}/accept", $payload)->assertOk()->assertJsonPath('already_accepted', null);
        $this->postJson("/api/public/quotes/{$quote->public_token}/accept", $payload)->assertOk()->assertJsonPath('already_accepted', true);

        $this->assertDatabaseHas('quotes', ['id' => $quote->id, 'status' => 'Accepted', 'client_po_number' => 'PO-42']);
        $this->assertDatabaseHas('deals', ['id' => $deal->id, 'stage' => 'won']);
        $this->assertDatabaseHas('deals', ['id' => $unrelatedDeal->id, 'stage' => 'negotiation']);
        $this->assertSame(1, Activity::where('title', 'like', '%bon de commande reçu%')->count());
    }

    public function test_representative_cannot_mark_a_deal_won_without_eligible_quote_acceptance(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Stage Account', $rep);
        $deal = $this->deal($account, $rep);
        Sanctum::actingAs($rep);

        $this->putJson("/api/deals/{$deal->id}/stage", ['stage' => 'won'])->assertUnprocessable();
        $this->putJson("/api/deals/{$deal->id}", ['stage' => 'won'])->assertUnprocessable();
        $this->assertDatabaseHas('deals', ['id' => $deal->id, 'stage' => 'leads']);
    }

    public function test_activity_creation_is_idempotent_for_the_same_key_and_payload(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Idempotency Account', $rep);
        $deal = $this->deal($account, $rep);
        Sanctum::actingAs($rep);
        $key = (string) \Illuminate\Support\Str::uuid();
        $payload = ['deal_id' => $deal->id, 'type' => 'call', 'title' => 'Discuss proposal', 'description' => 'Retry safe'];
        $headers = ['Idempotency-Key' => $key];

        $this->postJson('/api/activities', $payload, $headers)->assertCreated();
        $this->postJson('/api/activities', $payload, $headers)->assertOk();

        $this->assertDatabaseCount('activities', 1);
    }

    public function test_activity_creation_rejects_reusing_a_key_with_a_different_payload(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Changed Payload Account', $rep);
        $deal = $this->deal($account, $rep);
        Sanctum::actingAs($rep);
        $key = (string) \Illuminate\Support\Str::uuid();
        $headers = ['Idempotency-Key' => $key];

        $this->postJson('/api/activities', ['deal_id' => $deal->id, 'type' => 'call', 'title' => 'Original'], $headers)->assertCreated();
        $this->postJson('/api/activities', ['deal_id' => $deal->id, 'type' => 'call', 'title' => 'Changed'], $headers)->assertStatus(409);

        $this->assertDatabaseCount('activities', 1);
        $this->assertDatabaseHas('activities', ['title' => 'Original']);
    }

    public function test_database_unique_index_rejects_duplicate_activity_keys_for_one_user(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $key = (string) \Illuminate\Support\Str::uuid();
        $attributes = [
            'user_id' => $rep->id,
            'type' => 'note',
            'title' => 'Indexed activity',
            'idempotency_key' => $key,
            'idempotency_hash' => hash('sha256', 'payload'),
        ];
        Activity::create($attributes);

        try {
            Activity::create($attributes);
            $this->fail('The database accepted a duplicate activity idempotency key.');
        } catch (QueryException) {
            $this->assertDatabaseCount('activities', 1);
        }
    }

    public function test_repeated_stage_request_with_same_key_creates_only_one_stage_activity(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Stage Retry Account', $rep);
        $deal = $this->deal($account, $rep);
        Sanctum::actingAs($rep);
        $headers = ['Idempotency-Key' => (string) \Illuminate\Support\Str::uuid()];

        $this->putJson("/api/deals/{$deal->id}/stage", ['stage' => 'negotiation'], $headers)->assertOk();
        $this->putJson("/api/deals/{$deal->id}/stage", ['stage' => 'negotiation'], $headers)->assertOk();

        $this->assertDatabaseHas('deals', ['id' => $deal->id, 'stage' => 'negotiation']);
        $this->assertSame(1, Activity::where('deal_id', $deal->id)->count());
    }

    public function test_rejected_stage_transition_does_not_create_activity(): void
    {
        $rep = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Rejected Stage Account', $rep);
        $deal = $this->deal($account, $rep);
        Sanctum::actingAs($rep);

        $this->putJson("/api/deals/{$deal->id}/stage", ['stage' => 'won'], [
            'Idempotency-Key' => (string) \Illuminate\Support\Str::uuid(),
        ])->assertUnprocessable();

        $this->assertDatabaseCount('activities', 0);
        $this->assertDatabaseHas('deals', ['id' => $deal->id, 'stage' => 'leads']);
    }

    public function test_activity_creation_still_enforces_representative_record_scope(): void
    {
        $repA = User::factory()->create(['role' => 'rep']);
        $repB = User::factory()->create(['role' => 'rep']);
        $account = $this->account('Other Rep Account', $repB);
        $deal = $this->deal($account, $repB);
        Sanctum::actingAs($repA);

        $this->postJson('/api/activities', [
            'deal_id' => $deal->id,
            'type' => 'call',
            'title' => 'Unauthorized activity',
        ], ['Idempotency-Key' => (string) \Illuminate\Support\Str::uuid()])->assertNotFound();

        $this->assertDatabaseCount('activities', 0);
    }

    public function test_analytics_are_scoped_to_the_clients_account(): void
    {
        $accountA = $this->account('Analytics A');
        $accountB = $this->account('Analytics B');
        $client = User::factory()->create(['role' => 'client', 'account_id' => $accountA->id]);
        $dealA = $this->deal($accountA, null, ['amount' => 1000, 'stage' => 'proposal']);
        $dealB = $this->deal($accountB, null, ['amount' => 9000, 'stage' => 'proposal']);
        $this->quote($accountA, $dealA, null, ['status' => 'Accepted']);
        $this->quote($accountB, $dealB, null, ['status' => 'Sent']);
        Activity::create(['user_id' => User::factory()->create(['role' => 'rep'])->id, 'account_id' => $accountA->id, 'title' => 'Visible', 'type' => 'note']);
        Activity::create(['user_id' => User::factory()->create(['role' => 'rep'])->id, 'account_id' => $accountB->id, 'title' => 'Hidden', 'type' => 'note']);

        Sanctum::actingAs($client);
        $response = $this->getJson('/api/analytics/kpis')->assertOk();
        $this->assertEquals(1000, $response->json('data.total_pipeline'));
        $this->assertEquals(1, $response->json('data.active_accounts_count'));
        $this->assertEquals(100, $response->json('data.quote_acceptance_rate'));
        $this->assertSame(['Visible'], collect($response->json('data.recent_activities'))->pluck('title')->all());
    }

    public function test_only_managers_and_admins_can_list_users(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'rep']));
        $this->getJson('/api/users')->assertForbidden();
        Sanctum::actingAs(User::factory()->create(['role' => 'manager']));
        $this->getJson('/api/users')->assertOk();
    }

    public function test_public_proposal_creates_lead_account_and_client_user(): void
    {
        $payload = [
            'name' => 'Sara Chraibi',
            'company' => 'Atlas Agro SARL',
            'email' => 'sara@atlasagro.ma',
            'phone' => '+212 661 99 88 77',
            'city' => 'Meknès',
            'team_size' => '200 000 – 500 000 MAD',
            'notes' => 'Demande de devis pour commande en gros de produits frais.',
        ];

        $response = $this->postJson('/api/public/proposals', $payload);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);

        // Assert Account was automatically created
        $this->assertDatabaseHas('accounts', [
            'name' => 'Atlas Agro SARL',
            'city' => 'Meknès',
            'email' => 'sara@atlasagro.ma',
            'primary_contact' => 'Sara Chraibi',
        ]);

        $account = Account::where('name', 'Atlas Agro SARL')->first();
        $this->assertNotNull($account);

        // Assert Lead was automatically created with account_id and 'New' status
        $this->assertDatabaseHas('leads', [
            'name' => 'Sara Chraibi',
            'company' => 'Atlas Agro SARL',
            'email' => 'sara@atlasagro.ma',
            'status' => 'New',
            'account_id' => $account->id,
        ]);

        // Assert client user was created and linked to account
        $this->assertDatabaseHas('users', [
            'email' => 'sara@atlasagro.ma',
            'role' => 'client',
            'account_id' => $account->id,
        ]);

        // Assert audit activity was created
        $this->assertDatabaseHas('activities', [
            'account_id' => $account->id,
            'type' => 'inbound_request',
        ]);
    }

    private function account(string $name, ?User $creator = null): Account
    {
        return Account::create(['name' => $name, 'status' => 'Active', 'created_by' => $creator?->id]);
    }

    private function deal(Account $account, ?User $owner = null, array $overrides = []): Deal
    {
        return Deal::create(array_merge([
            'title' => 'Test deal ' . uniqid(),
            'account_id' => $account->id,
            'user_id' => $owner?->id,
            'amount' => 500,
            'stage' => 'leads',
            'probability' => 20,
        ], $overrides));
    }

    private function quote(Account $account, ?Deal $deal = null, ?User $owner = null, array $overrides = []): Quote
    {
        return Quote::create(array_merge([
            'quote_number' => 'TEST-' . uniqid(),
            'account_id' => $account->id,
            'deal_id' => $deal?->id,
            'user_id' => $owner?->id,
            'client_name' => 'Test Client',
            'status' => 'Sent',
            'subtotal' => 100,
            'discount_percent' => 0,
            'discount_amount' => 0,
            'discount_approved' => true,
            'tax_percent' => 20,
            'tax_amount' => 20,
            'total_amount' => 120,
            'currency' => 'MAD',
            'expiry_date' => now()->addDays(5),
        ], $overrides));
    }
}
