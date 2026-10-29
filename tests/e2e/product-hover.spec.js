import {test,expect} from '@playwright/test';

test('every campus card shows its back on hover and restores the front on leave',async({page},testInfo)=>{
 await page.goto('/campus.html');
 test.skip(!await page.evaluate(()=>matchMedia('(hover:hover) and (pointer:fine)').matches),'Hover preview applies to mouse pointers.');
 const cards=page.locator('.campus-product');
 await expect(cards).toHaveCount(14);
 for(const card of await cards.all()){
  // Hover the name too: the interaction covers the complete product card.
  await card.locator('h3').hover();
  const photo=card.locator('.campus-photo');
  const back=photo.locator('.campus-back-preview');
  if(await back.count()){
   await expect(back).toHaveAttribute('src',/-back\.webp$/);
   await expect.poll(()=>back.evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
   await expect(back).toHaveCSS('opacity','1');
  }else{
   expect(await photo.evaluate(el=>Math.abs(parseFloat(getComputedStyle(el.firstElementChild).left)+el.clientWidth)<1)).toBeTruthy();
  }
  await page.mouse.move(0,0);
  if(await back.count()) await expect(back).toHaveCSS('opacity','0');
  else await expect(photo.locator('img')).toHaveCSS('left','0px');
 }
 const acid=page.locator('[data-design-id="mandi-acid-black-hoodie"]');
 await acid.locator('h3').hover();
 await acid.screenshot({path:`test-results/product-back-hover-${testInfo.project.name}.png`});
 // Hover must not change the view opened by a click.
 await acid.locator('.product-image-link').click();
 await expect(page.locator('#designImage')).toHaveAttribute('src',/mandi-acid-black-hoodie-front\.webp$/);
});

test('hover back image falls back to the back source rather than the front',async({page})=>{
 await page.route('**/optimized/campus-acid-black/mandi-acid-black-hoodie-back.webp',route=>route.abort());
 await page.goto('/campus.html');
 const back=page.locator('[data-design-id="mandi-acid-black-hoodie"] .campus-back-preview');
 await back.scrollIntoViewIfNeeded();
 await expect(back).toHaveAttribute('src',/mandi-acid-black-hoodie-back.*\.png$/);
 await expect.poll(()=>back.evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
});

test('every Brand product shows its matching back image on card hover',async({page},testInfo)=>{
 await page.goto('/');
 test.skip(!await page.evaluate(()=>matchMedia('(hover:hover) and (pointer:fine)').matches),'Hover preview applies to mouse pointers.');
 await expect(page.locator('.product-card')).toHaveCount(21);
 for(const card of await page.locator('.product-card').all()){
  const back=card.locator('.product-back-image');
  await card.locator('h3').hover();
  await expect.poll(()=>back.evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  await expect(back).toHaveCSS('opacity','1');
  await page.mouse.move(0,0);
  await expect(back).toHaveCSS('opacity','0');
 }
 const alpine=page.locator('[data-product-id="alpine-hoodie"]');
 await alpine.hover();
 await expect(alpine.locator('.product-back-image')).toHaveAttribute('src',/product_alpine_hoodie\.webp$/);
 await alpine.screenshot({path:`test-results/brand-back-hover-${testInfo.project.name}.png`});
 await page.locator('[data-filter="hoodie"]').click();
 await expect(page.locator('.product-back-image')).toHaveCount(6);
});

test('Brand cards retain their front on touch and product click opens the front',async({page})=>{
 await page.goto('/');
 const card=page.locator('[data-product-id="alpine-hoodie"]');
 await card.scrollIntoViewIfNeeded();
 await expect(card.locator('.product-back-image')).toHaveCSS('opacity','0');
 await card.locator('.product-image-button').click();
 await expect(page.locator('#productModal')).toHaveAttribute('aria-hidden','false');
 await expect(page.locator('#productModalImage')).toHaveAttribute('src',/brand-hover\/alpine-hoodie-front\.webp$/);
 await expect.poll(()=>page.locator('#productModalImage').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
});

test('Brand back preview preserves the correct view if its optimized image fails',async({page})=>{
 await page.route('**/optimized/brand-hover/summit-tee-back.webp',route=>route.abort());
 await page.goto('/');
 const back=page.locator('[data-product-id="summit-tee"] .product-back-image');
 await back.scrollIntoViewIfNeeded();
 await expect(back).toHaveAttribute('src',/summit-tee-back.*\.png$/);
 await expect.poll(()=>back.evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
});
