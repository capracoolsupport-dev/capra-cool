import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{page.on('pageerror',error=>console.error('catalog_page_error',error.stack));});
async function panel(page,name){const root=page.getByRole('complementary',{name});const toggle=page.getByRole('button',{name:'Filters',exact:true});if(await toggle.isVisible())await toggle.click();return root;}
async function check(root,key,value){const input=root.locator(`input[data-filter-key="${key}"][data-filter-value="${value}"]`);const details=input.locator('xpath=ancestor::details');if(!await details.evaluate(d=>d.open))await details.locator('summary').click();await input.check();}
test('Brand filters combine type, size, stock, search and reset',async({page},testInfo)=>{
 await page.goto('/');const root=await panel(page,'Brand product filters');
 await check(root,'type','Polo');await expect(page.locator('.product-card')).toHaveCount(4);
 await check(root,'sizes','XXXL');await check(root,'availability','In stock');await expect(page.locator('.product-card')).toHaveCount(2);
 await page.getByRole('searchbox',{name:'Search collection products'}).fill('oxblood');await expect(page.locator('.product-card')).toHaveCount(1);
 await page.screenshot({path:`test-results/brand-filters-${testInfo.project.name}.png`,fullPage:false});
 await root.getByRole('button',{name:'Clear all',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(21);
 await page.getByRole('searchbox',{name:'Search collection products'}).fill('no-such-product');await expect(page.locator('.catalog-filter-empty')).toBeVisible();
 await page.getByRole('button',{name:'Clear all filters',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(21);
});
test('Campus filters reflect supplied stock, sizes and prices',async({page})=>{
 await page.goto('/campus');const root=await panel(page,'Campus product filters');
 await check(root,'availability','Out of stock');await expect(page.locator('.campus-product')).toHaveCount(5);
 await check(root,'sizes','XXXL');await expect(page.locator('.campus-product')).toHaveCount(5);
 await check(root,'price','2000-5000');await expect(page.locator('.campus-product')).toHaveCount(2);
 await root.getByRole('button',{name:'Clear all',exact:true}).click();await expect(page.locator('.campus-product')).toHaveCount(16);
});
test('Custom filters distinguish quote products, one-size products and sorted prices',async({page},testInfo)=>{
 await page.goto('/design-tips');const root=await panel(page,'Custom product filters');
 await check(root,'availability','Quote required');await expect(page.locator('.custom-card')).toHaveCount(6);
 await check(root,'sizes','One size');await check(root,'price','quote');await expect(page.locator('.custom-card')).toHaveCount(6);
 await page.screenshot({path:`test-results/custom-filters-${testInfo.project.name}.png`});
 await root.getByRole('button',{name:'Clear all',exact:true}).click();await expect(page.locator('.custom-card')).toHaveCount(10);
 await page.getByLabel('Sort filtered products').selectOption('price-desc');await expect(page.locator('.custom-card').first()).toContainText('1,200');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
test('Handmade availability stays unconfirmed and empty filters can be cleared',async({page})=>{
 await page.goto('/handmade');const root=await panel(page,'Handmade product filters');await expect(root.getByText('In stock',{exact:true})).toHaveCount(0);
 await check(root,'availability','Confirm availability');await check(root,'price','under-500');await expect(page.locator('.accessory-card')).toHaveCount(3);
 await page.getByRole('searchbox',{name:'Search collection products'}).fill('not-a-product');await expect(page.locator('.catalog-filter-empty')).toBeVisible();
 await page.getByRole('button',{name:'Clear all filters',exact:true}).click();await expect(page.locator('.accessory-card')).toHaveCount(4);
});
