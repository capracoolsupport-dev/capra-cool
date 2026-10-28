import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  page.__capraErrors = errors;
});

test.afterEach(async ({ page }) => {
  expect(page.__capraErrors || []).toEqual([]);
});

test('all main sections are visible and there is no horizontal overflow', async ({ page }) => {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    hidden: [...document.querySelectorAll('main section')]
      .filter(section => {
        const style = getComputedStyle(section);
        return style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || section.getBoundingClientRect().height < 10;
      })
      .map(section => section.id || section.className)
  }));
  expect(result.overflow).toBeFalsy();
  expect(result.hidden).toEqual([]);
});

test('product details, size selection and cart work', async ({ page }) => {
  await page.locator('[data-open-product]').first().click();
  await expect(page.locator('#productModal')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('.size-chip[data-size="M"]').click();
  await page.locator('#productAddToBag').click();
  await expect(page.locator('#bagCount')).toHaveText('1');
  await expect(page.locator('#cartDrawer')).toHaveClass(/open/);
});

test('campus shopping has a separate destination from the brand', async ({ page }) => {
  await expect(page.locator('#atelier')).toHaveCount(0);
  await page.locator('.hero-secondary').click();
  await expect(page).toHaveURL(/campus(?:\.html)?$/);
  await expect(page.locator('.campus-products .campus-product')).toHaveCount(13);
});

test('search returns matching clothing', async ({ page }) => {
  const searchButton = page.locator('#searchOpen');
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  await page.locator('#searchInput').fill('hoodie');
  await expect(page.locator('[data-search-product]')).toHaveCount(2);
});

test('all three stores share a stable header and handmade search works', async ({ page }, testInfo) => {
  let baseline;
  for (const [section,url] of [['Brand','index.html'],['Campus','campus.html'],['Handmade','handmade.html']]) {
    await page.goto('/'+url);
    await expect(page.locator('.store-switch a')).toHaveCount(3);
    await expect(page.locator('.store-switch [aria-current="page"]')).toHaveText(section);
    for(const link of await page.locator('.store-switch a').all()) await expect(link).toBeInViewport();
    const box=await page.locator('.store-header').boundingBox();
    if(baseline) expect(box).toEqual(baseline); else baseline=box;
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.screenshot({path:'test-results/'+section.toLowerCase()+'-consistent-'+testInfo.project.name+'.png'});
  }
  await page.locator('#searchOpen').click();
  await page.locator('#searchInput').fill('muffler');
  await expect(page.locator('#searchResults .search-result')).toHaveCount(1);
  await expect(page.locator('#searchResults')).toContainText('Handmade Muffler');
});
