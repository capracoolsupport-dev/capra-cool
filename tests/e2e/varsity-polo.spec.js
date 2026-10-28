import {test,expect} from '@playwright/test';

for(const variant of [
 {id:'mandi-varsity-black',name:'Varsity Jacket',colour:'Black / White',price:'₹2,999'},
 {id:'mandi-varsity-brown',name:'Varsity Jacket',colour:'Brown / Cream',price:'₹2,999'},
 {id:'mandi-grey-polo',name:'Mountain Polo',colour:'Heather Grey',price:'₹600'}
])test(`${variant.id}: three approved views, correct price and sold-out controls`,async({page},testInfo)=>{
 await page.goto('/campus.html');
 const card=page.locator(`[data-design-id="${variant.id}"]`);
 await expect(card).toContainText(variant.colour);
 await expect(card.locator('.stock-badge')).toHaveText('Out of stock');
 if(variant.id.includes('varsity')){
  await expect(card.locator('.card-prices s')).toHaveCount(0);
  await expect(card.locator('.launch-label')).toHaveCount(0);
 }
 await card.getByRole('button',{name:'View details'}).click();
 await expect(page.locator('#designTitle')).toHaveText(variant.name);
 await expect(page.locator('#designColour')).toHaveText(variant.colour);
 await expect(page.locator('#designPrice')).toContainText(variant.price);
 await expect(page.locator('#designArtworks button')).toHaveCount(1);
 await expect(page.locator('#galleryControls button')).toHaveCount(3);
 for(const [index,view] of ['front','back','detail'].entries()){
  await page.locator(`#galleryControls [data-view="${index}"]`).click();
  await expect(page.locator('#designImage')).toHaveAttribute('src',new RegExp(`${variant.id}-${view}\\.webp$`));
  await expect.poll(()=>page.locator('#designImage').evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy();
  await expect(page.locator('#saveDesign')).toBeDisabled();
  await page.screenshot({path:`test-results/${variant.id}-${view}-${testInfo.project.name}.png`});
 }
 for(const button of await page.locator('#designSizes button').all())await expect(button).toBeDisabled();
 await expect(page.locator('#designPrice .stock-status')).toHaveText('Out of stock in all sizes.');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
