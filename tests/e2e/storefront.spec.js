import { expect, test } from "@playwright/test";

test("homepage renders the simplified storefront sections", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Handmade crochet that feels personal, polished, and beautifully gift-ready\./i
    })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Product Categories" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
  await expect(page.locator(".product-card").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open cart" })).toBeVisible();
});

test("product cards open the product page and support gallery navigation", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View Flowers" }).click();

  await expect(page).toHaveURL(/\/products\/flowers$/);
  await expect(page.getByRole("heading", { name: "Flowers" })).toBeVisible();

  const galleryImage = page.locator(".gallery-stage img");
  const firstSrc = await galleryImage.getAttribute("src");

  await page.getByRole("button", { name: "Next image" }).click();
  await expect(galleryImage).not.toHaveAttribute("src", firstSrc || "");
});

test("contact form handles a safe mock-mode submission flow", async ({ page }) => {
  await page.goto("/contact");

  const contactForm = page.locator(".form-card").first();

  await contactForm.getByLabel("Name").fill("Playwright Tester");
  await contactForm.getByLabel("Email").fill("tester@example.com");
  await contactForm
    .getByRole("textbox", { name: "Message" })
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
  await expect(mobileMenu.getByText("Menu", { exact: true })).toBeVisible();
  await mobileMenu.getByRole("link", { name: "Custom Orders" }).click();

  await expect(page).toHaveURL(/\/customize$/);
  await expect(
    page.getByRole("heading", {
      name: /Design a custom crochet piece that feels personal from the start\./i
    })
  ).toBeVisible();
});
