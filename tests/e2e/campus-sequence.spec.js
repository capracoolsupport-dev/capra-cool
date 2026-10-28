import {test,expect} from '@playwright/test';

test('campus catalog follows the product sequence and every style shows 20% off',async({page},testInfo)=>{
 await page.goto('/campus.html');
 expect(await page.locator('.campus-product').evaluateAll(cards=>cards.map(card=>card.dataset.designId))).toEqual([
  'mandi-mountain-polo','mandi-maroon-polo','mandi-contrast-polo','mandi-grey-polo',
  'mandi-washed-tee','mandi-mountain-hoodie','mandi-washed-hoodie','mandi-acid-black-hoodie','mandi-cream-hoodie',
  'mandi-mountain-zip','mandi-varsity-black','mandi-varsity-brown','iit-mandi-tracksuit','iit-mandi-tracksuit-minimal'
 ]);
 await expect(page.locator('.campus-product .launch-label')).toHaveCount(14);
 for(const label of await page.locator('.campus-product .launch-label').all())await expect(label).toContainText('20%');
 await expect(page.locator('[data-design-id="mandi-varsity-black"] .card-prices')).toContainText('₹2,999');
 await expect(page.locator('[data-design-id="mandi-varsity-black"] .card-prices s')).toHaveText('₹3,749');
 await page.locator('#collection').scrollIntoViewIfNeeded();
 await page.screenshot({path:`test-results/campus-sequence-${testInfo.project.name}.png`});
});

test('acid-wash black hoodie has three views and can be added with printing at the trusted price',async({page},testInfo)=>{
 await page.route('**/api/orders',route=>route.fulfill({status:503,json:{error:'Test only'}}));
 await page.goto('/campus.html#design/mandi-acid-black-hoodie');
 await expect(page.locator('#designTitle')).toHaveText('Acid Wash Hoodie');
 await expect(page.locator('#designColour')).toHaveText('Acid-wash Black');
 await expect(page.locator('#designPrice')).toContainText('₹1,600');
 await expect(page.locator('#designPrice s')).toHaveText('₹2,000');
 await expect(page.locator('#designPrice .stock-status')).toHaveCount(0);
 for(const [index,view] of ['front','back','detail'].entries()){
  await page.locator(`#galleryControls [data-view="${index}"]`).click();
  await expect(page.locator('#designImage')).toHaveAttribute('src',new RegExp(`acid-black-hoodie-${view}\\.webp$`));
  await expect.poll(()=>page.locator('#designImage').evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy();
  await page.screenshot({path:`test-results/acid-black-${view}-${testInfo.project.name}.png`});
 }
 await page.locator('#designSizes [data-size="XXXL"]').click();
 await page.locator('#designPersonalisation').check();
 await page.locator('#designName').fill('CSE 2027');
 await expect(page.locator('#saveDesign')).toBeEnabled();
 await page.locator('#saveDesign').click();
 await expect(page.locator('#enquiryBagItems')).toContainText('Acid-wash Black');
 await expect(page.locator('#campusBagTotals')).toContainText('₹1,651');
 await page.locator('#campusCheckoutOpen').click();
 await expect(page.locator('#campusCheckoutSummary')).toContainText('₹1,651');
 await expect(page.locator('#campusCheckoutSummary')).toContainText('CSE 2027');
});
