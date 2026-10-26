import {test,expect} from '@playwright/test';

for(const variant of [
 {id:'iit-mandi-tracksuit',name:'Campus Tracksuit Set',artwork:'Mountain Print',stem:'iit-mandi-tracksuit',front:'front'},
 {id:'iit-mandi-tracksuit-minimal',name:'Minimal Tracksuit Set',artwork:'Minimal Print',stem:'iit-mandi-tracksuit-minimal',front:'front-v2'}
])test(`${variant.name}: front and back, complete-set pricing and checkout`,async({page},testInfo)=>{
 await page.route('**/api/orders',route=>route.fulfill({status:503,json:{error:'Test only'}}));
 await page.goto('/campus.html#design/'+variant.id);
 await expect(page.locator('#designTitle')).toHaveText(variant.name);
 await expect(page.locator('#designPrice')).toContainText('₹2,999');
 await expect(page.locator('#designPrice s')).toHaveCount(0);
 await expect(page.locator('#designArtworks button')).toHaveCount(1);
 await expect(page.locator('#galleryControls button')).toHaveCount(2);
 for(const [view,name] of [['1','back'],['0',variant.front]]){
  await page.locator(`#galleryControls [data-view="${view}"]`).click();
  await expect(page.locator('#designImage')).toHaveAttribute('src',new RegExp(`${variant.stem}-${name}\\.webp$`));
  await expect.poll(()=>page.locator('#designImage').evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy();
  await page.screenshot({path:`test-results/${variant.id}-${name}-${testInfo.project.name}.png`});
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.locator('#designSizes [data-size="XL"]').click();
 await page.locator('#saveDesign').click();
 await expect(page.locator('#campusBagTotals')).toContainText('₹2,999');
 await page.locator('#campusCheckoutOpen').click();
 await expect(page.locator('#campusCheckoutSummary')).toContainText(variant.artwork);
 await expect(page.locator('#campusCheckoutSummary')).toContainText('₹2,999');
 await expect(page.locator('#campusCheckoutSummary')).toContainText('Free');
});
