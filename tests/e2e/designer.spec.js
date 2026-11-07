import {test,expect} from '@playwright/test';
import sharp from 'sharp';
import {STUDIO_RATES,estimateDesign,GARMENTS,COLOURS,SIZES,zoneFor} from '../../designer/catalog.js';
const assetId='11111111-1111-4111-8111-111111111111',previewId='22222222-2222-4222-8222-222222222222',designId='33333333-3333-4333-8333-333333333333';
test.beforeEach(async({page})=>{
  await page.route('**/api/designer?*',async route=>{
    const action=new URL(route.request().url()).searchParams.get('action');
    if(action==='catalog')return route.fulfill({json:{rates:STUDIO_RATES,storageReady:true,garments:GARMENTS,colours:COLOURS,sizes:SIZES}});
    return route.fulfill({status:503,json:{error:'Test storage unavailable'}});
  });
  await page.goto('/design.html');
  await expect(page.getByRole('heading',{name:'Make it yours.'})).toBeVisible();
});
test('real canvas upload, transforms, colour, views, history and local draft recovery',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const png=await sharp({create:{width:120,height:80,channels:4,background:'#dd4433'}}).png().toBuffer();
  await page.locator('input[aria-label="Upload artwork file"]').setInputFiles({name:'red-logo.png',mimeType:'image/png',buffer:png});
  await expect(page.locator('.studio-layers>button')).toHaveCount(1);
  if(testInfo.project.name==='desktop-chromium'){
    const surface=page.locator('.upper-canvas');await surface.scrollIntoViewIfNeeded();
    await expect.poll(()=>page.locator('.lower-canvas').evaluate(c=>{const pixel=c.getContext('2d').getImageData(c.width/2,c.height*300/800,1,1).data;return pixel[0]>pixel[1]*1.5;})).toBeTruthy();
    const box=await surface.boundingBox(),x=box.x+box.width*.5,y=box.y+box.height*300/800;
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+25,y+15,{steps:8});await page.mouse.up();
    await expect(page.getByRole('status')).toContainText('Draft saved');
    const position=await page.evaluate(()=>new Promise(resolve=>{const request=indexedDB.open('capra-design-studio');request.onsuccess=()=>{const db=request.result;const read=db.transaction('drafts').objectStore('drafts').get('active');read.onsuccess=()=>{db.close();resolve(read.result.document.elements[0]);};};}));
    expect(position.x).toBeGreaterThan(310);expect(position.y).toBeGreaterThan(305);
  }
  await page.getByLabel('Design rotation',{exact:true}).fill('30');
  await page.getByLabel('Design width',{exact:true}).fill('80');
  await page.getByRole('button',{name:'Move right',exact:true}).click();
  await page.getByRole('button',{name:'Beige',exact:true}).click();
  await expect(page.locator('.studio-preview-caption')).toContainText('Beige');
  await page.getByRole('button',{name:'Duplicate',exact:true}).click();
  await expect(page.locator('.studio-layers>button')).toHaveCount(2);
  await page.getByRole('button',{name:'Undo',exact:true}).click();
  await expect(page.locator('.studio-layers>button')).toHaveCount(1);
  await page.getByRole('button',{name:'Redo',exact:true}).click();
  await expect(page.locator('.studio-layers>button')).toHaveCount(2);
  await page.getByRole('button',{name:'Back',exact:true}).click();
  await page.getByRole('button',{name:/Add custom text/}).click();
  await page.getByRole('textbox',{name:'Your text',exact:true}).fill('HIMALAYAN DAYS');
  await page.getByRole('combobox',{name:'Font',exact:true}).selectOption('serif');
  await page.getByRole('button',{name:'Upper back',exact:false}).click();
  await expect(page.locator('.studio-estimate')).toContainText('₹800');
  await expect(page.getByRole('status')).toContainText('Draft saved');
  await page.reload();
  await expect(page.locator('.studio-layers>button')).toHaveCount(3);
  await expect(page.locator('.studio-layers')).toContainText('HIMALAYAN DAYS');
  await page.getByLabel('Choose your product').selectOption('oversized-hoodie');
  await expect(page.locator('.studio-estimate')).toContainText('₹1,400');
  await page.getByRole('button',{name:'Review your design'}).click();
  await expect(page.locator('.studio-review')).toBeVisible();
  await expect.poll(()=>page.locator('.studio-review img').evaluate(img=>img.complete&&img.naturalWidth===1200&&img.naturalHeight===1680)).toBeTruthy();
  await page.locator('.studio-review').screenshot({path:`test-results/designer-review-${testInfo.project.name}.png`});
  await page.getByRole('button',{name:'Close design review'}).click();
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await page.getByRole('button',{name:'Reset design',exact:true}).click();
  await expect(page.locator('.studio-layers>button')).toHaveCount(0);
  await page.getByRole('button',{name:'Undo',exact:true}).click();
  await expect(page.locator('.studio-layers>button')).toHaveCount(3);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  await page.screenshot({path:`test-results/designer-${testInfo.project.name}.png`,fullPage:true});
  expect(errors).toEqual([]);
});
test('custom design is saved, mixed bag preserved and checkout sends saved reference',async({page})=>{
  let saved,order;
  await page.route('**/api/designer?*',async route=>{
    const action=new URL(route.request().url()).searchParams.get('action');
    if(action==='catalog')return route.fulfill({json:{rates:STUDIO_RATES,storageReady:true}});
    if(action==='upload')return route.fulfill({status:201,json:{id:previewId}});
    if(action==='save'){saved=route.request().postDataJSON();return route.fulfill({status:201,json:{id:designId,document:saved.document,previewId,quote:estimateDesign(saved.document,STUDIO_RATES)}});}
    if(action==='design')return route.fulfill({json:{id:designId,document:saved.document,previewId,quote:estimateDesign(saved.document,STUDIO_RATES)}});
    if(action==='asset')return route.fulfill({status:200,contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')});
  });
  await page.evaluate(()=>localStorage.setItem('capraCoolCart',JSON.stringify([{id:'summit-tee',size:'M',qty:1}])));
  await page.getByRole('button',{name:/Add custom text/}).click();
  await page.getByRole('textbox',{name:'Your text',exact:true}).fill('MY HILLS');
  await page.getByRole('button',{name:'Review your design'}).click();
  await page.getByRole('button',{name:'Add Custom Design to Cart'}).click();
  await expect(page).toHaveURL(/index\.html\?bag=1/);
  await expect(page.locator('#cartItems')).toContainText('Custom T-Shirt');
  await expect(page.locator('#cartItems')).toContainText('Summit Tee');
  await expect(page.locator('#checkoutOpen')).toBeEnabled();
  await page.reload();await page.locator('#checkoutOpen').click();
  await expect(page.locator('#checkoutPreview')).toContainText('Custom T-Shirt');
  await page.route('**/api/orders',async route=>{order=route.request().postDataJSON();return route.fulfill({json:{order_id:'CC-CUSTOM-TEST',items:[{design_id:designId,name:'Custom T-Shirt',size:'M',colour:'Black'}]}});});
  const fields={name:'Custom Test',phone:'9999999999',email:'test@example.test',address:'No real dispatch',city:'Mandi',state:'HP',pincode:'175001'};
  for(const [name,value]of Object.entries(fields))await page.locator(`#checkoutForm [name="${name}"]`).fill(value);
  await page.locator('#checkoutForm button[type=submit]').click();
  await expect(page.locator('#customOrderSummary')).toContainText(designId);
  expect(order.items.find(i=>i.designId)).toEqual({id:`custom:${designId}`,designId,size:'M',qty:1});
  expect(saved.document.elements[0].text).toBe('MY HILLS');
  expect(saved.previewId).toBe(previewId);
});
test('unsupported uploads and cloud failures leave editable drafts',async({page})=>{
  await page.locator('input[aria-label="Upload artwork file"]').setInputFiles({name:'unsafe.html',mimeType:'text/html',buffer:Buffer.from('<script>alert(1)</script>')});
  await expect(page.getByRole('alert').first()).toContainText('PNG');
  await page.getByRole('button',{name:/Add custom text/}).click();
  await page.getByRole('button',{name:'Review your design'}).click();
  await page.getByRole('button',{name:'Add Custom Design to Cart'}).click();
  await expect(page.locator('.studio-review [role=alert]')).toContainText('Test storage unavailable');
  await expect(page.getByRole('button',{name:'Add Custom Design to Cart'})).toBeEnabled();
  await page.getByRole('button',{name:'Close design review'}).click();
  await expect(page.locator('.studio-layers>button')).toHaveCount(1);
});

test('SVG, JPEG and WEBP artwork works on all four priced areas',async({page},testInfo)=>{
  const upload=page.locator('input[aria-label="Upload artwork file"]');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path fill="#11aa88" d="M10 90 50 10 90 90Z"/></svg>';
  await upload.setInputFiles({name:'hill.svg',mimeType:'image/svg+xml',buffer:Buffer.from(svg)});
  await page.locator('.studio-placements').getByRole('button',{name:/Left chest/}).click();
  await page.getByRole('button',{name:'Left sleeve',exact:true}).click();
  await page.getByRole('button',{name:/Add custom text/}).click();
  await page.getByRole('textbox',{name:'Your text',exact:true}).fill('');
  await page.getByRole('textbox',{name:'Your text',exact:true}).fill('CC');
  await page.getByRole('button',{name:'Right sleeve',exact:true}).click();
  const jpeg=await sharp({create:{width:120,height:90,channels:3,background:'#44aa88'}}).jpeg().toBuffer();
  await upload.setInputFiles({name:'logo.jpg',mimeType:'image/jpeg',buffer:jpeg});
  await page.getByRole('button',{name:'Back',exact:true}).click();
  const webp=await sharp({create:{width:120,height:90,channels:4,background:'#aa4488'}}).webp().toBuffer();
  await upload.setInputFiles({name:'logo.webp',mimeType:'image/webp',buffer:webp});
  await page.getByRole('combobox',{name:'Decoration method'}).selectOption('embroidery');
  await page.getByRole('button',{name:'XS',exact:true}).click();
  await page.getByRole('button',{name:'Navy Blue',exact:true}).click();
  await expect(page.locator('.studio-estimate')).toContainText('₹1,000');
  await page.getByRole('button',{name:'Review your design'}).click();
  await expect(page.locator('.studio-review')).toContainText('Left sleeve, Right sleeve');
  await expect(page.locator('.studio-review')).toContainText('Embroidery');
  await page.locator('.studio-review').screenshot({path:`test-results/designer-all-areas-${testInfo.project.name}.png`});
});

test('each garment shows distinct left/right side angles with a larger editable sleeve surface',async({page},testInfo)=>{
  for(const garment of GARMENTS.filter(p=>!p.photo)){
    await page.getByLabel('Choose your product').selectOption(garment.id);
    const images=[];
    for(const face of ['leftSleeve','rightSleeve']){
      await page.getByRole('button',{name:face==='leftSleeve'?'Left sleeve':'Right sleeve',exact:true}).click();
      await expect(page.locator('.studio-board-container')).toHaveAttribute('data-view',face);
      await expect(page.locator('.studio-board-container')).toHaveAttribute('data-angle','side');
      await expect(page.locator('.studio-preview-caption')).toContainText('SIDE ANGLE');
      images.push(await page.locator('.lower-canvas').evaluate(canvas=>canvas.toDataURL()));
      if(garment.id==='tshirt'){
        await page.getByRole('button',{name:/Add custom text/}).click();
        await page.getByRole('textbox',{name:'Your text',exact:true}).fill(face==='leftSleeve'?'LEFT':'RIGHT');
        const max=await page.getByLabel('Design width',{exact:true}).getAttribute('max');
        expect(Number(max)).toBe(zoneFor(garment.id,face).w);expect(Number(max)).toBeGreaterThan(45);
        await page.getByRole('button',{name:'Move down',exact:true}).click();
      }
      await page.locator('.studio-preview').screenshot({path:`test-results/designer-${garment.id}-${face}-${testInfo.project.name}.png`});
    }
    expect(images[0]).not.toEqual(images[1]);
  }
  await page.getByRole('button',{name:'Front',exact:true}).click();
  await expect(page.locator('.studio-board-container')).toHaveAttribute('data-angle','straight');
  await page.getByRole('button',{name:'Review your design'}).click();
  const preview=page.locator('.studio-review img');
  await expect.poll(()=>preview.evaluate(img=>img.complete&&img.naturalHeight===1680)).toBeTruthy();
  expect(await preview.getAttribute('src')).toMatch(/^data:image\/webp;base64,/);
  expect((await preview.getAttribute('src')).length*3/4).toBeLessThan(2097152);
});
