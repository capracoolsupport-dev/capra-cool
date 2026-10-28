import {test,expect} from '@playwright/test';

test('cream hoodie has three distinct photos, the approved ridge artwork and sold-out controls',async({page},testInfo)=>{
 await page.goto('/campus.html');
 const card=page.locator('[data-design-id="mandi-cream-hoodie"]');
 await expect(card).toContainText('Cream / Ivory');
 await expect(card.locator('.stock-badge')).toHaveText('Out of stock');
 await card.getByRole('button',{name:'View details'}).click();
 await expect(page.locator('#designTitle')).toHaveText('Ridge Hoodie');
 await expect(page.locator('#designPrice')).toContainText('₹1,200');
 await expect(page.locator('#designPrice')).not.toContainText('Jacket + trousers');
 await expect(page.locator('#designArtworks button')).toHaveCount(1);
 await expect(page.locator('#designArtworks button')).toHaveText('Green Ridge');
 await expect(page.locator('#designArtworks button')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#galleryControls button')).toHaveCount(3);
 for(const [index,view] of ['front','back','detail'].entries()){
  await page.locator(`#galleryControls [data-view="${index}"]`).click();
  await expect(page.locator('#designImage')).toHaveAttribute('src',new RegExp(`cream-hoodie-${view}\\.webp$`));
  await expect.poll(()=>page.locator('#designImage').evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy();
  await expect(page.locator('#saveDesign')).toBeDisabled();
  await page.screenshot({path:`test-results/cream-hoodie-${view}-${testInfo.project.name}.png`});
 }
 await expect(page.locator('#designPrice .stock-status')).toHaveText('Out of stock in all sizes.');
 for(const button of await page.locator('#designSizes button').all())await expect(button).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
