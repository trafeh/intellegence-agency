import os
import sys
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

SCREENSHOTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "docs_assets", "screenshots"))
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

options = ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--window-size=1520,1000")
options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

driver = webdriver.Chrome(options=options)

def set_auth_and_lang(lang="ar"):
    driver.get("http://localhost:5173")
    time.sleep(1)
    user_json = json.dumps({
        "id": "usr_dir",
        "name": "Amine Benzekri",
        "email": "director@intellegence-sales.com",
        "role": "director",
        "title": "VP of Sales & Commercial Director",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "initials": "AB",
        "phone": "+212 661 23 45 67",
        "quota": 3500000,
        "achieved": 2850000
    })
    driver.execute_script(f"localStorage.setItem('intelligence_sales_user', '{user_json}');")
    driver.execute_script(f"localStorage.setItem('intelligence_sales_lang', '{lang}');")

def snap(filename, scroll_y=0, wait_sec=2):
    if scroll_y > 0:
        driver.execute_script(f"window.scrollTo(0, {scroll_y});")
        time.sleep(1)
    time.sleep(wait_sec)
    out_path = os.path.join(SCREENSHOTS_DIR, filename)
    driver.save_screenshot(out_path)
    print(f"Captured: {filename} ({os.path.getsize(out_path)} bytes)")

try:
    print("Starting screenshots capture...")

    # 1. Landing Hero
    driver.get("http://localhost:5173/")
    snap("01_landing_hero.png", scroll_y=0, wait_sec=2)

    # 2. Landing Follow-Up Engine Simulation
    snap("02_landing_followup.png", scroll_y=1900, wait_sec=2)

    # 3. Landing AI Agents Orchestrator
    snap("03_landing_ai_agents.png", scroll_y=2650, wait_sec=2)

    # 4. Landing Executive Analytics & Funnel
    snap("04_landing_analytics.png", scroll_y=3450, wait_sec=2)

    # 5. Login Page
    driver.get("http://localhost:5173/login")
    snap("05_login_page.png", scroll_y=0, wait_sec=2)

    # CRM Arabic Session
    set_auth_and_lang("ar")

    # 6. CRM Dashboard (Executive Cockpit)
    driver.get("http://localhost:5173/crm/dashboard")
    snap("06_crm_dashboard.png", scroll_y=0, wait_sec=3)

    # 7. CRM Deals Pipeline (Kanban)
    driver.get("http://localhost:5173/crm/pipeline")
    snap("07_crm_pipeline_kanban.png", scroll_y=0, wait_sec=3)

    # 8. Deal Inspection Modal
    try:
        deal_cards = driver.find_elements(By.XPATH, "//div[contains(@class, 'cursor-pointer') and contains(@class, 'rounded-lg')]")
        if deal_cards:
            deal_cards[0].click()
            time.sleep(1.5)
            snap("08_crm_deal_modal.png", wait_sec=1)
            close_btn = driver.find_elements(By.XPATH, "//button[contains(., '×') or contains(@class, 'hover:text')]")
            if close_btn:
                close_btn[0].click()
                time.sleep(1)
        else:
            snap("08_crm_deal_modal.png", wait_sec=1)
    except Exception as e:
        print("Deal modal note:", str(e)[:100])
        snap("08_crm_deal_modal.png", wait_sec=1)

    # 9. CRM Leads & Scoring
    driver.get("http://localhost:5173/crm/leads")
    snap("09_crm_leads_scoring.png", scroll_y=0, wait_sec=3)

    # 10. Add New Lead Modal
    try:
        new_lead_btn = driver.find_elements(By.XPATH, "//button[contains(., 'عميل جديد') or contains(., 'Lead') or contains(., 'إضافة')]")
        if new_lead_btn:
            new_lead_btn[0].click()
            time.sleep(1.5)
            snap("10_crm_lead_modal.png", wait_sec=1)
            driver.get("http://localhost:5173/crm/leads")
            time.sleep(1)
        else:
            snap("10_crm_lead_modal.png", wait_sec=1)
    except Exception as e:
        print("Lead modal note:", str(e)[:100])
        snap("10_crm_lead_modal.png", wait_sec=1)

    # 11. CRM Accounts & Contacts
    driver.get("http://localhost:5173/crm/accounts")
    snap("11_crm_accounts.png", scroll_y=0, wait_sec=3)

    # 12. CRM Quotes & Devis Generator
    driver.get("http://localhost:5173/crm/quotes")
    snap("12_crm_quotes.png", scroll_y=0, wait_sec=3)

    # 13. CRM Activities & 7-Day Follow-Up Engine
    driver.get("http://localhost:5173/crm/activities")
    snap("13_crm_activities_followup.png", scroll_y=0, wait_sec=3)

    # 14. CRM 7 Sales AI Agents
    driver.get("http://localhost:5173/crm/ai-agents")
    snap("14_crm_ai_agents.png", scroll_y=0, wait_sec=3)

    # 15. CRM Team Performance
    driver.get("http://localhost:5173/crm/team")
    snap("15_crm_team.png", scroll_y=0, wait_sec=3)

    # 16. CRM Settings & Localization
    driver.get("http://localhost:5173/crm/settings")
    snap("16_crm_settings.png", scroll_y=0, wait_sec=2)

    print("ALL_SCREENSHOTS_CAPTURED_SUCCESSFULLY!")

finally:
    driver.quit()
