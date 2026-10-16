import os
import sys
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.print_page_options import PrintOptions

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
SCREENSHOTS_DIR = os.path.join(ROOT_DIR, "docs_assets", "screenshots")
HTML_FILE = os.path.join(ROOT_DIR, "Documentation_Generale_CRM_Darija.html")
PDF_FILE = os.path.join(ROOT_DIR, "Documentation_Generale_CRM_Darija.pdf")

def get_image_b64(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{encoded}"
    return ""

print("Encoding screenshots...")
img_hero = get_image_b64("01_landing_hero.png")
img_followup = get_image_b64("02_landing_followup.png")
img_ai_agents = get_image_b64("03_landing_ai_agents.png")
img_analytics = get_image_b64("04_landing_analytics.png")
img_login = get_image_b64("05_login_page.png")
img_dashboard = get_image_b64("06_crm_dashboard.png")
img_pipeline = get_image_b64("07_crm_pipeline_kanban.png")
img_deal_modal = get_image_b64("08_crm_deal_modal.png")
img_leads = get_image_b64("09_crm_leads_scoring.png")
img_lead_modal = get_image_b64("10_crm_lead_modal.png")
img_accounts = get_image_b64("11_crm_accounts.png")
img_quotes = get_image_b64("12_crm_quotes.png")
img_activities = get_image_b64("13_crm_activities_followup.png")
img_crm_agents = get_image_b64("14_crm_ai_agents.png")
img_team = get_image_b64("15_crm_team.png")
img_settings = get_image_b64("16_crm_settings.png")

html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>الدليل الشامل والتوثيق العام لنظام Intelligence Sales CRM</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

    @page {{
      size: A4;
      margin: 12mm 14mm 12mm 14mm;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      line-height: 1.6;
      font-size: 11pt;
      direction: rtl;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}

    .container {{
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #ffffff;
    }}

    /* Print action bar */
    .no-print {{
      background: #1e293b;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }}

    .btn-print {{
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      font-size: 11pt;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Cairo', sans-serif;
      transition: background 0.2s;
    }}
    .btn-print:hover {{
      background: #1d4ed8;
    }}

    @media print {{
      .no-print {{
        display: none !important;
      }}
      .container {{
        padding: 0 !important;
        max-width: 100% !important;
      }}
      .page-break {{
        page-break-before: always;
      }}
    }}

    .page-break {{
      page-break-before: always;
      margin-top: 24px;
    }}

    /* Header Cover */
    .header-card {{
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%);
      color: #ffffff;
      border-radius: 14px;
      padding: 28px 24px;
      margin-bottom: 24px;
      border: 1px solid #1e293b;
    }}

    .pill {{
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 9pt;
      font-weight: 800;
      margin-left: 8px;
      margin-bottom: 8px;
    }}
    .pill-blue {{ background: rgba(59, 130, 246, 0.25); color: #93c5fd; border: 1px solid rgba(147, 197, 253, 0.4); }}
    .pill-green {{ background: rgba(16, 185, 129, 0.25); color: #6ee7b7; border: 1px solid rgba(110, 231, 183, 0.4); }}
    .pill-purple {{ background: rgba(168, 85, 247, 0.25); color: #d8b4fe; border: 1px solid rgba(216, 180, 254, 0.4); }}

    h1.main-title {{
      font-size: 24pt;
      font-weight: 900;
      margin: 12px 0 6px 0;
      color: #ffffff;
      letter-spacing: -0.02em;
    }}

    .subtitle {{
      font-size: 12pt;
      color: #cbd5e1;
      margin-bottom: 16px;
      line-height: 1.5;
    }}

    .meta-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 14px;
      font-size: 9pt;
      color: #e2e8f0;
    }}

    /* Section Styling */
    .section-title {{
      font-size: 15pt;
      font-weight: 900;
      color: #0f172a;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 6px;
      margin: 26px 0 14px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .section-desc {{
      font-size: 10.5pt;
      color: #334155;
      margin-bottom: 14px;
      line-height: 1.6;
    }}

    .screen-box {{
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      margin: 14px 0 18px 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.04);
      page-break-inside: avoid;
    }}

    .screen-img {{
      width: 100%;
      height: auto;
      border-radius: 6px;
      display: block;
      border: 1px solid #e2e8f0;
    }}

    .screen-caption {{
      font-size: 9.5pt;
      font-weight: 700;
      color: #475569;
      margin-top: 8px;
      text-align: center;
    }}

    /* Highlights & Cards */
    .card-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 12px 0 16px 0;
      page-break-inside: avoid;
    }}

    .card {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      border-right: 4px solid #2563eb;
    }}

    .card.green {{ border-right-color: #10b981; }}
    .card.amber {{ border-right-color: #f59e0b; }}
    .card.rose {{ border-right-color: #ef4444; }}

    .card-header {{
      font-size: 11pt;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 6px;
    }}

    .card-body {{
      font-size: 9.5pt;
      color: #475569;
      line-height: 1.5;
    }}

    /* Custom Table */
    table.data-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 18px 0;
      font-size: 9.5pt;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      page-break-inside: avoid;
    }}

    table.data-table th {{
      background: #0f172a;
      color: #ffffff;
      padding: 10px 12px;
      text-align: right;
      font-weight: 800;
      font-size: 9pt;
    }}

    table.data-table td {{
      padding: 9px 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }}

    table.data-table tr:nth-child(even) {{
      background: #f8fafc;
    }}

    .badge-soft {{
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 8.5pt;
      font-weight: 700;
    }}
    .badge-soft.hot {{ background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }}
    .badge-soft.warm {{ background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }}
    .badge-soft.cold {{ background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }}

    ul.darija-list {{
      list-style-type: none;
      padding: 0;
      margin: 10px 0;
    }}
    ul.darija-list li {{
      position: relative;
      padding-right: 20px;
      margin-bottom: 8px;
      font-size: 10pt;
      color: #334155;
    }}
    ul.darija-list li::before {{
      content: "✦";
      position: absolute;
      right: 0;
      top: 0;
      color: #2563eb;
      font-weight: bold;
    }}

    .alert-box {{
      background: #eff6ff;
      border-right: 4px solid #2563eb;
      padding: 12px 16px;
      border-radius: 6px;
      margin: 14px 0;
      font-size: 9.5pt;
      color: #1e3a8a;
      line-height: 1.5;
    }}

    .alert-box.warning {{
      background: #fffbeb;
      border-right-color: #f59e0b;
      color: #92400e;
    }}

    .kpi-row {{
      display: flex;
      gap: 12px;
      margin: 14px 0;
    }}
    .kpi-box {{
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }}
    .kpi-val {{
      font-size: 16pt;
      font-weight: 900;
      color: #0284c7;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }}
    .kpi-lbl {{
      font-size: 8.5pt;
      font-weight: 700;
      color: #64748b;
      margin-top: 4px;
    }}

    .footer {{
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #94a3b8;
    }}
  </style>
</head>
<body>

  <div class="container">
    <!-- Top Bar for Browser Actions -->
    <div class="no-print">
      <div>
        <strong>📄 الدليل التوثيقي الشامل لنظام Intelligence Sales</strong>
        <span style="font-size: 9pt; opacity: 0.8; margin-right: 10px;">(جاهز للطباعة والحفظ بصيغة PDF)</span>
      </div>
      <button class="btn-print" onclick="window.print()">📥 حفظ / طباعة كملف PDF</button>
    </div>

    <!-- COVER / HEADER -->
    <div class="header-card">
      <div>
        <span class="pill pill-blue">نظام التشغيل التجاري الحديث</span>
        <span class="pill pill-green">نسخة الإنتاج الرسمية v1.0.0</span>
        <span class="pill pill-purple">ذكاء اصطناعي مغربي ودولي</span>
      </div>
      <h1 class="main-title">Intelligence Sales CRM</h1>
      <p class="subtitle">
        الدليل الشامل والمفصل بالدارجة المغربية: شرح جميع مكونات المنصة التجارية، الموقع التعريفي، مراحل مسار الصفقات (Pipeline)، تصنيف العملاء المحتملين (Lead Scoring)، محرك المتابعة وقاعدة 7 أيام الصارمة، وعروض الأسعار مع وكلاء الذكاء الاصطناعي السبعة.
      </p>
      
      <div class="meta-grid">
        <div><strong>🏢 المؤسسة:</strong> Intelligence Agency</div>
        <div><strong>🇲🇦 العملة المعتمدة:</strong> الدرهم المغربي (MAD)</div>
        <div><strong>🌐 اللغات المدعومة:</strong> العربية / الفرنسية / الإنجليزية</div>
        <div><strong>📅 تاريخ الإصدار:</strong> أكتوبر 2026</div>
      </div>
    </div>

    <!-- 1. ملخص تنفيذي -->
    <div class="section-title">
      <span>1. تقديم عام وفكرة المنصة (Overview)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">الفلسفة والهدف التجاري</span>
    </div>

    <p class="section-desc">
      منصة <strong>Intelligence Sales</strong> هي نظام تشغيل تجاري متكامل (Commercial Operating System) مخصص للشركات والمقاولات (B2B) في المغرب ومنطقة شمال إفريقيا. الهدف الأساسي منها هو تحويل المبيعات من خدمة عشوائية وغير منظمة إلى <strong>مسار علمي، دقيق، وقابل للقياس</strong> بفضل الذكاء الاصطناعي والحوكمة الصارمة.
    </p>

    <div class="kpi-row">
      <div class="kpi-box">
        <div class="kpi-val">+42%</div>
        <div class="kpi-lbl">سرعة إغلاق الصفقات (Pipeline Velocity)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-val">7 أيام</div>
        <div class="kpi-lbl">الحد الأقصى للركود (قاعدة المتابعة الصارمة)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-val">7 وكلاء</div>
        <div class="kpi-lbl">وكلاء مبيعات أذكياء يعملون بتناغم (AI Agents)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-val">100%</div>
        <div class="kpi-lbl">مراقبة بشرية قبل الإرسال (Human-in-the-Loop)</div>
      </div>
    </div>

    <div class="card-grid">
      <div class="card green">
        <div class="card-header">🛡️ محاربة الصفقات المنسية (Zero Forgotten Deals)</div>
        <div class="card-body">
          أكبر مشكل كيعانيو منو الشركات هو أن 24% من الصفقات كتموت حيت البائع كينسى يعاود يتاصل بالزبون بعد الاجتماع الأول. المنصة كترصد هاد الركود أوتوماتيكياً.
        </div>
      </div>
      <div class="card">
        <div class="card-header">🇲🇦 ملائمة للسوق المغربي (Morocco Native)</div>
        <div class="card-body">
          مبنية ومضبوطة بالدرهم المغربي (MAD)، أرقام التعريف الموحدة للمقاولات (ICE)، الضريبة على القيمة المضافة (TVA 20%)، وازدواجية التواصل (واتساب وإيميل).
        </div>
      </div>
    </div>

    <!-- 2. واجهة الموقع العام -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>2. الموقع التعريفي العام (Landing Page)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">بوابة الزوار واستعراض القوة</span>
    </div>

    <p class="section-desc">
      الموقع العام مصمم بطريقة عصرية راقية (Dark & Light Theme) كيعطي انطباع قوي للمدراء وأصحاب القرار:
    </p>

    <div class="screen-box">
      <img src="{img_hero}" class="screen-img" alt="Hero Section">
      <div class="screen-caption">الشاشة 1: الواجهة الرئيسية (Hero Section) مع رادار الصفقات التفاعلي المباشر (Deal Radar)</div>
    </div>

    <ul class="darija-list">
      <li><strong>رادار الصفقات المباشر (Live Commercial Cycle):</strong> على اليمين كيبان مسار الصفقة خطوة بخطوة من دخول الـ Lead حتى إغلاق الصفقة وربطها بنظام الـ ERP (+42% Pipeline Velocity).</li>
      <li><strong>شريط الملاحة (Sticky Navbar):</strong> كيمكنك تبدل اللغة في أي لحظة بين العربية، الفرنسية، والإنجليزية، وتبدل بين الوضع الليلي والنهاري.</li>
      <li><strong>أزرار التحفيز (CTAs):</strong> زر استكشاف النظام (Explore Commercial OS) وزر طلب الولوج المبكر (Request Early Access).</li>
    </ul>

    <div class="screen-box">
      <img src="{img_followup}" class="screen-img" alt="Follow Up Engine">
      <div class="screen-caption">الشاشة 2: محاكاة محرك المتابعة الذكي (Follow-Up Engine Simulation) وقاعدة 7 أيام</div>
    </div>

    <div class="alert-box warning">
      <strong>⚠️ كيفاش خدامة قاعدة 7 أيام (7-Day Rule)؟</strong><br>
      إذا دازت 7 أيام على أي صفقة بدون مكالمة هاتفية، أو إيميل، أو اجتماع مسجل، النظام كيطلق إنذار أصفر/أحمر، والوكيل الذكي كيوجد أوتوماتيكياً رسالة واتساب وإيميل مخصصة باللغة المناسبة، وكيطلب من البائع فقط يضغط على "موافقة وإرسال" (Approval).
    </div>

    <div class="screen-box">
      <img src="{img_ai_agents}" class="screen-img" alt="AI Agents">
      <div class="screen-caption">الشاشة 3: توزيع وكلاء الذكاء الاصطناعي السبعة (7 Specialized Sales AI Agents)</div>
    </div>

    <div class="screen-box">
      <img src="{img_analytics}" class="screen-img" alt="Analytics Funnel">
      <div class="screen-caption">الشاشة 4: تحليلات الأداء وقمع التحويل (Executive Analytics & Conversion Funnel)</div>
    </div>

    <!-- 3. تسجيل الدخول والأدوار -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>3. تسجيل الدخول وحوكمة الأدوار (Authentication & Roles)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">الأمان والولوج السريع</span>
    </div>

    <p class="section-desc">
      صفحة تسجيل الدخول كتوفر دخول سريع بنقرة واحدة (1-Click Demo Login) لتجربة المنصة بصفتين مختلفتين:
    </p>

    <div class="screen-box">
      <img src="{img_login}" class="screen-img" alt="Login Page">
      <div class="screen-caption">الشاشة 5: صفحة الدخول مع أزرار الدخول السريع كمدير أو كبائع (Director vs Sales Rep)</div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>الدور (Role)</th>
          <th>المستخدم النموذجي</th>
          <th>الصلاحيات ونطاق الرؤية</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>مدير المبيعات<br>(VP / Commercial Director)</strong></td>
          <td>أمين بنزكري<br>(Amine Benzekri)</td>
          <td>
            • رؤية شاملة على كل المبيعات في المغرب (الدار البيضاء، الرباط، طنجة، مراكش، أكادير).<br>
            • تحديد الأهداف والحصص الفردية لكل بائع (Quotas).<br>
            • <strong>صلاحية حصرية:</strong> قبول أو رفض التخفيضات الكبرى في عروض الأسعار (التي تتجاوز 15%).
          </td>
        </tr>
        <tr>
          <td><strong>الممثل التجاري<br>(Senior Sales Rep)</strong></td>
          <td>كريم التازي / ياسمين العلمي<br>(Karim Tazi / Yasmine Alami)</td>
          <td>
            • تتبع محفظة الزبائن والصفقات الخاصة به فقط.<br>
            • تحويل الـ Leads وإعداد عروض الأسعار المباشرة.<br>
            • استقبال اقتراحات المتابعة وتأكيد إرسال رسائل الواتساب.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 4. لوحة التحكم المركزية -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>4. لوحة التحكم التنفيذية للـ CRM (Executive Dashboard)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">مركز القيادة واتخاذ القرار</span>
    </div>

    <p class="section-desc">
      لوحة القيادة كتعطي للمدير أو البائع نظرة فورية ومباشرة على صحة الأنشطة التجارية:
    </p>

    <div class="screen-box">
      <img src="{img_dashboard}" class="screen-img" alt="CRM Dashboard">
      <div class="screen-caption">الشاشة 6: لوحة تحكم الـ CRM بالعربية مع مؤشرات الـ KPIs ومخطط توقعات الإيرادات</div>
    </div>

    <ul class="darija-list">
      <li><strong>بطاقات الـ KPIs الرئيسية:</strong> كتعطيك الهدف الفصلي المحقق (مثلاً 2.85M درهم من أصل 3.5M درهم)، مجموع الصفقات النشطة (Active Pipeline)، وعدد الصفقات الراكدة اللي محتاجة تدخل فوري.</li>
      <li><strong>مسار الإيرادات التنبؤي (Revenue Trajectory Chart):</strong> كيقارن المبيعات الفعلية (Actuals) مع الهدف المحدد (Quota) وتوقعات الذكاء الاصطناعي (AI Forecast) للشهر القادم.</li>
      <li><strong>توزيع المراحل (Stage Distribution BarChart):</strong> رسم بياني تفاعلي كيبين القيمة المالية لكل مرحلة مع إمكانية الضغط للانتقال المباشر.</li>
      <li><strong>صفقات ذات أولوية عليا (High-Priority Opportunities):</strong> جدول كيرتب الصفقات الكبرى (Atlas Distribution, Dislog Group...) مع توصية مخصصة لكل صفقة من طرف الـ AI.</li>
    </ul>

    <!-- 5. مسار الصفقات والفرص -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>5. مسار الصفقات التجارية والفرص (Deals Pipeline & Opportunities)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">لوحة كانبان والمراحل السبعة</span>
    </div>

    <p class="section-desc">
      هنا كيتدار التسيير البصري للصفقات (Kanban Board) مقسمة على 7 د المراحل الصريحة:
    </p>

    <div class="screen-box">
      <img src="{img_pipeline}" class="screen-img" alt="Deals Pipeline Kanban">
      <div class="screen-caption">الشاشة 7: لوحة كانبان التفاعلية لصفقات المبيعات موزعة على الأعمدة السبعة بالدرهم المغربي</div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>المرحلة (Stage)</th>
          <th>الاسم بالفرنسية</th>
          <th>الشرح بالدارجة</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. عملاء محتملون (Leads)</strong></td>
          <td>New Leads</td>
          <td>الصفقة عاد تزادت جديدة إما يدوياً أو تحولات من Lead عبر الموقع/الواتساب.</td>
        </tr>
        <tr>
          <td><strong>2. تأهيل الفرصة (Qualification)</strong></td>
          <td>Qualification</td>
          <td>التأكد من أن الزبون عندو الميزانية الكافية، واحتياج حقيقي، وتحديد صاحب القرار (BANT).</td>
        </tr>
        <tr>
          <td><strong>3. استكشاف واحتياج (Discovery)</strong></td>
          <td>Découverte / Audit</td>
          <td>اجتماع تقني وعمل تدقيق لمعرفة دفتر التحملات الخاص بالشركة.</td>
        </tr>
        <tr>
          <td><strong>4. عرض سعر (Proposal)</strong></td>
          <td>Proposition / Devis</td>
          <td>صياغة عرض السعر الرسمي وإرسالو للمسؤول التجاري للشركة.</td>
        </tr>
        <tr>
          <td><strong>5. مفاوضات (Negotiation)</strong></td>
          <td>Négociation</td>
          <td>مفاوضات على نسبة التخفيض، آجال التسليم، والشروط القانونية.</td>
        </tr>
        <tr>
          <td><strong>6. صفقة رابحة (Closed Won)</strong></td>
          <td>Gagné (Signé)</td>
          <td>توقيع العقد، تحويل الاحتمالية لـ 100%، وإطلاق عملية التسليم للـ ERP.</td>
        </tr>
        <tr>
          <td><strong>7. صفقة خاسرة (Closed Lost)</strong></td>
          <td>Perdu</td>
          <td>إلغاء الصفقة مع تسجيل سبب الخسارة للتعلم منها مستقبلاً.</td>
        </tr>
      </tbody>
    </table>

    <div class="screen-box">
      <img src="{img_deal_modal}" class="screen-img" alt="Deal Details Modal">
      <div class="screen-caption">الشاشة 8: نافذة فحص وتشخيص الصفقة (Deal Diagnosis Modal) مع توصية الذكاء الاصطناعي وتاريخ المتابعة</div>
    </div>

    <!-- 6. العملاء المحتملون والسكورينغ -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>6. العملاء المحتملون والتأهيل الذكي (Leads & Inbound Intelligence)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">نظام السكورينغ والتحويل بنقرة واحدة</span>
    </div>

    <p class="section-desc">
      وحدة الـ Leads كتوفر فرز ذكي للزبناء المحتملين قبل ما يدخلو للمسار، مع تنقيط دقيق من 0 إلى 100:
    </p>

    <div class="screen-box">
      <img src="{img_leads}" class="screen-img" alt="Leads and Scoring">
      <div class="screen-caption">الشاشة 9: جدول الـ Leads مع تنقيط الذكاء الاصطناعي، درجة الحرارة، وميزة 1-Click Convert to Deal</div>
    </div>

    <div class="alert-box">
      <strong>🎯 علاش قناة "Source: WhatsApp Inbound" كتاخد أعلى سكور (94/100)؟</strong><br>
      • <strong>نية شراء فورية (Urgent Intent):</strong> الزبون اللي كيكتب ليك ف الواتساب من تلقاء نفسه عندو مشكل مستعجل باغي يحلو دابا.<br>
      • <strong>رقم هاتف مباشر ومؤكد:</strong> كتكون عندك وسيلة تواصل مباشرة مع المدير أو المسؤول بدون وسيط.<br>
      • <strong>معدل تحويل قياسي:</strong> الإحصائيات كتبين أن سرعة الإغلاق عبر محادثات الواتساب كتكون 3 إلى 5 أضعاف مقارنة بالإيميلات الباردة.
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>المصدر (Channel)</th>
          <th>الشركة النموذجية</th>
          <th>السكور والحرارة</th>
          <th>تحليل الذكاء الاصطناعي (AI Notes)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>WhatsApp Inbound</strong></td>
          <td>Cosumar Distribution</td>
          <td><span class="badge-soft hot">🔥 94 / 100 (Hot)</span></td>
          <td>اهتمام كبير بأتمتة عروض الأسعار عبر الواتساب. القرار متوقع في أقل من شهر.</td>
        </tr>
        <tr>
          <td><strong>Website Contact Form</strong></td>
          <td>Bimo & Mondelez Maroc</td>
          <td><span class="badge-soft hot">🔥 88 / 100 (Hot)</span></td>
          <td>تيليشارجاو كتاب "Commercial OS" وطلبو عرض تجريبي تنفيذي مباشر.</td>
        </tr>
        <tr>
          <td><strong>Client Referral</strong></td>
          <td>Agadir Pêche Export</td>
          <td><span class="badge-soft warm">⚡ 68 / 100 (Warm)</span></td>
          <td>توصية من عند Atlas Distribution. محتاجين أتمتة وصولات طلبيات السمك.</td>
        </tr>
        <tr>
          <td><strong>LinkedIn Campaign</strong></td>
          <td>Maroc Bureau Mobilier</td>
          <td><span class="badge-soft cold">❄️ 45 / 100 (Cold)</span></td>
          <td>شركة متوسطة، كيكتاشفو ميزانية سنة 2027 القادمة (دورة شراء طويلة).</td>
        </tr>
      </tbody>
    </table>

    <div class="screen-box">
      <img src="{img_lead_modal}" class="screen-img" alt="Add Lead Modal">
      <div class="screen-caption">الشاشة 10: نافذة إضافة زبون محتمل جديد وتحديد القناة والميزانية التقديرية بالدرهم</div>
    </div>

    <!-- 7. إدارة الشركات والحسابات -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>7. إدارة الشركات والحسابات التجارية (Accounts & Client 360)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">دليل المقاولات والربط المالي</span>
    </div>

    <p class="section-desc">
      كل شركة كيكون عندها ملف متكامل (Client 360) كيبين الأرقام القانونية، رقم المعاملات التراكمي، وسقف القرض المالي:
    </p>

    <div class="screen-box">
      <img src="{img_accounts}" class="screen-img" alt="CRM Accounts">
      <div class="screen-caption">الشاشة 11: دليل الحسابات التجارية (Dislog, Atlas, LabelVie, Pharma Nord...) وربطها بالصفقات</div>
    </div>

    <ul class="darija-list">
      <li><strong>التصنيف التجاري (Tier A / Tier B):</strong> تصنيف الزبناء حسب الأهمية وحجم الأعمال السنوي.</li>
      <li><strong>سقف الائتمان (Credit Limit):</strong> تحديد سقف التسهيلات المالية المسموح بها لكل شركة بالدرهم المغربي لتقليل مخاطر عدم الأداء.</li>
      <li><strong>الصفقات المرتبطة (Linked Deals):</strong> رؤية سريعة لعدد الصفقات المفتوحة لكل حساب مع إمكانية إضافة صفقة جديدة بضغطة زر.</li>
    </ul>

    <!-- 8. عروض الأسعار والفوترة -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>8. محرك عروض الأسعار والفوترة (Quotation Engine & Devis)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">توليد الديفيات وحوكمة التخفيضات</span>
    </div>

    <p class="section-desc">
      نظام عروض الأسعار كيضمن احترام هوامش الربح القانونية والمؤسساتية:
    </p>

    <div class="screen-box">
      <img src="{img_quotes}" class="screen-img" alt="CRM Quotes">
      <div class="screen-caption">الشاشة 12: إدارة عروض الأسعار الرسمية (DEV-2026-xxx) وتطبيق الضريبة على القيمة المضافة 20%</div>
    </div>

    <div class="alert-box warning">
      <strong>⚖️ قاعدة حوكمة التخفيضات (Discount Approval Rule):</strong><br>
      • <strong>تخفيض أقل من 15%:</strong> البائع يقدر يرسل العرض مباشرة للزبون (Status: Sent).<br>
      • <strong>تخفيض أكثر من 15%:</strong> العرض كيتحبس أوتوماتيكياً (Status: Pending Approval)، وما يقدر يخرج حتى يوافق عليه مدير المبيعات (Director) شخصياً.
    </div>

    <ul class="darija-list">
      <li><strong>الحساب التلقائي للضريبة:</strong> حساب المجموع دون احتساب الرسوم (HT)، احتساب ضريبة القيمة المضافة المغربية (TVA 20%)، والمجموع مع احتساب الرسوم (TTC).</li>
      <li><strong>الربط بنظام الـ ERP:</strong> بمجرد ما كيوافق الزبون على العرض (Accept Quote)، الصفقة في الـ Pipeline كتولي مباشرة "Won" وكيتم إطلاق إشعار لأقسام اللوجيستيك والمالية.</li>
    </ul>

    <!-- 9. الأنشطة ومحرك المتابعة -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>9. الأنشطة ومحرك المتابعة الصارم (Activities & Follow-Up Engine)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">رصد الركود وإعادة تنشيط الصفقات</span>
    </div>

    <p class="section-desc">
      صفحة الأنشطة هي المكان اللي كيتم فيه إنقاذ الصفقات اللي دخلات ف حالة نوم:
    </p>

    <div class="screen-box">
      <img src="{img_activities}" class="screen-img" alt="Activities Follow-Up">
      <div class="screen-caption">الشاشة 13: محرك المتابعة مع مسودات الواتساب المقترحة بالذكاء الاصطناعي وجدول المواعيد</div>
    </div>

    <ul class="darija-list">
      <li><strong>صندوق المتابعة التلقائية (Autonomous Follow-Up Box):</strong> كيعرض الصفقات اللي تجاوزت 7 أيام بدون تفاعل، مع مسودة رسالة جاهزة (مثلاً تذكير بعرض السعر DEV-2026-088).</li>
      <li><strong>أزرار التنفيذ بنقرة واحدة:</strong> البائع كيضغط على "إرسال عبر الواتساب" أو "إرسال إيميل" بعد مراجعة النص، ومباشرة كيتصفر عداد الأيام (Last Activity = 0) وكتسجل كعملية منجزة.</li>
      <li><strong>سجل المكالمات والاجتماعات:</strong> جدول كيوثق كل تواصل بين الفريق والزبناء لتفادي تكرار الاتصال أو تضارب المواعيد.</li>
    </ul>

    <!-- 10. وكلاء الذكاء الاصطناعي وفريق العمل -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>10. وكلاء الذكاء الاصطناعي وفريق العمل (AI Agents & Team Performance)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">الأتمتة وتوزيع الحصص البيعية</span>
    </div>

    <p class="section-desc">
      المنصة كتحرك 7 د الوكلاء الأذكياء بتناسق تام مع الفريق التجاري:
    </p>

    <div class="screen-box">
      <img src="{img_crm_agents}" class="screen-img" alt="CRM AI Agents">
      <div class="screen-caption">الشاشة 14: قائمة وكلاء المبيعات الأذكياء السبعة مع قدرات كل وكيل وحالته التشغيلية</div>
    </div>

    <div class="screen-box">
      <img src="{img_team}" class="screen-img" alt="CRM Team Performance">
      <div class="screen-caption">الشاشة 15: أداء فريق المبيعات وتوزيع الحصص البيعية (Quotas) حسب المناطق المغربية</div>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-header">1. وكيل تأهيل الـ Leads (Lead Intelligence)</div>
        <div class="card-body">تنقيط الزبناء المحتملين واكتشاف نية الشراء وحجم الميزانية.</div>
      </div>
      <div class="card amber">
        <div class="card-header">2. محرك المتابعة (Smart Follow-Up)</div>
        <div class="card-body">مراقبة قاعدة 7 أيام وصياغة رسائل التذكير بالعربية والفرنسية.</div>
      </div>
      <div class="card green">
        <div class="card-header">3. وكيل المستندات والعقود (Document Agent)</div>
        <div class="card-body">توليد عروض الأسعار وحساب الضريبة والتحقق من سقف التخفيض.</div>
      </div>
      <div class="card rose">
        <div class="card-header">4. وكيل التحليلات التنبؤية (Predictive Analytics)</div>
        <div class="card-body">حساب سرعة دوران الصفقات وتوقع مداخيل الأشهر القادمة.</div>
      </div>
    </div>

    <!-- 11. الإعدادات واللغات -->
    <div class="page-break"></div>
    <div class="section-title">
      <span>11. الإعدادات والتخصيص المؤسساتي (Settings & Localization)</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">التحكم باللغات والمظهر</span>
    </div>

    <p class="section-desc">
      صفحة الإعدادات كتمكن كل مستخدم من ضبط تجربة العمل اللي كتناسبو:
    </p>

    <div class="screen-box">
      <img src="{img_settings}" class="screen-img" alt="CRM Settings">
      <div class="screen-caption">الشاشة 16: لوحة الإعدادات والتحكم في اللغات، المظهر الليلي، ومعلومات الحساب</div>
    </div>

    <ul class="darija-list">
      <li><strong>التبديل الفوري بين 3 لغات:</strong> دعم كامل للعربية (مع انعكاس الواجهة RTL تلقائياً)، والفرنسية، والإنجليزية.</li>
      <li><strong>المظهر (Dark / Light Theme):</strong> واجهة ليلية مريحة للعين بلون كحلي ملكي داكن (#0f172a)، أو واجهة نهارية نظيفة ومشرقة.</li>
      <li><strong>إعادة ضبط البيانات التجريبية (Reset Mock Data):</strong> زر لإرجاع البيانات للوضع الافتراضي النظيف في أي وقت بنقرة واحدة.</li>
    </ul>

    <!-- خلاصة وتوصيات -->
    <div class="section-title">
      <span>12. خلاصة وتوصيات الاستخدام اليومي</span>
      <span style="font-size: 9pt; color: #64748b; font-weight: normal;">Best Practices</span>
    </div>

    <div class="alert-box">
      <strong>📌 الروتين اليومي المثالي للبائع والمشرف التجاري في المنصة:</strong><br>
      1. <strong>في الصباح (09:00):</strong> فتح لوحة التحكم (Dashboard) ومراجعة التنبيهات الحمراء للصفقات الراكدة.<br>
      2. <strong>معالجة المتابعات (09:30):</strong> الدخول لـ Activities وتأكيد إرسال رسائل الواتساب المقترحة بضغطة زر واحدة.<br>
      3. <strong>فرز الـ Leads الجدد (11:00):</strong> معاينة الـ Leads ذات السكور المرتفع (Hot 🔥) وتحويلها مباشرة لصفقات نشطة ف الـ Pipeline.<br>
      4. <strong>إعداد ومراجعة الديفيات (14:30):</strong> إدخال عروض الأسعار والتأكد من عدم تجاوز نسبة 15% تخفيض إلا بعد تأشيرة المدير.<br>
      5. <strong>نهاية اليوم (17:30):</strong> تحريك الصفقات المنجزة في لوحة الـ Kanban إلى مرحلة Closed Won لمزامنتها مع الـ ERP.
    </div>

    <div class="footer">
      <span>Intelligence Sales Platform — دليل الاستخدام والتوثيق المكتبي الشامل v1.0.0</span>
      <span>كازابلانكا، مارينا الأعمال — المملكة المغربية 🇲🇦</span>
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
