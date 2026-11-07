import {test,expect} from '@playwright/test';
test('four sections have consistent navigation and keep custom products separate',async({page},testInfo)=>{
 const sections=[['Campus','campus.html'],['Brand','index.html'],['Handmade','handmade.html'],['Custom Products','design-tips.html']];
 let baseline;
 for(const [name,url] of sections){
  await page.goto('/'+url);
  const nav=page.getByRole('navigation',{name:'Store navigation',exact:true});
  await expect(nav.locator('a')).toHaveText(sections.map(([name])=>name));
  await expect(nav.locator('[aria-current="page"]')).toHaveText(name);
  for(const link of await nav.getByRole('link').all())await expect(link).toBeInViewport();
  const box=await page.locator('.store-header').boundingBox();if(baseline)expect(box).toEqual(baseline);else baseline=box;
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  if(name!=='Custom Products')await expect(page.locator('#customGrid,.product-customize-link')).toHaveCount(0);
 }
 await page.getByRole('button',{name:'Clothing',exact:true}).click();await expect(page.locator('.custom-card')).toHaveCount(4);
 await page.getByLabel('Custom product subcategory').selectOption('tee');await expect(page.locator('.custom-card')).toHaveCount(2);
 for(const category of ['Mugs','Caps','Bags','Bottles','Home gifts','Stationery']){await page.getByRole('button',{name:category,exact:true}).click();await expect(page.locator('.custom-card')).toHaveCount(1);}
 await page.screenshot({path:`test-results/four-sections-${testInfo.project.name}.png`});
});
test('Handmade subcategories show matching products and restore all pieces',async({page},testInfo)=>{
 await page.goto('/handmade');await expect(page.locator('.accessory-card')).toHaveCount(4);
 const filters=page.getByRole('group',{name:'Handmade subcategories'});
 await filters.getByRole('button',{name:'Winter knits',exact:true}).click();await expect(page.locator('.accessory-card')).toHaveCount(2);await expect(page.locator('#accessoriesGrid')).toContainText('Muffler');await expect(page.locator('#accessoriesGrid')).toContainText('Winter Cap');
 await filters.getByRole('button',{name:'Collectibles',exact:true}).click();await expect(page.locator('.accessory-card')).toHaveCount(1);await expect(page.locator('#accessoriesGrid')).toContainText('Krishna');
 await filters.getByRole('button',{name:'Keychains',exact:true}).click();await expect(page.locator('.accessory-card')).toHaveCount(1);await expect(page.locator('#accessoriesGrid')).toContainText('Sunflower');
 await filters.getByRole('button',{name:'All pieces',exact:true}).click();await expect(page.locator('.accessory-card')).toHaveCount(4);
 await page.locator('#handmadeCollection').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/handmade-categories-${testInfo.project.name}.png`});
});
