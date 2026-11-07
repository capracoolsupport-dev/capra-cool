import {test,expect} from '@playwright/test';
import {STUDIO_RATES} from '../../designer/catalog.js';
test.beforeEach(async({page})=>{await page.route('**/api/designer?*',route=>route.fulfill({json:{storageReady:false,rates:STUDIO_RATES}}));});
test('custom product range filters, searches and opens the chosen product',async({page},testInfo)=>{
 await page.goto('/design-tips');await expect(page.locator('.custom-card')).toHaveCount(43);
 await page.getByRole('button',{name:'Mugs',exact:true}).click();await expect(page.locator('.custom-card')).toHaveCount(1);
 await page.screenshot({path:`test-results/custom-products-${testInfo.project.name}.png`,fullPage:true});
 await page.getByRole('searchbox').fill('mug');await expect(page.locator('.custom-card')).toHaveCount(1);
 await page.locator('.custom-card .text-link').click();await expect(page.getByLabel('Choose your product')).toHaveValue('ceramic-mug');
 await expect(page.getByRole('button',{name:'Left sleeve',exact:true})).toHaveCount(0);
 await expect(page.getByLabel('Decoration method').locator('option')).toHaveCount(1);
 await expect(page.locator('.studio-estimate')).toContainText('Request a quote');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
test('gift design can be previewed, downloaded and quoted without payment or cloud storage',async({page},testInfo)=>{
 await page.goto('/design?product=ceramic-mug');await page.getByRole('button',{name:/Add custom text/}).click();
 await page.getByRole('textbox',{name:'Your text',exact:true}).fill('MOUNTAIN MORNINGS');
 await page.getByRole('button',{name:'Request a quote',exact:true}).click();await expect(page.locator('.studio-review')).toBeVisible();
 await expect(page.getByRole('button',{name:'Add Custom Design to Cart'})).toHaveCount(0);
 await page.getByLabel('Quote quantity').fill('24');await page.getByLabel('Quote notes').fill('College event');
 await expect(page.getByRole('link',{name:/Prepare quote email/})).toHaveAttribute('href',/mailto:care@capracool.com.*24.*College%20event/);
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download preview',exact:true}).click();expect((await download).suggestedFilename()).toContain('preview');
 await page.locator('.studio-review').screenshot({path:`test-results/custom-gift-${testInfo.project.name}.png`});
 await page.getByRole('button',{name:'Close design review'}).click();await page.reload();
 await expect(page.locator('.studio-layers>button')).toHaveCount(1);
});
test('every new preview family renders and disallows incompatible options',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['cap','tote-bag','water-bottle','cushion','notebook','capra-ridge-polo','capra-zip-hoodie','capra-varsity-black','capra-ridge-tracksuit','mandi-mountain-polo']){
  await page.goto('/design?product='+id);await expect(page.getByLabel('Choose your product')).toHaveValue(id);
  await page.getByRole('button',{name:/Add custom text/}).click();
  await expect(page.locator('.studio-board-container')).toHaveAttribute('data-view','front');
  await expect(page.getByRole('alert')).toHaveCount(0);
  if(id==='cap')await expect(page.getByRole('button',{name:'Back',exact:true})).toHaveCount(0);
 }
 expect(errors).toEqual([]);await page.screenshot({path:`test-results/custom-catalog-${testInfo.project.name}.png`,fullPage:true});
});
test('custom section opens the selected garment with the correct price',async({page})=>{
 await page.goto('/design-tips');await page.getByRole('searchbox').fill('Brand Ridge Polo');await page.locator('.custom-card .text-link').first().click();
 await expect(page.getByLabel('Choose your product')).toHaveValue('capra-ridge-polo');
 await expect(page.locator('.studio-estimate')).toContainText('₹600');
 await page.getByRole('button',{name:/Add custom text/}).click();await expect(page.locator('.studio-estimate')).toContainText('₹700');
 await page.getByRole('button',{name:'Review your design',exact:true}).click();
 await expect(page.getByRole('link',{name:/Prepare quote email/})).toBeVisible();
 await expect(page.getByRole('button',{name:'Add Custom Design to Cart'})).toHaveCount(0);
});
