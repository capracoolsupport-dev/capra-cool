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

test('campus atelier preview updates immediately', async ({ page }) => {
  await page.locator('#instituteName').fill('IIT Bombay');
  await page.locator('label:has(input[name="garment"][value="tshirt"])').click();
  await page.locator('label:has(input[name="garmentColor"][value="Maroon"])').click();
  await page.locator('#frontPlacement').selectOption('center');
  await page.locator('#backPlacement').selectOption('oversized');
  await expect(page.locator('#previewFrontInstitute')).toHaveText('IIT BOMBAY');
  await expect(page.locator('#previewBackInstitute')).toHaveText('IIT BOMBAY');
  await expect(page.locator('#mockupStudio')).toHaveAttribute('data-garment', 'tshirt');
  await expect(page.locator('#mockupStudio')).toHaveAttribute('data-placement', 'center');
  await expect(page.locator('#mockupStudio')).toHaveAttribute('data-back-placement', 'oversized');
});

test('search returns matching clothing', async ({ page }) => {
  const mobileMenu = page.locator('#menuOpen');
  const searchButton = page.locator('#searchOpen');
  if (await searchButton.isVisible()) {
    await searchButton.click();
  } else {
    await mobileMenu.click();
    await page.locator('#menuClose').click();
    await page.evaluate(() => document.querySelector('#searchOverlay').classList.add('open'));
  }
  await page.locator('#searchInput').fill('hoodie');
  await expect(page.locator('[data-search-product]')).toHaveCount(2);
});

test('mobile menu opens on compact viewports', async ({ page }, testInfo) => {
  if (!testInfo.project.name.includes('mobile')) test.skip();
  await page.locator('#menuOpen').click();
  await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
  await page.locator('#menuClose').click();
  await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
});
