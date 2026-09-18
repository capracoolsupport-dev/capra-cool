import { test, expect } from "@playwright/test";

test.describe("Capra Cool Authentic Storefront E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("1. Homepage renders Capra Cool branding and hero", async ({ page }) => {
    await expect(page).toHaveTitle(/CAPRA COOL/);
    const brand = page.locator("#mainHeader .brand-name");
    await expect(brand).toHaveText("CAPRA COOL");

    // Check Ibex crest SVG exists
    const logoSvg = page.locator("#mainHeader .brand-icon-wrap svg");
    await expect(logoSvg).toBeVisible();

    // Check announcement bar with IIT Mandi
    const announce = page.locator(".announce");
    await expect(announce).toContainText("FREE SHIPPING ABOVE ₹999");
    await expect(announce).toContainText("IIT MANDI, HIMALAYAS");
  });

  test("2. Category filters display accurate product counts", async ({ page }) => {
    const products = page.locator(".products .product");
    await expect(products).toHaveCount(6);

    // Filter T-Shirts (Summit Tee, Capra Classic Tee)
    await page.locator('.filter[data-filter="tee"]').click();
    await expect(page.locator('.product[data-cat="tee"]')).toHaveCount(2);

    // Filter Hoodies (Alpine Hoodie, Horizon Hoodie)
    await page.locator('.filter[data-filter="hoodie"]').click();
    await expect(page.locator('.product[data-cat="hoodie"]')).toHaveCount(2);

    // Filter Tracksuits (Trail Tracksuit, Peak Tracksuit)
    await page.locator('.filter[data-filter="track"]').click();
    await expect(page.locator('.product[data-cat="track"]')).toHaveCount(2);

    // Reset to All
    await page.locator('.filter[data-filter="all"]').click();
    await expect(products).toHaveCount(6);
  });

  test("3. Quick View modal shows garment specs and measurements", async ({ page }) => {
    const quickViewBtn = page.locator('.product[data-product-id="alpine-hoodie"] .details-btn');
    await quickViewBtn.click();

    const modal = page.locator("#quickViewModal");
    await expect(modal).toBeVisible();
    await expect(page.locator("#quickViewTitle")).toHaveText("Alpine Hoodie");
    await expect(page.locator("#quickViewSpecs")).toContainText("380 GSM");
    await expect(page.locator("#quickViewSpecs")).toContainText("Olive Drab");

    // Close modal
    await page.locator("#quickViewModal .modal-close").click();
    await expect(modal).not.toBeVisible();
  });

  test("4. Size selection and shopping bag with Free Shipping tracker", async ({ page }) => {
    // Open size selector for Alpine Hoodie (₹1,499)
    await page.locator('.product[data-product-id="alpine-hoodie"] .add-btn').click();
    const sizeModal = page.locator("#sizeModal");
    await expect(sizeModal).toBeVisible();

    // Select Size L
    await page.locator('#sizeModalButtons .size-btn[data-size="L"]').click();
    await expect(page.locator('#sizeModalButtons .size-btn[data-size="L"]')).toHaveClass(/selected/);

    // Add to bag
    await page.locator('#sizeModal button:has-text("Add to Bag")').click();

    // Drawer opens
    const drawer = page.locator("#bagDrawer");
    await expect(drawer).toHaveClass(/open/);

    // Verify item in cart
    await expect(page.locator("#cartItemsList")).toContainText("Alpine Hoodie");
    await expect(page.locator("#cartItemsList")).toContainText("Size: L");
    await expect(page.locator("#cartSubtotal")).toHaveText("₹1,499");

    // Free shipping threshold met (₹1,499 >= ₹999)
    await expect(page.locator("#shippingTrackerMsg")).toContainText("Free Express Shipping Unlocked");

    // Increment quantity
    await page.locator('.qty-control button:has-text("+")').click();
    await expect(page.locator("#cartSubtotal")).toHaveText("₹2,998");
  });

  test("5. Checkout flow with Direct Order / COD receipt confirmation", async ({ page }) => {
    // Add Summit Tee to bag (₹799)
    await page.locator('.product[data-product-id="summit-tee"] .add-btn').click();
    await page.locator('#sizeModalButtons .size-btn[data-size="M"]').click();
    await page.locator('#sizeModal button:has-text("Add to Bag")').click();

    // Click Proceed to checkout
    await page.locator("#checkoutProceedBtn").click();
    const checkoutModal = page.locator("#checkoutModal");
    await expect(checkoutModal).toBeVisible();

    // Switch to Direct Order / COD tab
    await page.locator('.checkout-tab[data-tab="direct"]').click();
    await expect(page.locator("#checkoutDirectTab")).toBeVisible();

    // Fill form
    await page.locator('#directOrderForm input[name="name"]').fill("Aarav Sharma");
    await page.locator('#directOrderForm input[name="phone"]').fill("9876543210");
    await page.locator('#directOrderForm input[name="email"]').fill("aarav@capracool.com");
    await page.locator('#directOrderForm textarea[name="address"]').fill("Kamand Campus, IIT Mandi");
    await page.locator('#directOrderForm input[name="city"]').fill("Mandi");
    await page.locator('#directOrderForm input[name="state"]').fill("Himachal Pradesh");
    await page.locator('#directOrderForm input[name="pincode"]').fill("175005");
    await page.locator('#directOrderForm select[name="payment_method"]').selectOption("cod");

    // Submit order
    await page.locator('#directOrderForm button[type="submit"]').click();

    // Order Success Modal appears
    const successModal = page.locator("#orderSuccessModal");
    await expect(successModal).toBeVisible();
    await expect(page.locator("#successCustomerName")).toHaveText("Aarav Sharma");
    await expect(page.locator("#successOrderId")).toContainText("CC-2026-");
    await expect(page.locator("#successPaymentMethod")).toHaveText("Cash on Delivery");
  });

  test("6. Search overlay finds products accurately", async ({ page }) => {
    await page.locator("#searchBtn").click();
    const searchPanel = page.locator("#searchPanel");
    await expect(searchPanel).toHaveClass(/open/);

    await page.locator("#searchInput").fill("hoodie");
    const results = page.locator("#searchResults .search-result-item");
    await expect(results).toHaveCount(2);

    // Click result jumps to product
    await results.first().click();
    await expect(searchPanel).not.toHaveClass(/open/);
  });

  test("7. Store Policies page renders full legal terms", async ({ page }) => {
    await page.goto("/policies.html");
    await expect(page).toHaveTitle(/Store Policies — CAPRA COOL/);
    await expect(page.locator("#shipping")).toContainText("Shipping & Delivery Policy");
    await expect(page.locator("#returns")).toContainText("7-day return window");
    await expect(page.locator("#privacy")).toContainText("Digital Personal Data Protection");
    await expect(page.locator("#contact")).toContainText("care@capracool.com");
  });
});
