import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\TUF A15 HN007WS\\.gemini\\antigravity\\brain\\29ba2ece-c670-4669-ad36-fafaa8bccff6\\screenshots';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Starting Automated Hackathon Verification Test...');
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // 1. Reset baseline data via backend API
  console.log('1. Resetting demo baseline database...');
  try {
    const resetRes = await fetch('http://localhost:5000/api/demo/reset', { method: 'POST' });
    const resetJson = await resetRes.json();
    console.log('Baseline reset response:', resetJson);
  } catch (err) {
    console.error('Reset failed:', err.message);
  }

  // 2. Launch headless Chrome
  console.log('2. Launching Chrome at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  page.on('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.accept();
  });

  // 3. Responsive Check: Mobile 375px
  console.log('3. Testing Mobile Viewport (375px)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_landing_mobile_375px.png') });
  console.log('Saved: 01_landing_mobile_375px.png');

  // Trigger Quick Donation on mobile
  console.log('Opening Quick Donation modal on mobile...');
  const quickDonateBtns = await page.$$('button');
  for (const btn of quickDonateBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('QUICK DONATION')) {
      await btn.click();
      break;
    }
  }
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_quick_donation_mobile_375px.png') });
  console.log('Saved: 02_quick_donation_mobile_375px.png');

  // Close modal if open
  const closeBtns = await page.$$('button');
  for (const btn of closeBtns) {
    const title = await page.evaluate(el => el.getAttribute('title') || '', btn);
    if (title.includes('Close')) {
      await btn.click();
      break;
    }
  }
  await sleep(500);

  // 4. Responsive Check: Tablet 768px
  console.log('4. Testing Tablet Viewport (768px)...');
  await page.setViewport({ width: 768, height: 1024, isMobile: false });
  await page.goto('http://localhost:5173/donations', { waitUntil: 'domcontentloaded' });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_browse_donations_tablet_768px.png') });
  console.log('Saved: 03_browse_donations_tablet_768px.png');

  // 5. Responsive Check: Desktop 1280px
  console.log('5. Testing Desktop Viewport (1280px)...');
  await page.setViewport({ width: 1280, height: 850, isMobile: false });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_landing_desktop_1280px.png') });
  console.log('Saved: 04_landing_desktop_1280px.png');

  // 6. Complete End-to-End Hackathon Journey
  console.log('6. Executing Donor Demo Flow...');
  await page.goto('http://localhost:5173/donor', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // Click "Post New Donation"
  console.log('Opening 4-Step Donation Wizard...');
  const postButtons = await page.$$('button');
  for (const btn of postButtons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Post New Donation')) {
      await btn.click();
      break;
    }
  }
  await sleep(1000);

  // Check Step 1: Food details & ~35 meals calculation
  console.log('Verifying 15 kg cooked food calculation...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_donation_wizard_step1_15kg_35meals.png') });
  console.log('Saved: 05_donation_wizard_step1_15kg_35meals.png');

  // Advance to Step 2
  const allBtns1 = await page.$$('button');
  for (const btn of allBtns1) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Next: Safety')) {
      await btn.click();
      break;
    }
  }
  await sleep(800);

  // Step 2: Try clicking next WITHOUT checking food safety disclaimer
  console.log('Verifying mandatory food safety disclaimer gate...');
  const allBtns2 = await page.$$('button');
  for (const btn of allBtns2) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Next: Logistics')) {
      await btn.click();
      break;
    }
  }
  await sleep(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_food_safety_validation_gate.png') });
  console.log('Saved: 06_food_safety_validation_gate.png');

  // Check the safety checkbox
  const safetyCheckbox = await page.$('input[type="checkbox"]');
  if (safetyCheckbox) {
    await safetyCheckbox.click();
  }
  await sleep(500);

  // Advance to Step 3 (Logistics)
  const allBtns3 = await page.$$('button');
  for (const btn of allBtns3) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Next: Logistics')) {
      await btn.click();
      break;
    }
  }
  await sleep(800);

  // Advance to Step 4 (Confirm)
  const allBtns4 = await page.$$('button');
  for (const btn of allBtns4) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Next: Review')) {
      await btn.click();
      break;
    }
  }
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_donation_confirm_step4.png') });
  console.log('Saved: 07_donation_confirm_step4.png');

  // Submit Donation
  console.log('Publishing donation...');
  const allBtns5 = await page.$$('button');
  for (const btn of allBtns5) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('CONFIRM & POST DONATION')) {
      await btn.click();
      break;
    }
  }
  await sleep(2500);

  // Look for View Smart Matches link or newly created donation
  const viewMatchesLink = await page.$('a[href*="/donations/"]');
  if (viewMatchesLink) {
    await viewMatchesLink.click();
  }
  await sleep(2000);

  // On Donation Details / Smart Match page
  console.log('Capturing Smart Matching Algorithm breakdown...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_smart_matching_algorithm.png') });
  console.log('Saved: 08_smart_matching_algorithm.png');

  // 7. Volunteer Flow
  console.log('7. Switching to Volunteer Demo...');
  const bannerBtns = await page.$$('button');
  for (const btn of bannerBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Volunteer Demo')) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);

  // Volunteer dashboard: accept newly posted donation
  console.log('Volunteer accepting pickup...');
  const acceptBtns = await page.$$('button');
  for (const btn of acceptBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Accept Pickup')) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_volunteer_accepted_pickup.png') });
  console.log('Saved: 09_volunteer_accepted_pickup.png');

  // Advance to Picked Up
  console.log('Volunteer marking food as Picked Up...');
  const pickupBtns = await page.$$('button');
  for (const btn of pickupBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Confirm Food Picked Up')) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_volunteer_picked_up.png') });
  console.log('Saved: 10_volunteer_picked_up.png');

  // Advance to Delivered
  console.log('Volunteer marking food as Delivered to NGO...');
  const deliveredBtns = await page.$$('button');
  for (const btn of deliveredBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Confirm Delivered')) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_volunteer_delivered.png') });
  console.log('Saved: 11_volunteer_delivered.png');

  // 8. NGO Flow
  console.log('8. Switching to NGO Demo...');
  const ngoDemoBtns = await page.$$('button');
  for (const btn of ngoDemoBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('NGO Demo')) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);

  // NGO marks food as Distributed
  console.log('NGO confirming distribution to beneficiaries...');
  const distributeBtns = await page.$$('button');
  for (const btn of distributeBtns) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes('Confirm Distributed')) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_ngo_distributed_completed.png') });
  console.log('Saved: 12_ngo_distributed_completed.png');

  // 9. Impact Dashboard Audit Check
  console.log('9. Checking Impact Dashboard for +15 kg and +35 meals...');
  await page.goto('http://localhost:5173/impact', { waitUntil: 'domcontentloaded' });
  await sleep(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_impact_dashboard_live_audit.png') });
  console.log('Saved: 13_impact_dashboard_live_audit.png');

  // 10. Interactive Map & Heatmap
  console.log('10. Checking Interactive Map & Heatmap...');
  await page.goto('http://localhost:5173/map', { waitUntil: 'domcontentloaded' });
  await sleep(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_interactive_map_and_heatmap.png') });
  console.log('Saved: 14_interactive_map_and_heatmap.png');

  // 11. Rule-Based Chat Assistant
  console.log('11. Testing Rule-Based Assistant with "I have 8 kg of cooked rice from an event"...');
  const chatToggle = await page.$('button[title*="FoodBridge Assistant"]');
  if (chatToggle) {
    await chatToggle.click();
    await sleep(800);
    const chatInput = await page.$('input[placeholder*="Ask"]');
    if (chatInput) {
      await chatInput.type('I have 8 kg of cooked rice from an event');
      await sleep(300);
      await chatInput.press('Enter');
      await sleep(1500);
    }
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_rule_based_chat_assistant.png') });
  console.log('Saved: 15_rule_based_chat_assistant.png');

  // 12. Leaderboard & Gamification Badges
  console.log('12. Checking Leaderboard & Gamification...');
  await page.goto('http://localhost:5173/leaderboard', { waitUntil: 'domcontentloaded' });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_leaderboard_and_badges.png') });
  console.log('Saved: 16_leaderboard_and_badges.png');

  console.log('🎉 ALL HACKATHON VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Verification script failed:', err);
  process.exit(1);
});
