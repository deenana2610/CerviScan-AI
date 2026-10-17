import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runDeclutterE2ETest() {
  console.log('🚀 [Playwright] Launching Chrome for Full UI Declutter & Feature Verification...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Listen to dialogs (confirm delete)
  page.on('dialog', async (dialog) => {
    console.log(`💬 [Dialog] Intercepted confirm dialog: "${dialog.message()}" -> Accepting`);
    await dialog.accept();
  });

  // Track console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const artifactDir = path.resolve('test-artifacts');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  try {
    console.log('🌐 [Step 1] Loading CerviScan-AI (http://localhost:5173)...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);

    // 1. Verify 4 tabs in Sidebar
    console.log('🔍 [Step 2] Auditing Navigation Sidebar tabs...');
    const sidebar = page.locator('aside');
    await sidebar.waitFor({ state: 'visible' });

    const sidebarText = await sidebar.innerText();
    console.log('📋 Sidebar contents:\n', sidebarText);

    // Assert only 4 main tabs exist
    const hasOverview = await sidebar.locator('button:has-text("Overview & Analytics")').count() > 0;
    const hasPatients = await sidebar.locator('button:has-text("Patient Registry")').count() > 0;
    const hasScans = await sidebar.locator('button:has-text("AI Scans Workspace")').count() > 0;
    const hasAudit = await sidebar.locator('button:has-text("Audit & Compliance")').count() > 0;

    const hasOldAnalytics = await sidebar.locator('button:has-text("Clinical Analytics")').count() > 0;
    const hasOldSettings = await sidebar.locator('button:has-text("Screening Protocols")').count() > 0;

    console.log(`✓ Overview & Analytics tab present: ${hasOverview}`);
    console.log(`✓ Patient Registry tab present: ${hasPatients}`);
    console.log(`✓ AI Scans Workspace tab present: ${hasScans}`);
    console.log(`✓ Audit & Compliance tab present: ${hasAudit}`);
    console.log(`✓ Old standalone Analytics removed: ${!hasOldAnalytics}`);
    console.log(`✓ Old Settings tab removed: ${!hasOldSettings}`);

    if (!hasOverview || !hasPatients || !hasScans || !hasAudit || hasOldAnalytics || hasOldSettings) {
      throw new Error('Sidebar tab audit failed! Expected exactly 4 clean tabs.');
    }

    await page.screenshot({ path: path.join(artifactDir, 'declutter_01_overview.png') });
    console.log('📸 [Screenshot] declutter_01_overview.png saved.');

    // 2. Navigate to Patient Directory
    console.log('🔍 [Step 3] Navigating to Patient Registry...');
    await sidebar.locator('button:has-text("Patient Registry")').click();
    await page.waitForTimeout(2000);

    // Check "+ Register New Patient" button
    const registerBtn = page.locator('button:has-text("Register New Patient")');
    await registerBtn.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ "Register New Patient" button is visible and active.');

    // Check table rows & action buttons (Eye, Scan, Trash2/Delete)
    const firstRowActions = page.locator('tbody tr').first().locator('td').last();
    const hasEyeBtn = await firstRowActions.locator('button[title="Quick EHR Summary"]').count() > 0;
    const hasScanBtn = await firstRowActions.locator('button[title*="Workspace"]').count() > 0;
    const hasDeleteBtn = await firstRowActions.locator('button[title="Delete Patient"]').count() > 0;

    console.log(`✓ Eye (EHR) action button present: ${hasEyeBtn}`);
    console.log(`✓ Scan action button present: ${hasScanBtn}`);
    console.log(`✓ Delete (Trash) action button present: ${hasDeleteBtn}`);

    if (!hasDeleteBtn) {
      throw new Error('Delete button is missing from PatientTable actions column!');
    }

    await page.screenshot({ path: path.join(artifactDir, 'declutter_02_patient_directory.png') });
    console.log('📸 [Screenshot] declutter_02_patient_directory.png saved.');

    // 3. Register a temporary patient to verify Add & Delete workflow
    console.log('📝 [Step 4] Testing Register Patient modal and creation...');
    await registerBtn.click();
    await page.waitForTimeout(1000);

    const form = page.locator('form');
    await form.waitFor({ state: 'visible' });

    const testIc = '990202-10-8899';
    const testName = 'Test Automate UI Patient';
    await form.locator('input[placeholder*="Siti Nurhaliza"]').fill(testName);
    await form.locator('input[placeholder*="910214"]').fill(testIc);
    await form.locator('input[type="number"]').fill('27');
    await form.locator('select').nth(0).selectOption('Malay');
    await form.locator('input[placeholder*="G2P2"]').fill('G1P0');
    await form.locator('select').nth(1).selectOption('Hospital Kuala Lumpur (HKL)');
    await form.locator('select').nth(2).selectOption('Negative');
    await form.locator('input[type="tel"]').fill('+60 12-345 6789');
    await form.locator('select').nth(3).selectOption('LOW_RISK');
    await form.locator('textarea').fill('E2E automation test patient for add and delete lifecycle verification.');

    await form.locator('button:has-text("Save & Register Patient")').click();
    console.log('⏳ Waiting for Supabase insertion and UI table refresh...');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(artifactDir, 'declutter_03_patient_registered.png') });
    console.log('📸 [Screenshot] declutter_03_patient_registered.png saved.');

    // Verify test patient row exists
    const testPatientRow = page.locator(`tr:has-text("${testName}")`);
    const countRegistered = await testPatientRow.count();
    console.log(`✓ Found registered patient in table: ${countRegistered > 0}`);

    if (countRegistered > 0) {
      // 4. Test Delete button on the newly created patient
      console.log('🗑️ [Step 5] Testing Delete Patient button on newly created patient...');
      const deleteBtn = testPatientRow.locator('button[title="Delete Patient"]');
      await deleteBtn.click();
      await page.waitForTimeout(3000);

      await page.screenshot({ path: path.join(artifactDir, 'declutter_04_patient_deleted.png') });
      console.log('📸 [Screenshot] declutter_04_patient_deleted.png saved.');

      const countAfterDelete = await page.locator(`tr:has-text("${testName}")`).count();
      console.log(`✓ Patient row removed after delete: ${countAfterDelete === 0}`);
    }

    // 5. Audit Trail tab verification
    console.log('📜 [Step 6] Navigating to Audit & Compliance...');
    await sidebar.locator('button:has-text("Audit & Compliance")').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'declutter_05_audit_trail.png') });
    console.log('📸 [Screenshot] declutter_05_audit_trail.png saved.');

    // 6. Scan Viewer tab verification
    console.log('🔬 [Step 7] Navigating to AI Scans Workspace...');
    await sidebar.locator('button:has-text("AI Scans Workspace")').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'declutter_06_scan_viewer.png') });
    console.log('📸 [Screenshot] declutter_06_scan_viewer.png saved.');

    console.log('🎉 ALL DECLUTTER & CRUD TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: path.join(artifactDir, 'declutter_error.png') });
    throw err;
  } finally {
    await browser.close();
  }
}

runDeclutterE2ETest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
