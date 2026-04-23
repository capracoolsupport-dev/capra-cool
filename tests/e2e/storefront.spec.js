import { expect, test } from "@playwright/test";

test("homepage renders the main storefront sections", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Handmade crochet that feels personal, polished, and beautifully gift-ready\./i
    })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Product Categories" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Featured Product Collections" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reviews + Trust" })).toBeVisible();
  await expect(page.locator(".product-card").first()).toBeVisible();
});

test("search can open a product and add it to the cart", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open search" }).click();
  await expect(
    page.getByRole("heading", { name: "Find handmade crochet pieces quickly" })
  ).toBeVisible();

  await page.getByPlaceholder("Search scrunchies, gifting, flowers...").fill("flowers");
  await page.locator(".search-result-card").filter({ hasText: "Flowers" }).click();

  await expect(page).toHaveURL(/\/products\/flowers$/);
  await expect(page.getByRole("heading", { name: "Flowers" })).toBeVisible();

  const galleryImage = page.locator(".gallery-stage img");
  const firstSrc = await galleryImage.getAttribute("src");
  await page.getByRole("button", { name: "Next image" }).click();
  await expect(galleryImage).not.toHaveAttribute("src", firstSrc || "");

  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("1 Flowers added to cart.")).toBeVisible();

  await page.getByRole("button", { name: "Open cart" }).click();
  await expect(page.locator(".cart-item").getByText("Flowers", { exact: true })).toBeVisible();
  await expect(page.locator(".cart-footer").getByText("Total", { exact: true })).toBeVisible();
});

test("contact form handles a safe mock-mode submission flow", async ({ page }) => {
  await page.goto("/contact");

  const contactForm = page.locator(".form-card").first();

  await contactForm.getByLabel("Name").fill("Playwright Tester");
  await contactForm.getByLabel("Email").fill("tester@example.com");
  await contactForm.getByLabel("Phone Number (optional)").fill("9999999999");
  await contactForm
    .getByLabel("Message")
    .fill("Need help with a gifting recommendation for an anniversary order.");

  await contactForm.getByRole("button", { name: "Send Message" }).click();
  await expect(
    contactForm.getByText("Messages are not available right now. Please try again soon.")
  ).toBeVisible();
});

test("custom order form handles a safe mock-mode submission flow", async ({ page }) => {
  await page.goto("/customize");

  const customOrderForm = page.locator(".form-card").first();

  await customOrderForm.getByLabel("Name").fill("Playwright Tester");
  await customOrderForm.getByLabel("Email").fill("tester@example.com");
  await customOrderForm.getByLabel("Product Type").selectOption({ label: "Flowers" });
  await customOrderForm
    .getByLabel("Customization Details")
    .fill("Pastel flowers for a desk arrangement with soft blush and cream tones.");

  await customOrderForm.getByRole("button", { name: "Request Custom Order" }).click();
  await expect(
    customOrderForm.getByText("Custom orders are not available right now. Please try again soon.")
  ).toBeVisible();
});

test("mobile menu opens and navigates to the customize page", async ({ page }, testInfo) => {
  test.skip(!/mobile/i.test(testInfo.project.name), "This flow only applies to the mobile layout.");

  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();

  const mobileMenu = page.locator(".mobile-menu-panel");
  await expect(mobileMenu.getByText("Browse", { exact: true })).toBeVisible();
  await mobileMenu.getByRole("link", { name: "Customize" }).click();

  await expect(page).toHaveURL(/\/customize$/);
  await expect(
    page.getByRole("heading", {
      name: /Design a custom crochet piece that feels personal from the start\./i
    })
  ).toBeVisible();
});
