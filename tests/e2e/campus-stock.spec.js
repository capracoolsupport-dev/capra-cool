import {test,expect} from '@playwright/test';

test('sold-out polo remains visible, with both galleries and no purchase action',async({page},testInfo)=>{
 await page.goto('/campus.html');
 const card=page.locator('[data-design-id="mandi-contrast-polo"]');
 await expect(card.locator('.stock-badge')).toHaveText('Out of stock');
 await expect(card.locator('[data-quick-save]')).toBeDisabled();
 await card.scrollIntoViewIfNeeded();
 await card.screenshot({path:`test-results/sold-out-card-${testInfo.project.name}.png`});
 await card.getByRole('button',{name:'View details'}).click();
 await expect(page.locator('#designColour')).toHaveText('Black / White');
 await expect(page.locator('#saveDesign')).toBeDisabled();
 await expect(page.locator('#saveDesign')).toHaveText('Out of stock');
 for(const size of await page.locator('#designSizes button').all())await expect(size).toBeDisabled();
 for(const artwork of ['mountain','ridge']){
  await page.locator(`[data-artwork-choice="${artwork}"]`).click();
  await page.locator('#galleryControls [data-view="1"]').click();
  await expect(page.locator('#designPhoto')).toHaveAttribute('data-view','1');
  await expect.poll(()=>page.locator('#designImage').evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy();
  await expect(page.locator('#saveDesign')).toBeDisabled();
 }
 await page.screenshot({path:`test-results/sold-out-dialog-${testInfo.project.name}.png`});
 await page.keyboard.press('Escape');
 await page.goto('/campus.html#design/mandi-maroon-polo');
 await expect(page.locator('#designSizes [data-size="M"]')).toBeEnabled();
 await page.locator('#designSizes [data-size="M"]').click();
 await expect(page.locator('#saveDesign')).toBeEnabled();
});

test('a saved sold-out item blocks checkout until removed and preserves the other item',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('capraCampusEnquiry',JSON.stringify([
  {id:'mandi-contrast-polo',size:'M',artwork:'ridge',qty:1},
  {id:'mandi-maroon-polo',size:'L',artwork:'mountain',qty:1}
 ])));
 await page.goto('/campus.html');
 await page.locator('#campusBagOpen').click();
 await expect(page.locator('#campusBagCount')).toHaveText('2');
 await expect(page.locator('#campusBagTotals')).toContainText('Remove the out-of-stock item');
 await expect(page.locator('#campusCheckoutOpen')).toBeDisabled();
 const sold=page.locator('.enquiry-item').filter({hasText:'Black / White'});
 await expect(sold).toContainText('Out of stock');
 await sold.locator('[data-remove]').click();
 await expect(page.locator('#campusBagCount')).toHaveText('1');
 await expect(page.locator('#campusCheckoutOpen')).toBeEnabled();
 await page.locator('#campusCheckoutOpen').click();
 await expect(page.locator('#campusCheckoutSummary')).toContainText('Contrast Polo');
 await expect(page.locator('#campusCheckoutSummary')).toContainText('₹699');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('capraCampusEnquiry')).map(item=>item.id))).toEqual(['mandi-maroon-polo']);
});
