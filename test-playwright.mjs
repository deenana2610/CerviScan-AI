import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runAutomation() {
  console.log('🚀 [Playwright] Launching Chrome browser...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('🌐 [Playwright] Navigating to CerviScan-AI (http://localhost:5173)...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const screenshotDir = path.resolve('test-artifacts');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Initial Dashboard
  await page.screenshot({ path: path.join(screenshotDir, '01_dashboard_loaded.png') });
  console.log('📸 [Step 1] Screenshot saved: 01_dashboard_loaded.png');

  // 2. Click Patient Directory in sidebar
  console.log('🖱️ [Playwright] Navigating to Patient Directory...');
  await page.locator('aside button:has-text("Patient Directory")').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotDir, '02_patients_directory.png') });
  console.log('📸 [Step 2] Screenshot saved: 02_patients_directory.png');

  // 3. Select Patient Fatimah Az-Zahra (PAT-2026-8846) which is "Pending Validation"
  console.log('🔎 [Playwright] Selecting Patient Fatimah Az-Zahra (PAT-2026-8846)...');
  const patientRow = page.locator('tr:has-text("PAT-2026-8846")');
  await patientRow.waitFor({ timeout: 10000 });
  
  const workstationBtn = patientRow.locator('button:has-text("Workstation"), button:has-text("Scan")').first();
  if (await workstationBtn.count() > 0) {
    await workstationBtn.click();
  } else {
    await patientRow.click();
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotDir, '03_scan_workstation_opened.png') });
  console.log('📸 [Step 3] Screenshot saved: 03_scan_workstation_opened.png');

  // 4. Fill in Specialist Diagnostic Notes in Scan Workspace
  console.log('✍️ [Playwright] Keying in Specialist Diagnostic Decision & Notes...');
  const notesTextarea = page.locator('textarea');
  await notesTextarea.waitFor({ timeout: 10000 });
  await notesTextarea.fill('Specialist Live Audit #2 (Playwright Automated Test): Confirmed inflammation resolved. Focal lesion visualized at squamocolumnar border. Punch biopsy ordered. Live PostgreSQL synchronization verified.');
  
  // Select Action Plan dropdown
  const actionSelect = page.locator('select').filter({ hasText: 'Punch Biopsy' });
  if (await actionSelect.count() > 0) {
    await actionSelect.selectOption({ label: 'Direct Colposcopy Punch Biopsy (Zone 1 & 2)' });
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '04_data_keyed_in.png') });
  console.log('📸 [Step 4] Screenshot saved: 04_data_keyed_in.png');

  // 5. Click "Submit Clinical Validation"
  console.log('💾 [Playwright] Clicking "Submit Clinical Validation"...');
  const submitBtn = page.locator('button:has-text("Submit Clinical Validation")');
  await submitBtn.click();

  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(screenshotDir, '05_validation_submitted_success.png') });
  console.log('📸 [Step 5] Screenshot saved: 05_validation_submitted_success.png');

  // 6. Navigate to Audit & Compliance in Sidebar
  console.log('📜 [Playwright] Checking Audit & Compliance view in sidebar...');
  await page.locator('aside button:has-text("Audit & Compliance")').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotDir, '06_audit_trail_verified.png') });
  console.log('📸 [Step 6] Screenshot saved: 06_audit_trail_verified.png');

  await browser.close();
  console.log('🎉 [Playwright] All automation steps completed successfully!');
}

runAutomation().catch((err) => {
  console.error('❌ Automation Error:', err);
  process.exit(1);
});
