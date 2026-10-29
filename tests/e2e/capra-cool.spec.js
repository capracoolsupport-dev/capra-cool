import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // All writes are isolated. A test must never create a real customer order.
  await page.route('**/rest/v1/**', route => route.fulfill({ status: 500, json: { error: 'Unmocked test request' } }));
  await page.goto('/');
});

test('shopping action and search are visible in the first viewport', async ({ page }, testInfo) => {
  await expect(page.getByRole('heading', { name: 'Wear higher.' })).toBeVisible();
  await expect(page.locator('#searchOpen')).toBeInViewport();
  await expect(page.locator('.hero-actions .button')).toBeInViewport();
  await expect.poll(() => page.locator('.hero-media img').evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await page.screenshot({path: `test-results/redesign-${testInfo.project.name}.png`});
});

test('production catalog and handmade images all load', async ({ page }, testInfo) => {
  for (const image of await page.locator('.product-image-wrap img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  }
  await page.goto('/handmade.html');
  await expect(page.locator('.accessory-card')).toHaveCount(4);
  await expect.poll(()=>page.locator('.handmade-hero-image img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  for (const image of await page.locator('.accessory-image img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  }
  await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
  expect(await page.locator('.accessory-card').evaluateAll(cards=>cards.every(card=>card.scrollWidth<=card.clientWidth+1 && card.scrollLeft===0))).toBeTruthy();
  await expect(page.locator('.handmade-hero h1')).toBeInViewport();
  await page.screenshot({path:`test-results/handmade-full-${testInfo.project.name}.png`,fullPage:true});
  await page.goto('/');
  await page.locator('[data-open-product="capra-cool-tee"]').first().click();
  await expect.poll(() => page.locator('#productModalImage').evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
});

test('filters and sort update the actual catalog without unsupported ratings', async ({ page }) => {
  await page.locator('[data-filter="tee"]').click();
  await expect(page.locator('.product-card')).toHaveCount(4);
  await expect(page.locator('[data-filter="tee"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-filter="hoodie"]').click();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await expect(page.locator('[data-product-id="alpine-hoodie"]')).toContainText('Black');
  await expect(page.locator('[data-product-id="horizon-hoodie"]')).toContainText('Olive');
  await page.locator('[data-filter="all"]').click();
  await page.locator('#sortSelect').selectOption('price-desc');
  await expect(page.locator('.product-price').first()).toHaveText('₹2,999');
  await expect(page.locator('.product-badge')).toHaveCount(0);
  await expect(page.locator('#sortSelect option[value="rating"]')).toHaveCount(0);
});

test('size selection, shipping threshold, totals and persisted bag agree', async ({ page }) => {
  await page.locator('[data-open-product="summit-tee"]').first().click();
  await page.locator('#productAddToBag').click();
  await expect(page.locator('#sizeError')).toBeVisible();
  await expect(page.locator('#bagCount')).toHaveText('0');
  await page.locator('[data-size="M"]').click();
  await expect(page.locator('[data-size="M"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#productAddToBag').click();
  await expect(page.locator('#cartItems')).toContainText('M · Ivory');
  await expect(page.locator('#cartTotal')).toHaveText('₹898');
  await page.locator('[data-qty="1"]').click();
  await expect(page.locator('#cartSubtotal')).toHaveText('₹1,598');
  await expect(page.locator('#cartShipping')).toHaveText('Complimentary');
  await page.reload();
  await page.locator('#cartOpen').click();
  await expect(page.locator('#bagCount')).toHaveText('2');
  await page.locator('[data-remove]').click();
  await expect(page.locator('#bagCount')).toHaveText('0');
  await expect(page.locator('#checkoutOpen')).toBeDisabled();
});

test('search and product dialogs contain focus and restore it when dismissed', async ({ page }) => {
  await page.locator('#searchOpen').click();
  await expect(page.locator('#searchInput')).toBeFocused();
  await page.locator('#searchInput').fill('hoodie');
  await expect(page.locator('[data-search-product]')).toHaveCount(7);
  await page.locator('[data-search-product]').last().focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#searchClose')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#searchOpen')).toBeFocused();
  const opener = page.locator('[data-open-product="capra-cool-tee"]').first();
  await opener.click();
  await expect(page.locator('#productModal .modal-close')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#productModal .product-help a')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
});

test('checkout handles failure and retry with an isolated order response', async ({ page }) => {
  let requests = 0;
  let order;
  await page.route('**/api/orders', async route => {
    requests += 1;
    order = route.request().postDataJSON();
    await route.fulfill(requests === 1 ? { status: 503, json: { error: 'Test failure: could not submit' } } : { status: 200, json: {order_id:'CC-BRAND-TEST'} });
  });
  await page.locator('[data-open-product="capra-cool-tee"]').first().click();
  await page.locator('[data-size="L"]').click();
  await page.locator('#productAddToBag').click();
  await page.locator('#checkoutOpen').click();
  await expect(page.locator('#checkoutPreview')).toContainText('Jet Black · L');
  await expect(page.locator('#checkoutPreview')).toContainText('₹998');
  const form = page.locator('#checkoutForm');
  await form.locator('[name="name"]').fill('Storefront Test');
  await form.locator('[name="phone"]').fill('9999999999');
  await form.locator('[name="email"]').fill('storefront@example.test');
  await form.locator('[name="address"]').fill('Test address, do not dispatch');
  await form.locator('[name="city"]').fill('Mandi');
  await form.locator('[name="state"]').fill('Himachal Pradesh');
  await form.locator('[name="pincode"]').fill('175001');
  await form.getByRole('button', { name: 'Place order', exact: true }).click();
  await expect(page.locator('#toastRegion')).toContainText('could not submit');
  await expect(form.getByRole('button', { name: 'Place order', exact: true })).toBeEnabled();
  await expect(page.locator('#bagCount')).toHaveText('1');
  await form.getByRole('button', { name: 'Place order', exact: true }).click();
  await expect(page.locator('#checkoutSuccess')).toBeVisible();
  await expect(page.locator('#successOrderId')).not.toBeEmpty();
  expect(order.items[0]).toMatchObject({ id: 'capra-cool-tee', size: 'L', qty: 1 });
  expect(order.items[0]).not.toHaveProperty('unit_price');
  expect(order.customer.email).toBe('storefront@example.test');
  await expect(page.locator('#bagCount')).toHaveText('0');
});

test('all secondary pages exist in the production build', async ({ page }) => {
  const policyResponse = await page.goto('/policies.html');
  expect(policyResponse.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Order information.' })).toBeVisible();
  await page.locator('.policy-top > a').last().click();
  await expect(page.locator('#shop')).toBeVisible();
  const adminResponse = await page.goto('/admin.html');
  expect(adminResponse.status()).toBe(200);
  await expect(page.locator('#adminLogin')).toBeVisible();
  await expect(page.locator('.admin-shell')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
