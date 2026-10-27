import os
import sys
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.print_page_options import PrintOptions

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
SCREENSHOTS_DIR = os.path.join(ROOT_DIR, "docs_assets", "english_screenshots")
HTML_FILE = os.path.join(ROOT_DIR, "Intelligence_Sales_Architecture_and_AI_Blueprint.html")
PDF_FILE = os.path.join(ROOT_DIR, "Intelligence_Sales_Architecture_and_AI_Blueprint.pdf")

def get_b64(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{encoded}"
    print(f"Warning: image {filename} not found!")
    return ""

print("Loading screenshots into Base64...")
img_hero = get_b64("01_landing_hero.png")
img_proposal_modal = get_b64("02_landing_proposal_modal.png")
img_login = get_b64("03_login_page.png")
img_dashboard = get_b64("04_crm_dashboard.png")
img_pipeline = get_b64("05_crm_pipeline.png")
img_deal_modal = get_b64("06_crm_deal_modal.png")
img_leads = get_b64("07_crm_leads.png")
img_lead_modal = get_b64("08_crm_lead_modal.png")
img_accounts = get_b64("09_crm_accounts.png")
img_quotes = get_b64("10_crm_quotes.png")
img_rep_logs = get_b64("11_crm_rep_logs.png")
img_activities = get_b64("12_crm_activities.png")
img_ai_agents = get_b64("13_crm_ai_agents.png")
img_team = get_b64("14_crm_team.png")
img_client_space = get_b64("15_client_space.png")
img_client_quote_portal = get_b64("16_client_portal_quote.png")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Intelligence Sales — Complete System Architecture & AI Agents Technical Blueprint</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

    @page {{
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      line-height: 1.55;
      color: #0f172a;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }}

    .page-break {{
      page-break-after: always;
    }}

    .avoid-break {{
      page-break-inside: avoid;
    }}

    /* Cover Page */
    .cover {{
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 20px 20px 20px;
      background: radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 60%, #020617 100%);
      color: #ffffff;
      border-radius: 20px;
    }}

    .cover-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 100px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(129, 140, 248, 0.3);
      color: #a5b4fc;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      width: fit-content;
    }}

    .cover-title {{
      font-size: 32px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -1px;
      margin-top: 20px;
      color: #ffffff;
    }}

    .cover-title span {{
      background: linear-gradient(135deg, #818cf8 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .cover-subtitle {{
      font-size: 13px;
      color: #94a3b8;
      margin-top: 12px;
      max-width: 620px;
      line-height: 1.6;
    }}

    .cover-meta-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }}

    .cover-meta-card {{
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px;
    }}

    .cover-meta-label {{
      font-size: 9px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.5px;
    }}

    .cover-meta-val {{
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 4px;
    }}

    .cover-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 10px;
      color: #64748b;
    }}

    /* Typography & Headers */
    h1.sec-title {{
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    h1.sec-title::before {{
      content: '';
      display: inline-block;
      width: 4px;
      height: 20px;
      background: #4f46e5;
      border-radius: 2px;
    }}

    h2.sub-title {{
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      margin: 14px 0 6px 0;
    }}

    h3.sub-sub-title {{
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin: 10px 0 4px 0;
    }}

    p {{
      margin-bottom: 8px;
      color: #334155;
      text-align: justify;
    }}

    /* Card styling */
    .card {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 12px;
    }}

    .card-dark {{
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 14px;
      color: #e2e8f0;
      margin-bottom: 12px;
    }}

    .card-highlight {{
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 12px;
    }}

    /* Badges */
    .pill {{
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}

    .pill-blue {{ background: #dbeafe; color: #1e40af; }}
    .pill-green {{ background: #dcfce7; color: #166534; }}
    .pill-amber {{ background: #fef3c7; color: #92400e; }}
    .pill-rose {{ background: #ffe4e6; color: #9f1239; }}
    .pill-purple {{ background: #f3e8ff; color: #6b21a8; }}

    /* Images & Captions */
    .figure-container {{
      margin: 10px 0 14px 0;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      background: #f1f5f9;
      box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.06);
    }}

    .figure-container img {{
      width: 100%;
      height: auto;
      display: block;
    }}

    .figure-caption {{
      padding: 6px 10px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 9px;
      color: #64748b;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .figure-tag {{
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #4f46e5;
    }}

    /* Tables */
    table.data-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 10px;
    }}

    table.data-table th {{
      background: #f1f5f9;
      color: #334155;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8.5px;
      letter-spacing: 0.5px;
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      text-align: left;
    }}

    table.data-table td {{
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }}

    table.data-table tr:nth-child(even) {{
      background: #f8fafc;
    }}

    /* Code & JSON styling */
    pre.code-block {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      line-height: 1.45;
      background: #0f172a;
      color: #38bdf8;
      padding: 10px 12px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 6px 0 10px 0;
      border: 1px solid #1e293b;
    }}

    .code-tag {{
      font-family: 'JetBrains Mono', monospace;
      background: #f1f5f9;
      color: #4f46e5;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 600;
      border: 1px solid #e2e8f0;
    }}

    /* AI Card Block */
    .ai-agent-box {{
      border: 1.5px solid #4f46e5;
      border-radius: 12px;
      background: #ffffff;
      padding: 14px;
      margin-bottom: 14px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
    }}

    .ai-agent-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }}

    .ai-agent-title {{
      font-size: 14px;
      font-weight: 900;
      color: #1e1b4b;
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .ai-agent-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 8px 0;
    }}

    .ai-agent-field {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 6px;
    }}

    .ai-field-label {{
      font-size: 8px;
      text-transform: uppercase;
      font-weight: 800;
      color: #64748b;
    }}

    .ai-field-val {{
      font-size: 10px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 1px;
    }}
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover page-break">
    <div>
      <div class="cover-badge">Technical Specification & AI Architecture Blueprint</div>
      <div class="cover-title">
        Intelligence Sales CRM<br>
        <span>End-to-End Perspectives & 7 AI Agents Blueprint</span>
      </div>
      <div class="cover-subtitle">
        A comprehensive technical and functional handbook for Data Scientists, AI Engineers, and Fullstack Developers. Explains the commercial system from Executive, Sales Rep, and B2B Client perspectives, accompanied by live platform screenshots and rigorous architectural specifications for all 7 AI Agents.
      </div>

      <div class="cover-meta-grid">
        <div class="cover-meta-card">
          <div class="cover-meta-label">Target Audience</div>
          <div class="cover-meta-val">Data / AI Dev Team</div>
        </div>
        <div class="cover-meta-card">
          <div class="cover-meta-label">System Version</div>
          <div class="cover-meta-val">v3.2 Enterprise (2026)</div>
        </div>
        <div class="cover-meta-card">
          <div class="cover-meta-label">Architecture</div>
          <div class="cover-meta-val">React + Laravel + AI Hub</div>
        </div>
        <div class="cover-meta-card">
          <div class="cover-meta-label">AI Agents Count</div>
          <div class="cover-meta-val">7 Autonomous AIs</div>
        </div>
      </div>
    </div>

    <div>
      <div class="card-dark" style="margin-bottom: 14px;">
        <div style="font-size: 11px; font-weight: 700; color: #818cf8; margin-bottom: 4px;">Primary Goal of this Blueprint</div>
        <div style="font-size: 10px; color: #cbd5e1; line-height: 1.5;">
          This document serves as the binding contract for the Data/AI developer to build, train, prompt, and deploy the 7 commercial AI agents. It details exact trigger hooks, input JSON schemas, prompt logic, output database mutations, and visual links to every corresponding interface in the Intelligence Sales platform.
        </div>
      </div>

      <div class="cover-footer">
        <span>&copy; 2026 Intelligence Sales Platform &bull; Confidential & Proprietary</span>
        <span>Generated: October 2026 &bull; Production Ready</span>
      </div>
    </div>
  </div>

  <!-- ==================== EXECUTIVE SUMMARY & CORE PHILOSOPHY ==================== -->
  <div class="page-break">
    <h1 class="sec-title">1. System Architecture & Core Philosophy</h1>
    
    <div class="card-highlight">
      <strong>Core Principle:</strong> Intelligence Sales is <em>not</em> an AI novelty chatbot. It is a high-velocity B2B Commercial Operating System engineered to drive real wholesale and enterprise product trade. The 7 AI Agents function as autonomous force multipliers embedded inside human sales workflows—handling lead scoring, margin protection, follow-up automation, and contract generation while keeping humans in the loop for final commitment.
    </div>

    <h2 class="sub-title">1.1 Core Domain Entities & Relational Hierarchy</h2>
    <p>
      The database layer consists of 7 tightly interconnected relational entities mapped inside Laravel 11 with SQLite/MySQL:
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Entity</th>
          <th>Database Table</th>
          <th>Key Attributes</th>
          <th>Role in Workflow</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Account</strong></td>
          <td><span class="code-tag">accounts</span></td>
          <td>name, industry, city, phone, email, status, tier, ICE, IF, Patente, credit_limit</td>
          <td>Enterprise client company profile. The parent root for all deals, quotes, and contacts.</td>
        </tr>
        <tr>
          <td><strong>User</strong></td>
          <td><span class="code-tag">users</span></td>
          <td>name, email, role, account_id, title, phone, quota</td>
          <td>System actor. Roles: <span class="code-tag">admin</span>, <span class="code-tag">manager</span>, <span class="code-tag">rep</span>, or <span class="code-tag">client</span>.</td>
        </tr>
        <tr>
          <td><strong>Lead</strong></td>
          <td><span class="code-tag">leads</span></td>
          <td>name, company, email, phone, source, status, ai_score, score_reason, user_id, account_id</td>
          <td>Inbound prospect. Evaluated from 0-100 by the Lead Intelligence Agent before conversion.</td>
        </tr>
        <tr>
          <td><strong>Deal</strong></td>
          <td><span class="code-tag">deals</span></td>
          <td>title, account_id, user_id, amount, stage, probability, expected_close_date</td>
          <td>Active revenue opportunity in the 6-stage sales pipeline. Owned by a sales rep.</td>
        </tr>
        <tr>
          <td><strong>Quote</strong></td>
          <td><span class="code-tag">quotes</span></td>
          <td>quote_number, deal_id, account_id, discount_percent, discount_approved, public_token</td>
          <td>Commercial offer with itemized line items, discount governance, and legal E-signature token.</td>
        </tr>
        <tr>
          <td><strong>Activity</strong></td>
          <td><span class="code-tag">activities</span></td>
          <td>user_id, deal_id, lead_id, account_id, type, title, description, completed, idempotency_key</td>
          <td>Unified audit and follow-up timeline tracking every call, email, meeting, and stage shift.</td>
        </tr>
      </tbody>
    </table>

    <h2 class="sub-title">1.2 Role-Based Access Control (RBAC) & Data Isolation</h2>
    <p>
      Data scoping is strictly enforced at the database query level via <span class="code-tag">App\\Support\\CrmAccess</span>:
    </p>
    <ul style="margin-left: 18px; margin-bottom: 12px; color: #334155;">
      <li><strong>Admin & Sales Director:</strong> Full visibility across all reps, all deals, company-wide revenue forecasts, user management, and system configuration.</li>
      <li><strong>Sales Manager:</strong> Can reassign deals among commercial representatives, supervise team quotas, and holds exclusive authority to approve quotes with discounts exceeding 15%.</li>
      <li><strong>Commercial Sales Representative (Rep):</strong> Restricted strictly to deals, quotes, and accounts in their assigned portfolio, plus unassigned inbound leads. Reps cannot reassign deals to other users.</li>
      <li><strong>B2B Client:</strong> Restricted strictly to their own enterprise account records (<span class="code-tag">account_id</span>). Can only view proposals addressed to their enterprise and sign quotes.</li>
    </ul>

    <div class="figure-container">
      <img src="{img_login}" alt="Authentication & RBAC Portal" />
      <div class="figure-caption">
        <span>Figure 1: Authentication Portal with multi-role RBAC access switcher (Admin, Manager, Rep, Client).</span>
        <span class="figure-tag">URL: /login</span>
      </div>
    </div>
  </div>

  <!-- ==================== PERSPECTIVE 1: EXECUTIVE & MANAGEMENT ==================== -->
  <div class="page-break">
    <h1 class="sec-title">2. Perspective 1: Executive & Sales Management (Admin / Manager)</h1>

    <p>
      For the CRO, VP of Sales, and Regional Sales Managers, Intelligence Sales provides a centralized mission-control cockpit designed to govern revenue, eliminate deal slippage, inspect rep behaviors, and enforce commercial margin rules.
    </p>

    <div class="figure-container">
      <img src="{img_dashboard}" alt="Executive Sales Cockpit" />
      <div class="figure-caption">
        <span>Figure 2: Executive Dashboard — Real-time revenue forecasting, stage conversion funnel, and team quota pacing.</span>
        <span class="figure-tag">URL: /crm/dashboard</span>
      </div>
    </div>

    <h2 class="sub-title">2.1 Revenue Forecasting & Quota Pacing</h2>
    <p>
      The dashboard synthesizes closed-won ARR/MRR against annual commercial targets. Revenue projections are weighted automatically by stage probabilities (Leads 10%, Qualification 30%, Discovery 50%, Proposal 70%, Negotiation 80%, Won 100%).
    </p>

    <div class="figure-container">
      <img src="{img_pipeline}" alt="Commercial Pipeline Kanban" />
      <div class="figure-caption">
        <span>Figure 3: Deals Pipeline Kanban — Multi-stage visual progression with deal values, probabilities, and stage locks.</span>
        <span class="figure-tag">URL: /crm/pipeline</span>
      </div>
    </div>

    <h2 class="sub-title">2.2 Deal Assignment & Rep Workload Reallocation</h2>
    <p>
      Managers can inspect any opportunity card and reassign it to another sales representative via the Deal Inspection Modal. The backend checks caller role via <span class="code-tag">CrmAccess::isManager()</span>, preventing unauthorized reps from altering deal ownership while empowering managers to balance team workloads.
    </p>

    <div class="figure-container">
      <img src="{img_deal_modal}" alt="Deal Detail & Reassignment Modal" />
      <div class="figure-caption">
        <span>Figure 4: Deal Detail Modal — AI next-step recommendations, product bundles, and Manager-only Rep Selector.</span>
        <span class="figure-tag">Component: CrmPipeline.jsx</span>
      </div>
    </div>
  </div>

  <!-- ==================== PERSPECTIVE 1 (CONT) & REP LOGS ==================== -->
  <div class="page-break">
    <h1 class="sec-title">2. Perspective 1 (Cont.): Governance, Auditability & Margin Protection</h1>

    <h2 class="sub-title">2.3 Rep Activity Logs & Audit Trail (/crm/rep-logs)</h2>
    <p>
      A dedicated audit navigation item (<span class="code-tag">/crm/rep-logs</span>) gives managers complete step-by-step transparency into every action performed by sales representatives: stage advancements, inbound lead conversions, quotation dispatches, and client communications. Each log records the exact rep ID, timestamp, target account, and operational payload.
    </p>

    <div class="figure-container">
      <img src="{img_rep_logs}" alt="Rep Activity Audit Trail" />
      <div class="figure-caption">
        <span>Figure 5: Rep Activity Logs — Audit trail showing real-time timestamps, deal progression, and rep actions.</span>
        <span class="figure-tag">URL: /crm/rep-logs</span>
      </div>
    </div>

    <h2 class="sub-title">2.4 Margin Protection & The 15% Discount Approval Rule</h2>
    <p>
      Sales reps frequently encounter price pushback. However, unconstrained discounting degrades enterprise profit margins. The platform enforces an ironclad governance threshold:
    </p>
    <div class="card">
      <ul style="margin-left: 18px; color: #334155;">
        <li><strong>Discounts &le; 15%:</strong> Commercial reps can approve and dispatch directly to the client.</li>
        <li><strong>Discounts &gt; 15%:</strong> The quotation status locks automatically into <span class="pill pill-amber">Pending Approval</span>. The dispatch button and public signing token are disabled until a Sales Manager or Director clicks <span class="code-tag">Approve Discount</span>. Any direct attempt to bypass this via API yields a <span class="code-tag">403 Forbidden</span> error.</li>
      </ul>
    </div>

    <div class="figure-container">
      <img src="{img_quotes}" alt="Quotations Governance & Discount Approvals" />
      <div class="figure-caption">
        <span>Figure 6: Quotations Directory — Enforcing margin rules, discount approvals, and secret public token links.</span>
        <span class="figure-tag">URL: /crm/quotes</span>
      </div>
    </div>
  </div>

  <!-- ==================== PERSPECTIVE 2: COMMERCIAL SALES REP ==================== -->
  <div class="page-break">
    <h1 class="sec-title">3. Perspective 2: Commercial Sales Representative (Rep) Workstation</h1>

    <p>
      For the sales executive in the field, Intelligence Sales acts as an intelligent co-pilot. Reps start their day by reviewing assigned inbound leads, checking AI qualification scores, advancing pipeline opportunities, and drafting itemized product quotes.
    </p>

    <h2 class="sub-title">3.1 Inbound Lead Claiming & AI Qualification Scoring (/crm/leads)</h2>
    <p>
      When an inbound proposal request arrives from the website, it enters the rep queue marked with a pulsating <span class="pill pill-rose">NEW</span> badge on the card corner. The Lead Intelligence Agent scores the prospect from 0 to 100 based on estimated order volume, corporate domain credibility, and stated requirements.
    </p>

    <div class="figure-container">
      <img src="{img_leads}" alt="Leads Prospecting & AI Scoring" />
      <div class="figure-caption">
        <span>Figure 7: Leads Directory — Pulsating Red "NEW" corner badge, 0-100 AI Score, and 1-Click Convert button.</span>
        <span class="figure-tag">URL: /crm/leads</span>
      </div>
    </div>

    <h2 class="sub-title">3.2 1-Click Conversion: Lead &rarr; Enterprise Account + Opportunity</h2>
    <p>
      Clicking <span class="code-tag">Convert to Opportunity</span> executes an atomic transaction in MySQL: creates an active Enterprise Account, provisions a Deal in the Qualification stage, links the contact, and archives the lead.
    </p>

    <div class="figure-container">
      <img src="{img_lead_modal}" alt="New Lead Modal with International Phone" />
      <div class="figure-caption">
        <span>Figure 8: New Lead Modal — Capturing contact info with searchable international dial code and country flag.</span>
        <span class="figure-tag">Component: PhoneInputField.jsx</span>
      </div>
    </div>

    <h2 class="sub-title">3.3 Smart Follow-Up & The 7-Day Inactivity Rule (/crm/activities)</h2>
    <p>
      Deals with no interaction for 7 days are automatically flagged. The Follow-Up Agent drafts personalized re-engagement messages in French, Arabic, and English for one-click rep review before transmission.
    </p>

    <div class="figure-container">
      <img src="{img_activities}" alt="Activities & Follow-Up Timeline" />
      <div class="figure-caption">
        <span>Figure 9: Activities Timeline — 7-day dormancy warnings, scheduled calls, and automated follow-up drafts.</span>
        <span class="figure-tag">URL: /crm/activities</span>
      </div>
    </div>
  </div>

  <!-- ==================== PERSPECTIVE 3: B2B CLIENT EXPERIENCE ==================== -->
  <div class="page-break">
    <h1 class="sec-title">4. Perspective 3: B2B Client Experience & Journey</h1>

    <p>
      The B2B client experience is frictionless, transparent, and professional—from initial proposal submission on the landing page to portal access and legal digital contract signing.
    </p>

    <div class="figure-container">
      <img src="{img_hero}" alt="Landing Page Hero & Value Proposition" />
      <div class="figure-caption">
        <span>Figure 10: Landing Page Hero — Highlighting wholesale product distribution and Request Proposal CTA.</span>
        <span class="figure-tag">URL: /</span>
      </div>
    </div>

    <h2 class="sub-title">4.1 Seamless Inbound Quotation Request & Automated Account Creation</h2>
    <p>
      When a prospect clicks <span class="code-tag">Demande de Devis</span>, they enter their enterprise details and phone number using the international flag selector. Upon submission:
    </p>
    <div class="card">
      <ol style="margin-left: 18px; color: #334155;">
        <li>An Enterprise <strong>Account</strong> is automatically created in the database.</li>
        <li>A Client <strong>User</strong> portal account is created with a generated temporary password (e.g. <span class="code-tag">Client@9750</span>).</li>
        <li>A branded Welcome Email is dispatched to the submitted inbox with quotation reference (<span class="code-tag">DEV-2026-XXXX</span>), credentials, and portal link.</li>
        <li>The credentials card appears immediately on screen with a 1-click <strong>Copy Credentials</strong> button and direct <strong>Go to Portal</strong> link.</li>
      </ol>
    </div>

    <div class="figure-container">
      <img src="{img_proposal_modal}" alt="Quotation Modal with Country Flag Phone Input" />
      <div class="figure-caption">
        <span>Figure 11: Quotation Request Modal — Phone input starting with +dial code and national flag emoji.</span>
        <span class="figure-tag">Component: PartnerModal.jsx</span>
      </div>
    </div>
  </div>

  <!-- ==================== PERSPECTIVE 3 (CONT): CLIENT PORTAL & SIGNING ==================== -->
  <div class="page-break">
    <h1 class="sec-title">4. Perspective 3 (Cont.): Client Space & Legal E-Signature Portal</h1>

    <h2 class="sub-title">4.2 The Dedicated B2B Client Space (/crm/dashboard as Client)</h2>
    <p>
      When clients log in, their navigation is strictly scoped to client-facing features: <em>Mon Espace Client</em>, <em>Mes Devis & Offres</em>, and <em>Historique & Jalons</em>. They can inspect proposals addressed to their enterprise and contact their assigned commercial executive directly.
    </p>

    <div class="figure-container">
      <img src="{img_client_space}" alt="B2B Client Space Cockpit" />
      <div class="figure-caption">
        <span>Figure 12: B2B Client Space — Viewing approved commercial limits, active proposals, and rep contact card.</span>
        <span class="figure-tag">URL: /crm/dashboard (Client Role)</span>
      </div>
    </div>

    <h2 class="sub-title">4.3 Public Quotation Review & Legal E-Signature (/portal/quote/:token)</h2>
    <p>
      Clients access their itemized quotation through a secure secret URL. The portal displays full commercial transparency: item descriptions, unit prices, volume discounts, and 20% legal Moroccan VAT (TVA).
    </p>
    <p>
      Clients can sign electronically by providing their Signer Name, optional Purchase Order (PO) number, special instructions, and agreeing to the formal commercial terms. Signing automatically moves the CRM Deal to <span class="pill pill-green">Closed Won</span>.
    </p>

    <div class="figure-container">
      <img src="{img_client_quote_portal}" alt="Public Quotation Review & E-Signature Portal" />
      <div class="figure-caption">
        <span>Figure 13: Public Quotation Portal — Itemized bill of materials, VAT calculation, and E-Signature form.</span>
        <span class="figure-tag">URL: /portal/quote/:token</span>
      </div>
    </div>
  </div>

  <!-- ==================== SECTION 2: AI ARCHITECTURE BLUEPRINT (THE 7 AIS) ==================== -->
  <div class="page-break">
    <h1 class="sec-title">5. SECTION 2: Technical Specification for the 7 Sales AI Agents</h1>

    <div class="card-highlight">
      <strong>For the Data & AI Developer:</strong> This section provides the exhaustive technical implementation blueprint for each of the 7 AI Agents. You must implement each agent following the exact trigger hooks, input payloads, prompt architectures, and output JSON schemas specified below.
    </div>

    <div class="figure-container">
      <img src="{img_ai_agents}" alt="AI Agents Control Center" />
      <div class="figure-caption">
        <span>Figure 14: AI Agents Control Center — Central orchestrator managing the 7 autonomous commercial agents.</span>
        <span class="figure-tag">URL: /crm/ai-agents</span>
      </div>
    </div>

    <!-- AI AGENT 1 -->
    <div class="ai-agent-box avoid-break">
      <div class="ai-agent-header">
        <div class="ai-agent-title">
          <span>AI Agent #1: Lead Intelligence & Scoring Agent</span>
        </div>
        <span class="pill pill-blue">Code ID: lead_intelligence</span>
      </div>

      <p><strong>Mission:</strong> Instantly evaluates incoming commercial proposals, predicts conversion probability (0-100), tags temperature, and synthesizes an executive qualification rationale.</p>

      <div class="ai-agent-grid">
        <div class="ai-agent-field">
          <div class="ai-field-label">UI Visual Anchor</div>
          <div class="ai-field-val"><a href="#fig-7">Figure 7: Leads Directory (/crm/leads)</a></div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Trigger Hook</div>
          <div class="ai-field-val">Event: POST /api/public/proposals & Lead::created</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Recommended ML Engine</div>
          <div class="ai-field-val">LightGBM Classifier + Claude 3.5 Sonnet / Gemini 1.5 Flash</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Target Latency SLA</div>
          <div class="ai-field-val">&lt; 1,200 ms (Asynchronous Event Listener)</div>
        </div>
      </div>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Input JSON Payload (From Laravel):</div>
      <pre class="code-block">{{
  "lead_id": 14,
  "company_name": "Atlas Agro SARL",
  "contact_name": "Sara Chraibi",
  "email": "sara@atlasagro.ma",
  "phone": "+212 661 99 88 77",
  "city": "Meknès",
  "estimated_volume": "200 000 – 500 000 MAD",
  "product_category": "Fresh Agri-Products Wholesale",
  "notes": "Urgent quote request for 500 tons seasonal supply."
}}</pre>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Expected AI Output Schema (To be returned as pure JSON):</div>
      <pre class="code-block">{{
  "ai_score": 92,
  "temperature": "Hot",
  "score_reason": "High-volume wholesale demand with verified corporate domain (.ma). Immediate purchasing timeframe in agricultural hub.",
  "risk_factors": ["Seasonal shelf-life sensitivity", "High initial credit exposure"],
  "recommended_rep_skills": ["Commodity Agri-Trade", "Fast Fulfillment Logistics"]
}}</pre>

      <p style="font-size: 10px; color: #64748b; margin-top: 4px;">
        <strong>Database Mutation:</strong> Updates <span class="code-tag">leads.ai_score = 92</span> and <span class="code-tag">leads.score_reason = score_reason</span>.
      </p>
    </div>
  </div>

  <!-- ==================== AI AGENTS 2 & 3 ==================== -->
  <div class="page-break">
    <h1 class="sec-title">5. AI Technical Blueprint (Cont.): Agents #2 & #3</h1>

    <!-- AI AGENT 2 -->
    <div class="ai-agent-box avoid-break">
      <div class="ai-agent-header">
        <div class="ai-agent-title">
          <span>AI Agent #2: Sales Assistant Copilot</span>
        </div>
        <span class="pill pill-purple">Code ID: sales_assistant</span>
      </div>

      <p><strong>Mission:</strong> 24/7 copilot for commercial sales reps. Generates real-time meeting preparation briefs, tactical objection handling talking points (especially against price pushback), and competitor counter-arguments.</p>

      <div class="ai-agent-grid">
        <div class="ai-agent-field">
          <div class="ai-field-label">UI Visual Anchor</div>
          <div class="ai-field-val"><a href="#fig-4">Figure 4: Deal Detail Inspection Modal</a></div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Trigger Hook</div>
          <div class="ai-field-val">On-demand Rep click / Deal stage advancement</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Recommended ML Engine</div>
          <div class="ai-field-val">GPT-4o / Claude 3.5 Sonnet (RAG over Activity History)</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Context Window</div>
          <div class="ai-field-val">Last 10 activities + Account financials + Deal items</div>
        </div>
      </div>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Input JSON Payload:</div>
      <pre class="code-block">{{
  "deal_id": 8,
  "deal_title": "Agri-Tech Wholesale Supply",
  "stage": "negotiation",
  "amount_mad": 320000,
  "client_objection": "Client claims competitor offers 12% lower prices with 60-day credit terms.",
  "account_profile": {{
    "name": "Maroc Agrum SA",
    "annual_revenue": "45M MAD",
    "credit_tier": "Tier A"
  }}
}}</pre>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Expected AI Output Schema:</div>
      <pre class="code-block">{{
  "ai_recommendation": "Do not slash prices directly. Propose split-delivery batching with 5% volume rebate tied to prompt 30-day payment.",
  "talking_points": [
    "Emphasize guaranteed 24h cold-chain delivery reliability over cheaper uncertified rivals.",
    "Highlight full tax compliance with verifiable ICE & electronic invoicing."
  ],
  "counter_offer_terms": {{
    "proposed_discount": 5,
    "payment_terms": "30 days end of month",
    "concession_condition": "Minimum order quantity 25 tons"
  }}
}}</pre>

      <p style="font-size: 10px; color: #64748b; margin-top: 4px;">
        <strong>Database Mutation:</strong> Updates <span class="code-tag">deals.ai_recommendation</span> and logs an activity note.
      </p>
    </div>

    <!-- AI AGENT 3 -->
    <div class="ai-agent-box avoid-break">
      <div class="ai-agent-header">
        <div class="ai-agent-title">
          <span>AI Agent #3: Smart Follow-Up Engine Agent</span>
        </div>
        <span class="pill pill-amber">Code ID: follow_up</span>
      </div>

      <p><strong>Mission:</strong> Enforces the 7-Day Inactivity Rule. Detects dormant opportunities, drafts personalized multi-channel re-engagement messages (WhatsApp & Email in EN/FR/AR), and requires human rep approval before sending.</p>

      <div class="ai-agent-grid">
        <div class="ai-agent-field">
          <div class="ai-field-label">UI Visual Anchor</div>
          <div class="ai-field-val"><a href="#fig-9">Figure 9: Activities & Follow-Up Timeline</a></div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Trigger Hook</div>
          <div class="ai-field-val">Cron: Every night at 02:00 AM (<span class="code-tag">app:check-dormant-deals</span>)</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Dormancy Threshold</div>
          <div class="ai-field-val">Last interaction &gt; 7 days</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Languages</div>
          <div class="ai-field-val">French (Français), Darija / Arabic (العربية), English</div>
        </div>
      </div>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Expected AI Output Schema:</div>
      <pre class="code-block">{{
  "is_dormant": true,
  "days_inactive": 9,
  "whatsapp_draft_fr": "Bonjour Omar, suite à notre échange sur le devis DEV-2026-004, nos équipes ont pré-réservé votre lot. Pouvons-nous caler un rapide point téléphonique aujourd'hui à 15h ?",
  "whatsapp_draft_ar": "السلام عليكم سي عمر، بخصوص عرض السعر الأخير، السلعة راه محجوزة في المستودع. واش ممكن نتواصلو هاد العشية لتأكيد الطلبية؟",
  "email_subject": "Suivi de votre cotation DEV-2026-004 — Disponibilité des stocks",
  "urgency_rating": "High"
}}</pre>

      <p style="font-size: 10px; color: #64748b; margin-top: 4px;">
        <strong>Database Mutation:</strong> Inserts draft into <span class="code-tag">activities</span> with <span class="code-tag">completed = false</span> waiting for rep approval.
      </p>
    </div>
  </div>

  <!-- ==================== AI AGENTS 4 & 5 ==================== -->
  <div class="page-break">
    <h1 class="sec-title">5. AI Technical Blueprint (Cont.): Agents #4 & #5</h1>

    <!-- AI AGENT 4 -->
    <div class="ai-agent-box avoid-break">
      <div class="ai-agent-header">
        <div class="ai-agent-title">
          <span>AI Agent #4: CRM Data Cleaner & Enricher</span>
        </div>
        <span class="pill pill-green">Code ID: crm_data</span>
      </div>

      <p><strong>Mission:</strong> Eliminates duplicate records, normalizes phone numbers to standard E.164 (<span class="code-tag">+212...</span>), validates Moroccan tax registries (ICE 15 digits, IF, RC, Patente), and flags data decay.</p>

      <div class="ai-agent-grid">
        <div class="ai-agent-field">
          <div class="ai-field-label">UI Visual Anchor</div>
          <div class="ai-field-val"><a href="#fig-6">Figure 6 & 11: Accounts & Proposal Form</a></div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Trigger Hook</div>
          <div class="ai-field-val">On Account/Lead creation & Weekly cleanup job</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Tax ID Checks</div>
          <div class="ai-field-val">Moroccan ICE (15 digits), IF (8 digits), Patente</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Deduplication Method</div>
          <div class="ai-field-val">Fuzzy matching (Levenshtein + Token Sort) + ICE key</div>
        </div>
      </div>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Expected AI Output Schema:</div>
      <pre class="code-block">{{
  "canonical_company_name": "MaroCraft Industries SARL AU",
  "normalized_phone": "+212 522 33 44 55",
  "is_duplicate": false,
  "duplicate_account_id": null,
  "ice_validation": {{
    "ice_number": "001524398000045",
    "is_valid_format": true,
    "confidence_score": 0.99
  }},
  "data_completeness_score": 95
}}</pre>
    </div>

    <!-- AI AGENT 5 -->
    <div class="ai-agent-box avoid-break">
      <div class="ai-agent-header">
        <div class="ai-agent-title">
          <span>AI Agent #5: Predictive Sales Analytics & Forecasting Agent</span>
        </div>
        <span class="pill pill-blue">Code ID: sales_analytics</span>
      </div>

      <p><strong>Mission:</strong> Projects quarterly closed revenue, calculates pipeline velocity, predicts deal slippage, and diagnoses win/loss root causes for executive leadership.</p>

      <div class="ai-agent-grid">
        <div class="ai-agent-field">
          <div class="ai-field-label">UI Visual Anchor</div>
          <div class="ai-field-val"><a href="#fig-2">Figure 2: Executive Dashboard (/crm/dashboard)</a></div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Trigger Hook</div>
          <div class="ai-field-val">GET /api/analytics/kpis & Deal Stage Update</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Algorithm</div>
          <div class="ai-field-val">Survival Analysis & Probability-Weighted Pipeline Matrix</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Forecast Horizon</div>
          <div class="ai-field-val">Current Month, Quarter, and Trailing 12 Months</div>
        </div>
      </div>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Expected AI Output Schema:</div>
      <pre class="code-block">{{
  "projected_quarterly_revenue_mad": 4850000,
  "forecast_confidence_interval": [4500000, 5200000],
  "pipeline_velocity_days": 21.4,
  "slippage_risk_deals": [
    {{"deal_id": 5, "deal_title": "Atlas Logistics Supply", "risk": "High - Stage stagnant for 14 days"}}
  ],
  "team_quota_attainment_forecast": 104.2
}}</pre>
    </div>
  </div>

  <!-- ==================== AI AGENTS 6 & 7 ==================== -->
  <div class="page-break">
    <h1 class="sec-title">5. AI Technical Blueprint (Cont.): Agents #6 & #7</h1>

    <!-- AI AGENT 6 -->
    <div class="ai-agent-box avoid-break">
      <div class="ai-agent-header">
        <div class="ai-agent-title">
          <span>AI Agent #6: Document & Quote Generator Agent</span>
        </div>
        <span class="pill pill-rose">Code ID: document_agent</span>
      </div>

      <p><strong>Mission:</strong> Automates itemized proposal generation, calculates gross margins, computes 20% legal Moroccan VAT (TVA), and enforces the 15% discount approval governance rule.</p>

      <div class="ai-agent-grid">
        <div class="ai-agent-field">
          <div class="ai-field-label">UI Visual Anchor</div>
          <div class="ai-field-val"><a href="#fig-6">Figure 6: Quotations Page & Builder (/crm/quotes)</a></div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Trigger Hook</div>
          <div class="ai-field-val">POST /api/quotes (Quote Creation)</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Rule Engine</div>
          <div class="ai-field-val">Subtotal - Discount + 20% VAT = Total TTC</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Discount Threshold</div>
          <div class="ai-field-val">&gt; 15% requires Manager Approval (Locked Status)</div>
        </div>
      </div>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Output Calculation Contract:</div>
      <pre class="code-block">{{
  "subtotal_ht": 225000.00,
  "discount_percent": 18,
  "discount_amount": 40500.00,
  "discount_approved": false,
  "requires_manager_approval": true,
  "approval_status": "Pending Approval",
  "net_ht": 184500.00,
  "tax_percent": 20,
  "tax_amount": 36900.00,
  "total_ttc": 221400.00,
  "currency": "MAD"
}}</pre>
    </div>

    <!-- AI AGENT 7 -->
    <div class="ai-agent-box avoid-break">
      <div class="ai-agent-header">
        <div class="ai-agent-title">
          <span>AI Agent #7: Autonomous Sales Workflow & Trigger Agent</span>
        </div>
        <span class="pill pill-green">Code ID: automation_agent</span>
      </div>

      <p><strong>Mission:</strong> Event-driven sales workflow execution. When an external trigger occurs (e.g. client signs quote online, proposal submitted), automatically executes downstream state mutations: wins the deal, provisions accounts, dispatches logistics orders, and sends alerts.</p>

      <div class="ai-agent-grid">
        <div class="ai-agent-field">
          <div class="ai-field-label">UI Visual Anchor</div>
          <div class="ai-field-val"><a href="#fig-13">Figure 13: Quote Signing Portal (/portal/quote/:token)</a></div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Trigger Hook</div>
          <div class="ai-field-val">Event: POST /api/public/quotes/:token/accept</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Idempotency Key</div>
          <div class="ai-field-val">Required (Prevents double stage progression)</div>
        </div>
        <div class="ai-agent-field">
          <div class="ai-field-label">Downstream Sync</div>
          <div class="ai-field-val">Intelligence Logistique & ERP Sales Order Generation</div>
        </div>
      </div>

      <div style="font-weight: 700; font-size: 9.5px; color: #475569; margin-top: 6px;">Execution Flow Blueprint:</div>
      <pre class="code-block">1. Client submits digital signature on /portal/quote/:token
2. automation_agent intercepts event:
   a) Sets quote.status = 'Accepted', logs signer_name & po_number
   b) Sets deal.stage = 'won', probability = 100%
   c) Creates Activity log entry for rep & manager
   d) Dispatches confirmation email to client with counter-signed PDF
   e) Emits webhook to ERP / Logistics API for order fulfillment</pre>
    </div>
  </div>

  <!-- ==================== DEVELOPER ROADMAP & IMPLEMENTATION MATRIX ==================== -->
  <div class="page-break">
    <h1 class="sec-title">6. Developer Implementation Matrix & API Integration Contracts</h1>

    <p>
      The table below summarizes the technical specifications, communication protocols, and file locations for the Data/AI developer:
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Agent ID</th>
          <th>Agent Name</th>
          <th>Trigger Event</th>
          <th>Target Controller</th>
          <th>Associated UI File</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-tag">lead_intelligence</span></td>
          <td>Lead Scoring</td>
          <td>POST /api/public/proposals</td>
          <td><span class="code-tag">LeadController@publicStore</span></td>
          <td><span class="code-tag">CrmLeads.jsx</span></td>
        </tr>
        <tr>
          <td><span class="code-tag">sales_assistant</span></td>
          <td>Rep Copilot</td>
          <td>On-Demand / Deal Inspection</td>
          <td><span class="code-tag">DealController@show</span></td>
          <td><span class="code-tag">CrmPipeline.jsx</span></td>
        </tr>
        <tr>
          <td><span class="code-tag">follow_up</span></td>
          <td>7-Day Follow-Up</td>
          <td>Cron: app:check-dormant</td>
          <td><span class="code-tag">ActivityController@followUp</span></td>
          <td><span class="code-tag">CrmActivities.jsx</span></td>
        </tr>
        <tr>
          <td><span class="code-tag">crm_data</span></td>
          <td>Data Hygiene</td>
          <td>POST /api/accounts & leads</td>
          <td><span class="code-tag">AccountController@store</span></td>
          <td><span class="code-tag">CrmAccounts.jsx</span></td>
        </tr>
        <tr>
          <td><span class="code-tag">sales_analytics</span></td>
          <td>Forecasting</td>
          <td>GET /api/analytics/kpis</td>
          <td><span class="code-tag">AnalyticsController@kpis</span></td>
          <td><span class="code-tag">CrmDashboard.jsx</span></td>
        </tr>
        <tr>
          <td><span class="code-tag">document_agent</span></td>
          <td>Quote Engine</td>
          <td>POST /api/quotes</td>
          <td><span class="code-tag">QuoteController@store</span></td>
          <td><span class="code-tag">CrmQuotes.jsx</span></td>
        </tr>
        <tr>
          <td><span class="code-tag">automation_agent</span></td>
          <td>Workflow Triggers</td>
          <td>POST /public/quotes/:token/accept</td>
          <td><span class="code-tag">PublicQuoteController@accept</span></td>
          <td><span class="code-tag">ClientQuotePortal.jsx</span></td>
        </tr>
      </tbody>
    </table>

    <div class="card-highlight" style="margin-top: 14px;">
      <h3 style="font-weight: 800; font-size: 11px; color: #1e40af; margin-bottom: 4px;">Developer Confirmation Checklist</h3>
      <ol style="margin-left: 18px; color: #1e3a8a; line-height: 1.6;">
        <li>Confirm all 7 AI Agent code IDs match the backend database enumeration.</li>
        <li>Ensure output JSON schemas follow exact key names (e.g. <span class="code-tag">ai_score</span>, <span class="code-tag">score_reason</span>, <span class="code-tag">ai_recommendation</span>).</li>
        <li>Implement fallback heuristics for every AI in case the LLM API is unreachable (graceful degradation).</li>
        <li>Enforce strict human-in-the-loop review for follow-up message dispatches and discount overrides.</li>
      </ol>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8;">
      Intelligence Sales Platform &bull; End of Technical Blueprint &bull; Ready for AI Development & Deployment
    </div>
  </div>

</body>
</html>
"""

print(f"Writing HTML documentation to {HTML_FILE}...")
with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML generated successfully! File size: {os.path.getsize(HTML_FILE)} bytes.")

# Now compile to PDF using Selenium headless PrintToPDF
print("Generating PDF from HTML using headless Chrome...")
chrome_opts = Options()
chrome_opts.add_argument("--headless")
chrome_opts.add_argument("--disable-gpu")
chrome_opts.add_argument("--no-sandbox")
chrome_opts.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

driver = webdriver.Chrome(options=chrome_opts)
try:
    file_url = "file:///" + HTML_FILE.replace("\\", "/")
    print(f"Loading {file_url} in headless Chrome...")
    driver.get(file_url)
    
    print_options = PrintOptions()
    print_options.page_ranges = [] # all pages
    
    pdf_base64 = driver.print_page(print_options)
    
    with open(PDF_FILE, "wb") as f:
        f.write(base64.b64decode(pdf_base64))
        
    print(f"PDF GENERATED SUCCESSFULLY! Location: {PDF_FILE} (Size: {os.path.getsize(PDF_FILE)} bytes)")
finally:
    driver.quit()

print("ALL_DONE_SUCCESSFULLY")
