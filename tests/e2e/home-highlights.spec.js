import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.route('**/api/orders',route=>route.abort());
});

test('six campaigns have loaded images, useful destinations and responsive controls',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.highlight-tabs [data-highlight]')).toHaveCount(6);
  for(const [index,id] of ['summer','winter','college','gym','corporate','conference'].entries()){
    await page.locator(`[data-highlight="${index}"]`).click();
    await expect(page.locator('#home')).toHaveAttribute('data-highlight',id);
    await expect(page.locator(`[data-highlight="${index}"]`)).toHaveAttribute('aria-pressed','true');
    await expect.poll(()=>page.locator('.hero-media img').evaluate(img=>img.complete&&img.naturalWidth>0&&img.currentSrc.includes('/campaigns/'))).toBeTruthy();
    await expect(page.locator('.hero-media-caption')).toContainText('DESIGN PREVIEW');
    const link=page.locator('#highlightAction');
    if(id==='college')await expect(link).toHaveAttribute('href','campus.html#collection');
    if(['gym','corporate','conference'].includes(id)){
      await link.click();
      await expect(page.locator('#merchandiseForm select[name="occasion"]')).toHaveValue(id[0].toUpperCase()+id.slice(1));
    }
    await page.locator('#home').scrollIntoViewIfNeeded();
    if(id==='summer'||id==='conference')await page.screenshot({path:`test-results/highlight-${id}-${testInfo.project.name}.png`});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  expect(errors).toEqual([]);
});

test('seasonal actions filter actual products and normal shopping still works',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.locator('#highlightAction').click();
  await expect(page.locator('.product-card')).toHaveCount(8);
  await expect(page.locator('[data-filter="summer"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-highlight="1"]').click();
  await page.locator('#highlightAction').click();
  await expect(page.locator('.product-card')).toHaveCount(9);
  await expect(page.locator('[data-filter="winter"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-filter="all"]').click();await expect(page.locator('.product-card')).toHaveCount(21);
  await page.locator('[data-open-product="summit-tee"]').first().click();
  await page.locator('.size-chip[data-size="M"]').click();await page.locator('#productAddToBag').click();
  await expect(page.locator('#bagCount')).toHaveText('1');
  await page.goto('/?collection=winter#shop');
  await expect(page.locator('.product-card')).toHaveCount(9);
  await expect(page.locator('[data-filter="winter"]')).toHaveAttribute('aria-pressed','true');
});

test('autoplay pauses on focus, manual pause and reduced motion; arrows wrap',async({page})=>{
  await page.clock.install();await page.goto('/');
  await page.mouse.move(0,0);
  await expect(page.locator('#home')).toHaveAttribute('data-highlight','summer');
  await page.clock.fastForward(7100);await expect(page.locator('#home')).toHaveAttribute('data-highlight','winter');
  await page.locator('#highlightPause').click();
  await expect(page.locator('#highlightPause')).toHaveAttribute('aria-label','Play collection slideshow');
  await page.clock.fastForward(15000);await expect(page.locator('#home')).toHaveAttribute('data-highlight','winter');
  await page.locator('[data-highlight="0"]').focus();await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#home')).toHaveAttribute('data-highlight','conference');
  await expect(page.locator('[data-highlight="5"]')).toBeFocused();
  await page.locator('#highlightNext').click();await expect(page.locator('#home')).toHaveAttribute('data-highlight','summer');
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
  await expect(page.locator('#highlightPause')).toHaveAttribute('aria-label','Play collection slideshow');
  await page.mouse.move(0,0);await page.clock.fastForward(15000);
  await expect(page.locator('#home')).toHaveAttribute('data-highlight','summer');
});

test('merchandise enquiries are reviewed locally and stale drafts are invalidated',async({page})=>{
  let writes=0;page.on('request',r=>{if(r.method()==='POST')writes++;});
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.locator('[data-highlight="4"]').click();await page.locator('#highlightAction').click();
  const form=page.locator('#merchandiseForm');
  await form.locator('[name="organisation"]').fill('Mountain & Co <Team>');
  await form.locator('[name="quantity"]').fill('50');await form.locator('[name="pincode"]').fill('175005');
  await form.locator('[name="requirements"]').fill('Navy polos, chest logo. Need a quote for delivery in December.');
  await form.getByRole('button',{name:'Review enquiry'}).click();
  await expect(page.locator('#merchandiseDraft')).toBeVisible();
  await expect(page.locator('#merchandiseDraftText')).toContainText('Corporate merchandise enquiry');
  await expect(page.locator('#merchandiseDraftText')).toContainText('Mountain & Co <Team>');
  const href=await page.locator('#merchandiseEmail').getAttribute('href');
  expect(decodeURIComponent(href)).toContain('Quantity: 50');
  await form.locator('[name="quantity"]').fill('60');await expect(page.locator('#merchandiseDraft')).toBeHidden();
  expect(await page.locator('#merchandiseEmail').getAttribute('href')).toBe('mailto:care@capracool.com');
  expect(writes).toBe(0);
});

test('horizontal touch swipes change images without treating a vertical scroll as a swipe',async({page,isMobile})=>{
  test.skip(!isMobile,'Touch gesture check');
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  const media=page.locator('.hero-media');
  await media.scrollIntoViewIfNeeded();
  const session=await page.context().newCDPSession(page),box=await media.boundingBox();
  const x=box.x+box.width/2,y=box.y+box.height/2;
  async function swipe(from,to){
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});
    await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[to]});
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  }
  await swipe({x:x+90,y},{x:x-90,y:y+5});
  await expect(page.locator('#home')).toHaveAttribute('data-highlight','winter');
  await swipe({x,y:y+60},{x:x-10,y:y-60});
  await expect(page.locator('#home')).toHaveAttribute('data-highlight','winter');
});
