import os
import sys
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By

sys.stdout.reconfigure(encoding='utf-8')

SCREENSHOTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "docs_assets", "english_screenshots"))
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

# 1. Fetch Auth Tokens from Backend API
print("Authenticating with API...")
admin_res = requests.post("http://127.0.0.1:8000/api/auth/login", json={
    "email": "admin@intelligencesales.com",
    "password": "password123"
})
admin_token = admin_res.json().get("token")

client_res = requests.post("http://127.0.0.1:8000/api/auth/login", json={
    "email": "client@marocraft.ma",
    "password": "password123"
})
client_token = client_res.json().get("token")

options = ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--window-size=1600,1050")
options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

driver = webdriver.Chrome(options=options)

def snap(filename, scroll_y=0, wait_sec=2):
    if scroll_y > 0:
        driver.execute_script(f"window.scrollTo(0, {scroll_y});")
        time.sleep(0.8)
    time.sleep(wait_sec)
    out_path = os.path.join(SCREENSHOTS_DIR, filename)
    driver.save_screenshot(out_path)
    print(f"Captured: {filename} ({os.path.getsize(out_path)} bytes)")

def set_auth(token, lang="en"):
    driver.get("http://localhost:5173")
    time.sleep(1)
    driver.execute_script(f"localStorage.setItem('intelligence_sales_token', '{token}');")
    driver.execute_script(f"localStorage.setItem('intelligence_sales_lang', '{lang}');")
    time.sleep(0.5)

try:
    print("Capturing English screenshots...")

    # 1. Landing Hero
    driver.get("http://localhost:5173")
    driver.execute_script("localStorage.setItem('intelligence_sales_lang', 'en');")
    driver.refresh()
    snap("01_landing_hero.png", scroll_y=0, wait_sec=2)

    # 2. Landing Proposal Modal (With Phone Input & Country Flag)
    try:
        quote_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Demande de Devis') or contains(., 'Devis') or contains(., 'Quote') or contains(., 'Proposal')]")
        if quote_btn:
            quote_btn[0].click()
            time.sleep(1.5)
            snap("02_landing_proposal_modal.png", wait_sec=1)
            close_btn = driver.find_elements(By.XPATH, "//button[contains(@aria-label, 'Close') or contains(@class, 'hover:text')]")
            if close_btn:
                close_btn[0].click()
                time.sleep(0.5)
        else:
            snap("02_landing_proposal_modal.png", wait_sec=1)
    except Exception as e:
        print("Proposal modal note:", str(e)[:80])
        snap("02_landing_proposal_modal.png", wait_sec=1)

    # 3. Login Page
    driver.get("http://localhost:5173/login")
    snap("03_login_page.png", scroll_y=0, wait_sec=2)

    # --- ADMIN / MANAGEMENT PERSPECTIVE ---
    set_auth(admin_token, "en")

    # 4. Executive Dashboard
    driver.get("http://localhost:5173/crm/dashboard")
    snap("04_crm_dashboard.png", scroll_y=0, wait_sec=3)

    # 5. Deals Pipeline (Kanban)
    driver.get("http://localhost:5173/crm/pipeline")
    snap("05_crm_pipeline.png", scroll_y=0, wait_sec=3)

    # 6. Deal Detail & Reassignment Modal
    try:
        deal_cards = driver.find_elements(By.XPATH, "//div[contains(@class, 'cursor-pointer') and contains(@class, 'rounded-lg')]")
        if deal_cards:
            deal_cards[0].click()
            time.sleep(1.5)
            snap("06_crm_deal_modal.png", wait_sec=1)
            close_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Close') or contains(., 'Fermer') or contains(@class, 'hover:text')]")
            if close_btn:
                close_btn[0].click()
                time.sleep(0.5)
        else:
            snap("06_crm_deal_modal.png", wait_sec=1)
    except Exception as e:
        print("Deal modal note:", str(e)[:80])
        snap("06_crm_deal_modal.png", wait_sec=1)

    # 7. Leads Prospecting & AI Scoring (With Red "NEW" Badge)
    driver.get("http://localhost:5173/crm/leads")
    snap("07_crm_leads.png", scroll_y=0, wait_sec=3)

    # 8. Add Lead Modal
    try:
        add_lead_btn = driver.find_elements(By.XPATH, "//button[contains(., 'New Lead') or contains(., 'Nouveau Lead')]")
        if add_lead_btn:
            add_lead_btn[0].click()
            time.sleep(1.5)
            snap("08_crm_lead_modal.png", wait_sec=1)
            close_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Cancel') or contains(., 'Annuler')]")
            if close_btn:
                close_btn[0].click()
                time.sleep(0.5)
        else:
            snap("08_crm_lead_modal.png", wait_sec=1)
    except Exception as e:
        print("Lead modal note:", str(e)[:80])
        snap("08_crm_lead_modal.png", wait_sec=1)

    # 9. B2B Accounts Directory
    driver.get("http://localhost:5173/crm/accounts")
    snap("09_crm_accounts.png", scroll_y=0, wait_sec=3)

    # 10. Quotations & Governance
    driver.get("http://localhost:5173/crm/quotes")
    snap("10_crm_quotes.png", scroll_y=0, wait_sec=3)

    # 11. Rep Activity Audit Logs
    driver.get("http://localhost:5173/crm/rep-logs")
    snap("11_crm_rep_logs.png", scroll_y=0, wait_sec=3)

    # 12. Smart Follow-Up & Activities Timeline
    driver.get("http://localhost:5173/crm/activities")
    snap("12_crm_activities.png", scroll_y=0, wait_sec=3)

    # 13. AI Agents Hub
    driver.get("http://localhost:5173/crm/ai-agents")
    snap("13_crm_ai_agents.png", scroll_y=0, wait_sec=3)

    # 14. Team Management
    driver.get("http://localhost:5173/crm/team")
    snap("14_crm_team.png", scroll_y=0, wait_sec=3)

    # --- CLIENT PERSPECTIVE ---
    set_auth(client_token, "en")

    # 15. Client Space Cockpit
    driver.get("http://localhost:5173/crm/dashboard")
    snap("15_client_space.png", scroll_y=0, wait_sec=3)

    # 16. Public Quotation Review & E-Signature Portal
    public_token = "pslCTxqKWiDAmJPd0fIVIXjHlyDtl0ewQsqCAr88BgpL0zfF"
    driver.get(f"http://localhost:5173/portal/quote/{public_token}")
    snap("16_client_portal_quote.png", scroll_y=0, wait_sec=3)

    print("All screenshots successfully captured!")

except Exception as err:
    print("Error during screenshot capture:", err)
finally:
    driver.quit()
