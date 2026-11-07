import {test,expect} from '@playwright/test';
for(const suffix of ['navy-bomber','coffee-sweatshirt'])test(`${suffix}: both Campus artworks, six sizes and correct bag price`,async({page},info)=>{
 await page.route('**/api/orders',route=>route.abort());
 await page.goto(`/campus.html#design/mandi-${suffix}`);
 await expect(page.locator('#campusProductDialog')).toBeVisible();
 await expect(page.locator('#designPrice')).toContainText('1,500');
 await expect(page.locator('#designSizes button')).toHaveCount(6);
 for(const art of ['mountain','ridge']){
  await page.locator(`[data-artwork-choice="${art}"]`).click();
  await expect(page.locator('#designImage')).toHaveAttribute('src',new RegExp(`${suffix}-${art}`));
  await expect.poll(()=>page.locator('#designImage').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  await page.locator('#galleryControls [data-view="1"]').click();
  await expect(page.locator('#designPhoto')).toHaveAttribute('data-view','1');
 }
 await page.screenshot({path:`test-results/${suffix}-${info.project.name}.png`});
 await page.locator('#designSizes [data-size="XXXL"]').click();
 await page.locator('#saveDesign').click();
 await expect(page.locator('#enquiryBagItems')).toContainText('Green Ridge');
 await expect(page.locator('#campusBagTotals')).toContainText('1,500');
});
