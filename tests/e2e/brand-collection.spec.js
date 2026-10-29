import {test,expect} from '@playwright/test';
import {BRAND_ADAPTED_PRODUCTS} from '../../brand-catalog.js';

test.beforeEach(async({page})=>{
 await page.route('**/api/orders',route=>route.fulfill({status:503,json:{error:'Test only: no real order'}}));
 await page.goto('/');
});

test('Brand contains all garment types while Campus remains separate',async({page},testInfo)=>{
 await expect(page.locator('.product-card')).toHaveCount(21);
 await expect(page.locator('.product-card[data-paired="true"]')).toHaveCount(14);
 await expect(page.locator('.brand-stock-badge')).toHaveCount(5);
 await expect(page.locator('#productsGrid')).not.toContainText('IIT');
 for(const [category,count] of [['polo',4],['tee',4],['hoodie',6],['zip',1],['varsity',2],['track',4]]){
  await page.locator(`[data-filter="${category}"]`).click();
  await expect(page.locator('.product-card')).toHaveCount(count);
 }
 await page.locator('[data-filter="all"]').click();
 for(const image of await page.locator('.product-card[data-paired="true"] picture img').all()){
  await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.mouse.move(0,0);
 await page.evaluate(()=>{const section=document.querySelector('#shop');const header=document.querySelector('.store-header');window.scrollTo({top:section.getBoundingClientRect().top+scrollY-header.getBoundingClientRect().height-20,behavior:'instant'});});
 await page.screenshot({path:`test-results/brand-expanded-${testInfo.project.name}.png`});
 await page.goto('/campus');
 await expect(page.locator('.campus-product')).toHaveCount(14);
 await expect(page.locator('#campusProducts')).not.toContainText('Ridge Polo');
});

test('every new Brand style exposes its front and back with correct stock controls',async({page},testInfo)=>{
 for(const product of BRAND_ADAPTED_PRODUCTS){
  await page.locator(`[data-open-product="${product.id}"]`).first().click();
  await expect(page.locator('#productModalTitle')).toHaveText(product.name);
  await expect(page.locator('#productModalPrice')).toContainText(product.price.toLocaleString('en-IN'));
  await expect(page.locator('#productModalSizes button')).toHaveCount(6);
  for(const view of ['1','0']){
   await page.locator(`[data-brand-view="${view}"]`).click();
   await expect(page.locator('#brandGalleryImageFrame')).toHaveAttribute('data-view',view);
   await expect(page.locator('#brandGalleryImageFrame')).toHaveAttribute('data-paired','true');
   await expect.poll(()=>page.locator('#productModalImage').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  }
  if(!product.inStock){
   await expect(page.locator('#productAddToBag')).toBeDisabled();
   await expect(page.locator('#productModalSizes button:disabled')).toHaveCount(6);
   await expect(page.locator('#productAvailability')).toHaveText('Out of stock');
  }else await expect(page.locator('#productAddToBag')).toBeEnabled();
  if(product.id==='capra-washed-tee'){
   await page.locator('[data-brand-view="1"]').click();
   await page.screenshot({path:`test-results/brand-hill-tee-back-${testInfo.project.name}.png`});
  }
  await page.locator('#productModal .modal-close').click();
 }
});

test('Brand XXXL purchase uses the order API without client prices and preserves bag on failure',async({page})=>{
 let payload,calls=0;
 await page.route('**/api/orders',async route=>{
  payload=route.request().postDataJSON();calls++;
  await route.fulfill(calls===1?{status:503,json:{error:'Test service unavailable'}}:{status:200,json:{order_id:'CC-BRAND-EXPANSION'}});
 });
 await page.locator('[data-open-product="capra-ridge-polo"]').first().click();
 await page.locator('#productModalSizes [data-size="XXXL"]').click();
 await page.locator('#productAddToBag').click();
 await expect(page.locator('#cartTotal')).toHaveText('₹699');
 await page.locator('#checkoutOpen').click();
 const form=page.locator('#checkoutForm');
 for(const [name,value] of Object.entries({name:'Brand Test',phone:'9999999999',email:'brand@example.test',address:'Test only, do not dispatch',city:'Mandi',state:'Himachal Pradesh',pincode:'175001'}))await form.locator(`[name="${name}"]`).fill(value);
 await form.getByRole('button',{name:'Place order',exact:true}).click();
 await expect(page.locator('#toastRegion')).toContainText('Test service unavailable');
 await expect(page.locator('#bagCount')).toHaveText('1');
 await form.getByRole('button',{name:'Place order',exact:true}).click();
 await expect(page.locator('#successOrderId')).toHaveText('CC-BRAND-EXPANSION');
 expect(payload.items).toEqual([{id:'capra-ridge-polo',size:'XXXL',qty:1}]);
 expect(payload).not.toHaveProperty('grand_total');
 await expect(page.locator('#bagCount')).toHaveText('0');
});

test('saved unavailable Brand products block checkout until removed',async({page})=>{
 await page.evaluate(()=>localStorage.setItem('capraCoolCart',JSON.stringify([{id:'capra-varsity-black',size:'L',qty:1},{id:'summit-tee',size:'M',qty:1}])));
 await page.reload();
 await page.locator('#cartOpen').click();
 await expect(page.locator('.cart-stock-note')).toContainText('Out of stock');
 await expect(page.locator('#checkoutOpen')).toBeDisabled();
 await page.locator('.cart-item').filter({hasText:'Varsity Jacket'}).locator('[data-remove]').click();
 await expect(page.locator('#checkoutOpen')).toBeEnabled();
});
