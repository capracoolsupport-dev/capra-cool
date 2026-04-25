import { expect, test } from "@playwright/test";

async function waitForStorefront(page, path = "/") {
  await page.goto(path);
  const storefront = page.locator("#main-content");
  await expect(storefront).toHaveAttribute("data-storefront-source", "supabase");
  await expect(storefront).toHaveAttribute("data-storefront-status", "ready", { timeout: 15000 });
}

async function openFirstProduct(page) {
  await waitForStorefront(page);

  const firstCardLink = page.locator(".product-card").first().getByRole("link");
  const label = (await firstCardLink.getAttribute("aria-label")) || "";
  const productName = label.replace(/^View\s+/, "").trim();

  await firstCardLink.click();
  await expect(page.getByRole("heading", { name: productName, exact: true })).toBeVisible();

  return productName;
}

test("homepage renders the live storefront sections", async ({ page }) => {
  await waitForStorefront(page);

  await expect(page.locator("main h1").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Product Categories" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
  await expect(page.locator(".product-card").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open cart" })).toBeVisible();
});

test("product cards open the product page and show purchase controls", async ({ page }) => {
  await openFirstProduct(page);

  await expect(page.locator(".gallery-stage img")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to Cart" }).first()).toBeVisible();
  await expect(page.getByText("Quantity", { exact: true })).toBeVisible();
});

test("contact page shows the production support form", async ({ page }) => {
  await waitForStorefront(page, "/contact");

  const contactForm = page.locator(".form-card").first();

  await expect(page.locator("main h1").first()).toBeVisible();
  await expect(contactForm.getByLabel("Name")).toBeVisible();
  await expect(contactForm.getByLabel("Email")).toBeVisible();
  await expect(contactForm.getByLabel("Phone Number (optional)")).toBeVisible();
  await expect(contactForm.getByRole("textbox", { name: "Message" })).toBeVisible();
});

test("custom order page shows the production request form", async ({ page }) => {
  await waitForStorefront(page, "/customize");

  const customOrderForm = page.locator(".form-card").first();

  await expect(page.locator("main h1").first()).toBeVisible();
  await expect(customOrderForm.getByLabel("Name")).toBeVisible();
  await expect(customOrderForm.getByLabel("Email")).toBeVisible();
  await expect(customOrderForm.getByLabel("Product Type")).toBeVisible();
  await expect(customOrderForm.getByLabel("Customization Details")).toBeVisible();
});

test("mobile menu opens and navigates to the customize page", async ({ page }, testInfo) => {
  test.skip(!/mobile/i.test(testInfo.project.name), "This flow only applies to the mobile layout.");

  await waitForStorefront(page);
  await page.getByRole("button", { name: "Open menu" }).click();

  const mobileMenu = page.locator(".mobile-menu-panel");
  await expect(mobileMenu.getByText("Menu", { exact: true })).toBeVisible();
  await mobileMenu.getByRole("link", { name: "Custom Orders" }).click();

  await expect(page).toHaveURL(/\/customize$/);
  await expect(page.locator(".form-card").first()).toBeVisible();
});
