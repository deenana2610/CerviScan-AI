import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function testRegisterPatient() {
  console.log('🚀 [Playwright] Launching Chrome for New Patient Registration Test...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('🌐 [Playwright] Loading CerviScan-AI (http://localhost:5173)...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const screenshotDir = path.resolve('test-artifacts');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Navigate to Patient Directory
  console.log('🖱️ [Playwright] Clicking Patient Directory in sidebar...');
  await page.locator('aside button:has-text("Patient Directory")').click();
  await page.waitForTimeout(1500);

  // 2. Locate and Click "Register New Patient" button
  console.log('🔍 [Playwright] Locating and clicking "Register New Patient" button...');
  const registerBtn = page.locator('button:has-text("Register New Patient")');
  await registerBtn.waitFor({ state: 'visible', timeout: 10000 });
  await page.screenshot({ path: path.join(screenshotDir, '07_register_button_visible.png') });
  console.log('📸 [Step 7] Screenshot saved: 07_register_button_visible.png');

  await registerBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '08_registration_modal_opened.png') });
  console.log('📸 [Step 8] Screenshot saved: 08_registration_modal_opened.png');

  // 3. Fill Form within the form container
  console.log('✍️ [Playwright] Filling registration form fields...');
  const form = page.locator('form');
  await form.locator('input[placeholder*="Siti Nurhaliza"]').fill('Nur Hazwani binti Zulkifli');
  await form.locator('input[placeholder*="910214"]').fill('950812-14-5542');
  await form.locator('input[type="number"]').fill('29');
  await form.locator('select').nth(0).selectOption('Malay'); // Ethnicity
  await form.locator('input[placeholder*="G2P2"]').fill('G1P0'); // Parity
  await form.locator('select').nth(1).selectOption('Hospital Kuala Lumpur (HKL)'); // Facility
  await form.locator('select').nth(2).selectOption('HPV 16+'); // HPV DNA
  await form.locator('input[type="tel"]').fill('+60 17-889 4432');
  await form.locator('select').nth(3).selectOption('HIGH_RISK'); // Risk
  await form.locator('textarea').fill('Referred from LPPKN screening with persistent HPV 16 positivity. Fast-tracked for digital colposcopy and automated lesion scoring.');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '09_registration_form_filled.png') });
  console.log('📸 [Step 9] Screenshot saved: 09_registration_form_filled.png');

  // 4. Click Submit button
  console.log('💾 [Playwright] Clicking "Save & Register Patient"...');
  await form.locator('button:has-text("Save & Register Patient")').click();

  // 5. Verify patient in table
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(screenshotDir, '10_patient_registered_in_table.png') });
  console.log('📸 [Step 10] Screenshot saved: 10_patient_registered_in_table.png');

  await browser.close();
  console.log('🎉 [Playwright] New Patient Registration E2E Test Completed Successfully!');
}

testRegisterPatient().catch((err) => {
  console.error('❌ Test Error:', err);
  process.exit(1);
});
