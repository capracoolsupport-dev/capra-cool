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

    // Check the restrained service announcement
    const announce = page.locator(".announce");
    await expect(announce).toContainText("Complimentary shipping above ₹999");
    await expect(announce).toContainText("Himalayan foothills");
  });

  test("2. Category filters display accurate product counts", async ({ page }) => {
    const products = page.locator(".products .product");
    await expect(products).toHaveCount(25);
    await expect(page.locator(".products .sale-discount")).toHaveCount(0);
    await expect(page.locator(".edit-note")).toContainText("Private edit");
    const iitTshirt = page.locator('.product[data-product-id="iit-black-tshirt"]');
    await expect(iitTshirt).toContainText("₹999");
    await expect(iitTshirt).toContainText("₹599");

    // Two original tees plus seven IIT Mandi designs
    await page.locator('.filter[data-filter="tee"]').click();
    await expect(page.locator('.product[data-cat="tee"]')).toHaveCount(9);

    // Two original hoodies plus five IIT Mandi designs
    await page.locator('.filter[data-filter="hoodie"]').click();
    await expect(page.locator('.product[data-cat="hoodie"]')).toHaveCount(7);

    // Filter Tracksuits (Trail Tracksuit, Peak Tracksuit)
    await page.locator('.filter[data-filter="track"]').click();
    await expect(page.locator('.product[data-cat="track"]')).toHaveCount(2);

    await page.locator('.filter[data-filter="accessory"]').click();
    await expect(page.locator('.product[data-cat="accessory"]')).toHaveCount(7);

    // Reset to All
    await page.locator('.filter[data-filter="all"]').click();
    await expect(products).toHaveCount(25);
  });

  test("3. New one-size accessories can be added to the bag", async ({ page }) => {
    await page.locator('.filter[data-filter="accessory"]').click();
    const product = page.locator('.product[data-product-id="sunflower-keychain"]');
    await expect(product).toContainText("₹127");
    await expect(product).toContainText("₹211");
    await expect(page.locator(".edit-note")).toContainText("Original MRP remains visible");

    await product.locator(".add-btn").click();
    await expect(page.locator("#sizeGuideToggleText")).toBeVisible();
    await page.locator("#sizeGuideToggleText").click();
    await expect(page.locator("#sizeModalChart")).toContainText("Universal fit");
    await page.locator('#sizeModalButtons .size-btn[data-size="One Size"]').click();
    await page.locator('#sizeModal button:has-text("Add to Bag")').click();

    await expect(page.locator("#cartItemsList")).toContainText("Sunflower Keychain");
    await expect(page.locator("#cartItemsList")).toContainText("Size: One Size");
    await expect(page.locator("#cartSubtotal")).toHaveText("₹127");
  });

  test("4. Quick View modal shows garment specs and measurements", async ({ page }) => {
    const quickViewBtn = page.locator('.product[data-product-id="alpine-hoodie"] .details-btn');
    await quickViewBtn.click();

    const modal = page.locator("#quickViewModal");
    await expect(modal).toBeVisible();
    await expect(page.locator("#quickViewTitle")).toHaveText("Alpine Hoodie");
    await expect(page.locator("#quickViewPrice")).toContainText("₹1,916");
    await expect(page.locator("#quickViewPrice")).toContainText("₹3,193");
    await expect(page.locator("#quickViewPrice")).toContainText("40% below MRP");
    await expect(page).toHaveURL(/#product\/alpine-hoodie$/);
    await expect(page.locator("#quickViewThumbnails .quickview-thumb")).toHaveCount(3);
    await expect(page.locator("#quickViewNotes")).toContainText("Material & hand feel");
    await expect(page.locator("#quickViewSpecs")).toContainText("380 GSM");
    await expect(page.locator("#quickViewSpecs")).toContainText("Olive Drab");
    await expect(page.locator("#quickViewChart")).toContainText("Size chart");
    await expect(page.locator("#quickViewChart")).toContainText('42-44"');

    // Close modal
    await page.locator("#quickViewModal .modal-close").click();
    await expect(modal).not.toBeVisible();

    // Campus products receive the complete S-XXXL fallback chart.
    await page.locator('.product[data-product-id="iit-black-tshirt"] .details-btn').click();
    await expect(page.locator("#quickViewChart")).toContainText("XXXL");
    await expect(page.locator("#quickViewChart")).toContainText('48-50"');
  });

  test("5. Size selection and shopping bag with Free Shipping tracker", async ({ page }) => {
    // Open size selector for Alpine Hoodie (₹3,193 MRP, ₹1,916 sale price)
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
    await expect(page.locator("#cartSubtotal")).toHaveText("₹1,916");

    // Free shipping threshold met (₹1,916 >= ₹999)
    await expect(page.locator("#shippingTrackerMsg")).toContainText("Free Express Shipping Unlocked");

    // Increment quantity
    await page.locator('.qty-control button:has-text("+")').click();
    await expect(page.locator("#cartSubtotal")).toHaveText("₹3,832");
  });

  test("6. Checkout flow with Direct Order / COD receipt confirmation", async ({ page }) => {
    // Add Summit Tee to bag (₹1,702 MRP, ₹1,021 sale price)
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

  test("7. Search overlay finds products accurately", async ({ page }) => {
    await page.locator("#searchBtn").click();
    const searchPanel = page.locator("#searchPanel");
    await expect(searchPanel).toHaveClass(/open/);

    await page.locator("#searchInput").fill("hoodie");
    const results = page.locator("#searchResults .search-result-item");
    await expect(results).toHaveCount(7);

    // Click result jumps to product
    await results.first().click();
    await expect(searchPanel).not.toHaveClass(/open/);
  });

  test("8. Custom campus builder supports every institution family", async ({ page }) => {
    const institutionOptions = page.locator('input[name="institutionType"]');
    await expect(institutionOptions).toHaveCount(7);

    await page.locator('input[name="institutionType"][value="IIM"]').check({ force: true });
    await expect(page.locator("#customInstituteName")).toHaveAttribute("placeholder", "e.g. IIM Ahmedabad");
    await page.locator("#customInstituteName").fill("IIM Kozhikode");
    await page.locator("#customStepNext").click();
    await page.locator('input[name="garment"][value="tracksuit"]').check({ force: true });
    await page.locator("#customStepNext").click();
    await page.locator('input[name="colour"][value="Maroon"]').check({ force: true });
    await page.locator("#customPrintPlacement").selectOption("sleeve-back");
    await page.locator("#customQuantity").fill("120");
    await page.locator("#customPersonalisation").check();

    await expect(page.locator("#customPreviewInstitute")).toHaveText("IIM");
    await expect(page.locator("#customPreviewName")).toHaveText("IIM KOZHIKODE");
    await expect(page.locator("#customPreviewGarment")).toContainText("TRACKSUIT");
    await expect(page.locator("#customOrderSummary")).toHaveText("IIM · Tracksuit · 120 pieces");

    await page.evaluate(() => {
      window.__customQuoteUrl = "";
      window.open = url => {
        window.__customQuoteUrl = url;
        return null;
      };
    });
    await page.locator("#customOrderForm").getByRole("button", { name: "Request atelier quote" }).click();

    const quoteUrl = await page.evaluate(() => window.__customQuoteUrl);
    const decodedQuote = decodeURIComponent(quoteUrl);
    expect(decodedQuote).toContain("IIM Kozhikode (IIM)");
    expect(decodedQuote).toContain("*GARMENT:* Tracksuit");
    expect(decodedQuote).toContain("QUANTITY:* 120");
  });

  test("9. Premium editorial sections and trust cues are present", async ({ page }) => {
    await expect(page.locator(".hero-copy h1")).toHaveText("CAPRA COOL");
    await expect(page.locator("#craft")).toContainText("Weight you can feel");
    await expect(page.locator(".packaging-section")).toContainText("Prepared like a keepsake");
    await expect(page.locator(".trust-section")).toContainText("Secure checkout");
    await expect(page.locator(".trust-section")).toContainText("7 days from delivery");
  });

  test("10. Store Policies page renders full legal terms", async ({ page }) => {
    await page.goto("/policies.html");
    await expect(page).toHaveTitle(/Store Policies — CAPRA COOL/);
    await expect(page.locator("#shipping")).toContainText("Shipping & Delivery Policy");
    await expect(page.locator("#returns")).toContainText("7-day return window");
    await expect(page.locator("#privacy")).toContainText("Digital Personal Data Protection");
    await expect(page.locator("#contact")).toContainText("care@capracool.com");
  });
});
