<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Account;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\Activity;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users with distinct RBAC Roles
        $admin = User::create([
            'name' => 'Karim Tazi',
            'email' => 'admin@intelligencesales.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'title' => 'Chief Revenue Officer / Admin',
            'phone' => '+212 661-234567',
            'quota' => 2500000.00,
        ]);

        $manager = User::create([
            'name' => 'Sofia Benali',
            'email' => 'manager@intelligencesales.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
            'title' => 'VP of Regional Sales',
            'phone' => '+212 662-887766',
            'quota' => 1800000.00,
        ]);

        $rep1 = User::create([
            'name' => 'Yassine Mansouri',
            'email' => 'rep1@intelligencesales.com',
            'password' => Hash::make('password123'),
            'role' => 'rep',
            'title' => 'Senior Account Executive',
            'phone' => '+212 663-112233',
            'quota' => 950000.00,
        ]);

        $rep2 = User::create([
            'name' => 'Mehdi Alaoui',
            'email' => 'rep2@intelligencesales.com',
            'password' => Hash::make('password123'),
            'role' => 'rep',
            'title' => 'Commercial B2B',
            'phone' => '+212 664-998877',
            'quota' => 750000.00,
        ]);

        $client = User::create([
            'name' => 'Omar Kabbaj',
            'email' => 'client@marocraft.ma',
            'password' => Hash::make('password123'),
            'role' => 'client',
            'title' => 'Directeur Général (MaroCraft)',
            'phone' => '+212 522-445566',
            'quota' => 0.00,
        ]);

        // 2. Enterprise Accounts
        $acc1 = Account::create([
            'name' => 'MaroCraft Industries',
            'industry' => 'Manufacturing & Craft',
            'annual_revenue' => '45,000,000 MAD',
            'city' => 'Casablanca (Ain Sebaa)',
            'phone' => '+212 522-334455',
            'email' => 'contact@marocraft.ma',
            'website' => 'https://marocraft.ma',
            'status' => 'Active',
            'primary_contact' => 'Omar Kabbaj',
            'notes' => 'Leader in artisanal exports. Looking to automate enterprise ERP workflows and lead pipeline.',
        ]);

        $acc2 = Account::create([
            'name' => 'Atlas Logistics SA',
            'industry' => 'Supply Chain & Transport',
            'annual_revenue' => '82,000,000 MAD',
            'city' => 'Tanger Med',
            'phone' => '+212 539-112233',
            'email' => 'operations@atlaslogistics.ma',
            'website' => 'https://atlaslogistics.ma',
            'status' => 'Active',
            'primary_contact' => 'Salma Tazi',
            'notes' => 'Operating multimodal transit across Morocco and Europe. Needs automated dispatch bots.',
        ]);

        $acc3 = Account::create([
            'name' => 'Maghreb Food Distribution',
            'industry' => 'Agri-Food & Retail',
            'annual_revenue' => '28,000,000 MAD',
            'city' => 'Agadir',
            'phone' => '+212 528-778899',
            'email' => 'directeur@maghrebfood.ma',
            'website' => 'https://maghrebfood.ma',
            'status' => 'Active',
            'primary_contact' => 'Hassan Amrani',
            'notes' => 'Distributes to 2,400+ hypermarkets. Seeking WhatsApp B2B order taking agent.',
        ]);

        $acc4 = Account::create([
            'name' => 'GreenTech Maroc',
            'industry' => 'Renewable Energy',
            'annual_revenue' => '15,000,000 MAD',
            'city' => 'Rabat (Technopolis)',
            'phone' => '+212 537-889900',
            'email' => 'sales@greentech.ma',
            'website' => 'https://greentech.ma',
            'status' => 'Prospect',
            'primary_contact' => 'Nadia Berrada',
            'notes' => 'Solar installations provider. Evaluating predictive customer churn modules.',
        ]);

        $acc5 = Account::create([
            'name' => 'Koutoubia Financial Services',
            'industry' => 'Fintech & Insurance',
            'annual_revenue' => '60,000,000 MAD',
            'city' => 'Marrakech',
            'phone' => '+212 524-332211',
            'email' => 'info@koutoubiafinancial.ma',
            'status' => 'Active',
            'primary_contact' => 'Amine Filali',
            'notes' => 'Enterprise insurance brokerage with 18 branches across the kingdom.',
        ]);

        // 3. Leads with AI scoring
        Lead::create([
            'name' => 'Omar Kabbaj',
            'company' => 'MaroCraft Industries',
            'email' => 'omar@marocraft.ma',
            'phone' => '+212 661-443322',
            'source' => 'LinkedIn B2B Campaign',
            'status' => 'Proposal',
            'ai_score' => 94,
            'score_reason' => 'High intent: Director title, budget confirmed (45M+ revenue), visited quote portal 3 times.',
            'user_id' => $rep1->id,
            'account_id' => $acc1->id,
        ]);

        Lead::create([
            'name' => 'Salma Tazi',
            'company' => 'Atlas Logistics SA',
            'email' => 'stazi@atlaslogistics.ma',
            'phone' => '+212 663-998811',
            'source' => 'Direct Inbound Inquiry',
            'status' => 'Qualified',
            'ai_score' => 88,
            'score_reason' => 'Strong fit: Urgently seeking automated qualification bot for Tanger logistics hub.',
            'user_id' => $rep1->id,
            'account_id' => $acc2->id,
        ]);

        Lead::create([
            'name' => 'Hassan Amrani',
            'company' => 'Maghreb Food Distribution',
            'email' => 'hassan@maghrebfood.ma',
            'phone' => '+212 665-223344',
            'source' => 'Casablanca Trade Expo',
            'status' => 'Contacted',
            'ai_score' => 74,
            'score_reason' => 'Mid-high potential: Needs demo of WhatsApp ordering bot before board sign-off.',
            'user_id' => $rep2->id,
            'account_id' => $acc3->id,
        ]);

        Lead::create([
            'name' => 'Nadia Berrada',
            'company' => 'GreenTech Maroc',
            'email' => 'nadia@greentech.ma',
            'phone' => '+212 662-771122',
            'source' => 'Website Chatbot Lead',
            'status' => 'New',
            'ai_score' => 61,
            'score_reason' => 'Discovery needed: Exploring predictive retention tools, decision cycle 45 days.',
            'user_id' => $rep2->id,
            'account_id' => $acc4->id,
        ]);

        // 4. Deals (Pipeline Stages)
        $deal1 = Deal::create([
            'title' => 'ERP AI Workflow Orchestrator',
            'account_id' => $acc1->id,
            'user_id' => $rep1->id,
            'amount' => 180000.00,
            'stage' => 'proposal',
            'probability' => 65,
            'expected_close_date' => now()->addDays(20),
            'ai_recommendation' => 'Formal quote Q-2026-001 generated. Client has reviewed. Schedule closing call.',
            'products' => ['Core Intelligence Platform', 'Custom AI Agent Integration', 'Dedicated SLA Support'],
        ]);

        $deal2 = Deal::create([
            'title' => 'Automated Cold Outreach Bot',
            'account_id' => $acc2->id,
            'user_id' => $rep1->id,
            'amount' => 95000.00,
            'stage' => 'negotiation',
            'probability' => 85,
            'expected_close_date' => now()->addDays(10),
            'ai_recommendation' => 'Manager approved 20% discount. High win probability: Send contract for signature.',
            'products' => ['Outreach Agent Pro', 'Voice Synthesis Engine'],
        ]);

        $deal3 = Deal::create([
            'title' => 'WhatsApp B2B Retail Agent',
            'account_id' => $acc3->id,
            'user_id' => $rep2->id,
            'amount' => 45000.00,
            'stage' => 'discovery',
            'probability' => 40,
            'expected_close_date' => now()->addDays(35),
            'ai_recommendation' => 'Technical demo scheduled for Tuesday. Provide French/Arabic demo script.',
            'products' => ['WhatsApp Multi-Agent Bot'],
        ]);

        $deal4 = Deal::create([
            'title' => 'Predictive Churn Engine',
            'account_id' => $acc4->id,
            'user_id' => $rep2->id,
            'amount' => 120000.00,
            'stage' => 'qualification',
            'probability' => 25,
            'expected_close_date' => now()->addDays(60),
            'ai_recommendation' => 'Engage CTO on data privacy architecture.',
            'products' => ['Predictive Analytics Microservice'],
        ]);

        $deal5 = Deal::create([
            'title' => 'Enterprise AI Sales Suite',
            'account_id' => $acc5->id,
            'user_id' => $admin->id,
            'amount' => 350000.00,
            'stage' => 'won',
            'probability' => 100,
            'expected_close_date' => now()->subDays(5),
            'ai_recommendation' => 'Closed Won! PO #BC-2026-8891 signed. Transitioning to implementation team.',
            'products' => ['Enterprise AI Suite', 'Multi-tenant Security Layer', 'On-Premise Deployment'],
        ]);

        // 5. Quotes (Devis) with Client Portal Public Tokens
        // Quote 1: Sent to MaroCraft (Waiting for client decision or client signature)
        $quote1 = Quote::create([
            'quote_number' => 'Q-2026-001',
            'deal_id' => $deal1->id,
            'account_id' => $acc1->id,
            'user_id' => $rep1->id,
            'client_name' => 'Omar Kabbaj',
            'client_email' => 'omar@marocraft.ma',
            'client_company' => 'MaroCraft Industries',
            'status' => 'Sent',
            'subtotal' => 180000.00,
            'discount_percent' => 5.00,
            'discount_amount' => 9000.00,
            'discount_approved' => true,
            'tax_percent' => 20.00,
            'tax_amount' => 34200.00,
            'total_amount' => 205200.00,
            'currency' => 'MAD',
            'expiry_date' => now()->addDays(30),
            'public_token' => 'token-marocraft-001',
            'notes' => 'Devis officiel pour solution ERP AI. Comprend 12 mois de maintenance prédictive.',
        ]);

        QuoteItem::create([
            'quote_id' => $quote1->id,
            'description' => 'Licence Plateforme Intelligence Sales - Enterprise Edition',
            'qty' => 1,
            'unit_price' => 100000.00,
            'total' => 100000.00,
        ]);
        QuoteItem::create([
            'quote_id' => $quote1->id,
            'description' => 'Intégration Agents IA Métiers & Pipeline Connectors',
            'qty' => 1,
            'unit_price' => 50000.00,
            'total' => 50000.00,
        ]);
        QuoteItem::create([
            'quote_id' => $quote1->id,
            'description' => 'Formation Équipe Commerciale & SLA Support 24/7',
            'qty' => 1,
            'unit_price' => 30000.00,
            'total' => 30000.00,
        ]);

        // Quote 2: For Atlas Logistics (High discount, pending approval or approved)
        $quote2 = Quote::create([
            'quote_number' => 'Q-2026-002',
            'deal_id' => $deal2->id,
            'account_id' => $acc2->id,
            'user_id' => $rep1->id,
            'client_name' => 'Salma Tazi',
            'client_email' => 'stazi@atlaslogistics.ma',
            'client_company' => 'Atlas Logistics SA',
            'status' => 'Sent',
            'subtotal' => 95000.00,
            'discount_percent' => 15.00,
            'discount_amount' => 14250.00,
            'discount_approved' => true,
            'tax_percent' => 20.00,
            'tax_amount' => 16150.00,
            'total_amount' => 96900.00,
            'currency' => 'MAD',
            'expiry_date' => now()->addDays(15),
            'public_token' => 'token-atlas-002',
            'notes' => 'Remise spéciale partenaire logistique Tanger Med validée par Direction commerciale.',
        ]);

        QuoteItem::create([
            'quote_id' => $quote2->id,
            'description' => 'Module Autonomous Cold Calling & Lead Qualification Bot',
            'qty' => 1,
            'unit_price' => 70000.00,
            'total' => 70000.00,
        ]);
        QuoteItem::create([
            'quote_id' => $quote2->id,
            'description' => 'Synthèse Vocale & Dialecte Marocain (Darija/Français)',
            'qty' => 1,
            'unit_price' => 25000.00,
            'total' => 25000.00,
        ]);

        // Quote 3: Accepted by Koutoubia Financial (Client signed with PO)
        $quote3 = Quote::create([
            'quote_number' => 'Q-2026-003',
            'deal_id' => $deal5->id,
            'account_id' => $acc5->id,
            'user_id' => $admin->id,
            'client_name' => 'Amine Filali',
            'client_email' => 'info@koutoubiafinancial.ma',
            'client_company' => 'Koutoubia Financial Services',
            'status' => 'Accepted',
            'subtotal' => 350000.00,
            'discount_percent' => 10.00,
            'discount_amount' => 35000.00,
            'discount_approved' => true,
            'tax_percent' => 20.00,
            'tax_amount' => 63000.00,
            'total_amount' => 378000.00,
            'currency' => 'MAD',
            'expiry_date' => now()->addDays(45),
            'public_token' => 'token-koutoubia-003',
            'client_signed_at' => now()->subDays(5),
            'client_signer_name' => 'Amine Filali (DG)',
            'client_po_number' => 'BC-2026-8891',
            'notes' => 'Validé et signé électroniquement via le Portail Client. Bon de commande réceptionné.',
        ]);

        QuoteItem::create([
            'quote_id' => $quote3->id,
            'description' => 'Enterprise Intelligence Sales Suite - Déploiement On-Premise',
            'qty' => 1,
            'unit_price' => 280000.00,
            'total' => 280000.00,
        ]);
        QuoteItem::create([
            'quote_id' => $quote3->id,
            'description' => 'Audit de Sécurité & Conformité CNDP Maroc',
            'qty' => 1,
            'unit_price' => 70000.00,
            'total' => 70000.00,
        ]);

        // 6. Activities
        Activity::create([
            'user_id' => $rep1->id,
            'deal_id' => $deal1->id,
            'account_id' => $acc1->id,
            'type' => 'quote',
            'title' => 'Devis Q-2026-001 transmis au client',
            'description' => 'Transmission du devis chiffré de 180,000 MAD à M. Omar Kabbaj.',
            'scheduled_at' => now()->subDays(2),
            'completed' => true,
        ]);

        Activity::create([
            'user_id' => $rep1->id,
            'deal_id' => $deal1->id,
            'account_id' => $acc1->id,
            'type' => 'call',
            'title' => 'Appel de suivi Devis avec M. Omar Kabbaj',
            'description' => 'Confirmer la réception du devis et valider le bon de commande.',
            'scheduled_at' => now()->addDays(2),
            'completed' => false,
        ]);

        Activity::create([
            'user_id' => $manager->id,
            'deal_id' => $deal2->id,
            'account_id' => $acc2->id,
            'type' => 'meeting',
            'title' => 'Validation de la remise de 15% pour Atlas Logistics',
            'description' => 'Accord managérial donné pour signer le contrat avant fin de mois.',
            'scheduled_at' => now()->subDay(),
            'completed' => true,
        ]);
    }
}
