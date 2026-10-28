import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.route('**/api/orders',route=>route.fulfill({status:503,json:{error:'Unmocked test order'}}));
  await page.goto('/campus.html');
});

test('campus identity, first-screen action and approved artwork production images',async({page},testInfo)=>{
  await expect(page.getByRole('heading',{name:'IIT Mandi. On repeat.'})).toBeVisible();
  await expect(page.locator('.hero-copy .button')).toBeInViewport();
  await expect(page.locator('.campus-product')).toHaveCount(14);
  await expect.poll(()=>page.locator('.hero-rack img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBeTruthy();
  await page.screenshot({path:`test-results/campus-${testInfo.project.name}.png`});
  for(const image of await page.locator('.campus-product img, .campus-editorial img').all()){
    await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  await expect(page.locator('#campusProducts')).not.toContainText('Summit Tee');
  await expect(page.locator('.footer-main a[href="index.html"]')).toBeVisible();
  await page.locator('.campus-editorial').screenshot({path:`test-results/campus-editorial-${testInfo.project.name}.png`});
});

test('category navigation, washed edit and sorting operate on the catalog',async({page})=>{
  for(const [category,count] of [['polo',4],['hoodie',4],['zip',1],['tee',1],['track',2],['varsity',2]]){
    await page.locator(`.filter-tabs [data-category="${category}"]`).click();
    await expect(page.locator('.campus-product')).toHaveCount(count);
  }
  await page.locator('#showWashed').click();
  await expect(page.locator('.campus-product')).toHaveCount(3);
  await expect(page.locator('#campusResultCount')).toContainText('Washed edit');
  await page.locator('#clearCampusSearch').click();
  await page.locator('.filter-tabs [data-category="all"]').click();
  await page.locator('#campusSort').selectOption('name');
  await expect(page.locator('.campus-product h3').first()).toHaveText('Acid Wash Hoodie');
  await expect(page.locator('.campus-product')).toHaveCount(14);
});

test('revised gallery provides front, back and direct product links',async({page})=>{
  await page.goto('/campus.html#design/mandi-mountain-hoodie');
  await expect(page.locator('#campusProductDialog')).toBeVisible();
  await expect(page.locator('#designTitle')).toHaveText('Mountain Hoodie');
  await page.locator('#galleryControls [data-view="1"]').click();
  await expect(page.locator('#designPhoto')).toHaveAttribute('data-view','1');
  await page.locator('#galleryControls [data-view="all"]').click();
  await expect(page.locator('#designPhoto')).toHaveClass(/show-overview/);
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/#design/);
});

test('sizes, print fee, discounted totals and persistence stay accurate',async({page})=>{
  await page.locator('[data-open-design="mandi-mountain-polo"]').first().click();
  await expect(page.locator('#designSizes button')).toHaveCount(6);
  await expect(page.locator('#designPrice')).toContainText('₹600');
  await page.locator('#saveDesign').click();
  await expect(page.locator('#designOptionError')).toContainText('Choose your size');
  await page.locator('#designSizes [data-size="XXXL"]').click();
  await page.locator('#designPersonalisation').check();
  await page.locator('#saveDesign').click();
  await expect(page.locator('#designOptionError')).toContainText('name or department');
  await page.locator('#designName').fill('CSE 2027');
  await expect(page.locator('#designPrice')).toContainText('₹651');
  await page.locator('#saveDesign').click();
  await expect(page.locator('#campusBagDialog')).toBeVisible();
  await expect(page.locator('#enquiryBagItems')).toContainText('CSE 2027');
  await expect(page.locator('#campusBagTotals')).toContainText('₹750');
  await page.locator('[data-quantity="1"]').click();
  await expect(page.locator('#campusBagTotals')).toContainText('₹1,302');
  await page.reload();
  await page.locator('#campusBagOpen').click();
  await expect(page.locator('#campusBagCount')).toHaveText('2');
  await expect(page.locator('#enquiryBagItems')).toContainText('XXXL');
  await page.locator('[data-remove]').click();
  await expect(page.locator('#campusCheckoutOpen')).toBeDisabled();
});

test('search keyboard flow finds only campus designs',async({page})=>{
  await page.locator('#campusSearchOpen').click();
  await expect(page.locator('#campusSearchInput')).toBeFocused();
  await page.locator('#campusSearchInput').fill('washed');
  await expect(page.locator('.search-design')).toHaveCount(3);
  await page.locator('#campusSearchInput').press('Enter');
  await expect(page.locator('#campusSearchDialog')).not.toBeVisible();
  await expect(page.locator('.campus-product')).toHaveCount(3);
  await page.locator('#clearCampusSearch').click();
  await expect(page.locator('.campus-product')).toHaveCount(14);
  await page.locator('#campusSearchOpen').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#campusSearchOpen')).toBeFocused();
});

test('group enquiry creates a reviewable draft without sending it',async({page})=>{
  const form=page.locator('#campusBulkForm');
  await form.locator('[name="group"]').fill('IIT Mandi CSE 2027');
  await form.locator('[name="garment"]').selectOption('Hoodies');
  await form.locator('[name="quantity"]').fill('40');
  await form.locator('[name="notes"]').fill('Department print on back');
  await form.getByRole('button',{name:'Prepare your enquiry'}).click();
  await expect(page.locator('#bulkDraftReady')).toBeVisible();
  const draft=decodeURIComponent(await page.locator('#bulkEmailDraft').getAttribute('href'));
  expect(draft).toContain('IIT Mandi CSE 2027');
  expect(draft).toContain('Approx. quantity: 40');
  expect(draft).toContain('Department print on back');
});

test('campus checkout preserves print options on failure and success',async({page})=>{
  let calls=0;let payload;
  await page.route('**/api/orders',async route=>{
    calls++;payload=route.request().postDataJSON();
    await route.fulfill(calls===1 ? {status:503,json:{error:'Test service unavailable'}} : {status:200,json:{order_id:'CC-CAMPUS-TEST'}});
  });
  await page.locator('[data-open-design="mandi-mountain-polo"]').first().click();
  await page.locator('#designSizes [data-size="M"]').click();
  await page.locator('#designPersonalisation').check();
  await page.locator('#designName').fill('Arun / CSE');
  await page.locator('#saveDesign').click();
  await page.locator('#campusCheckoutOpen').click();
  await expect(page.locator('#campusCheckoutSummary')).toContainText('Arun / CSE');
  await expect(page.locator('#campusCheckoutSummary')).toContainText('₹750');
  const form=page.locator('#campusCheckoutForm');
  const fields={name:'Campus Test',phone:'9999999999',email:'campus@example.test',address:'Test only — do not dispatch',city:'Mandi',state:'Himachal Pradesh',pincode:'175001'};
  for(const [name,value] of Object.entries(fields))await form.locator(`[name="${name}"]`).fill(value);
  await form.getByRole('button',{name:/Place order/}).click();
  await expect(page.locator('#campusCheckoutError')).toContainText('Test service unavailable');
  await expect(page.locator('#campusBagCount')).toHaveText('1');
  await form.getByRole('button',{name:/Place order/}).click();
  await expect(page.locator('#campusOrderSuccess')).toBeVisible();
  await expect(page.locator('#campusOrderReference')).toHaveText('CC-CAMPUS-TEST');
  expect(payload.items[0]).toMatchObject({id:'mandi-mountain-polo',size:'M',personalisation:true,name:'Arun / CSE'});
  expect(payload.items[0]).not.toHaveProperty('unit_price');
  await expect(page.locator('#campusBagCount')).toHaveText('0');
});

test('staff order details show escaped personalisation instructions',async({page})=>{
  await page.route('**/api/admin/orders',route=>route.fulfill({status:200,json:{orders:[{order_number:'CC-TEST',customer_name:'Campus Test',grand_total:600.24,items:[{name:'IIT Mandi Mountain Polo',size:'XXXL',qty:1,print_text:'<b>CSE 2027</b>'}]}]}}));
  await page.goto('/admin.html');
  await page.locator('[name="token"]').fill('test-only-token');
  await page.getByRole('button',{name:'Load orders'}).click();
  await page.locator('.admin-order-items summary').click();
  await expect(page.locator('.admin-order-items')).toContainText('<b>CSE 2027</b>');
  await expect(page.locator('.admin-order-items b')).toHaveCount(0);
});

test('both approved artworks are available for every garment and colour',async({page},testInfo)=>{
 const ids=['mandi-mountain-polo','mandi-maroon-polo','mandi-contrast-polo','mandi-mountain-hoodie','mandi-mountain-zip','mandi-washed-tee','mandi-washed-hoodie'];
 for(const id of ids){
  await page.locator(`[data-open-design="${id}"]`).first().click();
  await expect(page.locator('#designArtworks button')).toHaveCount(2);
  for(const artwork of ['ridge','mountain']){
   await page.locator(`[data-artwork-choice="${artwork}"]`).click();
   await expect(page.locator('#designImage')).toHaveAttribute('src',new RegExp(`${id}-${artwork}\\.webp$`));
   await expect.poll(()=>page.locator('#designImage').evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy();
   if(id==='mandi-maroon-polo' && artwork==='ridge')await page.screenshot({path:`test-results/approved-artwork-${testInfo.project.name}.png`});
  }
  await page.keyboard.press('Escape');
 }
});

test('combo sizes, artwork, print fees and savings survive checkout and removal',async({page},testInfo)=>{
 await page.locator('[data-open-combo="everyday-set"]').click();
 const form=page.locator('#campusComboForm');
 await form.locator('[name="size-mandi-mountain-polo"]').selectOption('S');
 await form.locator('[name="size-mandi-mountain-hoodie"]').selectOption('XXXL');
 await form.locator('[name="artwork-mandi-mountain-hoodie"]').selectOption('ridge');
 await form.locator('[name="print-mandi-mountain-hoodie"]').check();
 await form.locator('[name="name-mandi-mountain-hoodie"]').fill('CSE 2027');
 await expect(page.locator('#comboPrice')).toContainText('₹1,751');
 await form.getByRole('button',{name:'Add both to bag'}).click();
 await expect(page.locator('#campusBagCount')).toHaveText('2');
 await expect(page.locator('#campusBagTotals .combo-saving')).toContainText('−₹100');
 await expect(page.locator('#enquiryBagItems')).toContainText('Green Ridge');
 await page.reload();await page.locator('#campusBagOpen').click();
 await page.locator('#campusCheckoutOpen').click();
 await expect(page.locator('#campusCheckoutSummary')).toContainText('Green Ridge');
 await expect(page.locator('#campusCheckoutSummary')).toContainText('₹1,751');
 await page.keyboard.press('Escape');await page.locator('#campusBagOpen').click();
 await page.locator('.enquiry-item').filter({hasText:'Mountain Hoodie'}).locator('[data-remove]').click();
 await expect(page.locator('#campusBagTotals .combo-saving')).toHaveCount(0);
 await expect(page.locator('#campusBagTotals')).toContainText('₹699');
 await page.keyboard.press('Escape');
 await page.locator('#combos').screenshot({path:`test-results/approved-combos-${testInfo.project.name}.png`});
});
