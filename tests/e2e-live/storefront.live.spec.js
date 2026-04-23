import { expect, test } from "@playwright/test";

async function waitForLiveStorefront(page) {
  await page.goto("/");
  await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-status", "ready");
  await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-source", "supabase");
}

test("homepage loads data from Supabase", async ({ page }) => {
  await waitForLiveStorefront(page);

  await expect(page.locator(".announcement-track span").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Featured Product Collections" })).toBeVisible();
  await expect(page.locator(".category-pill").first()).toBeVisible();
  await expect(page.locator(".product-card").first()).toBeVisible();
});

test("live product detail flow opens from the collection and adds to cart locally", async ({ page }) => {
  await waitForLiveStorefront(page);

  const firstCard = page.locator(".product-card").first();
  const productName = (await firstCard.getByRole("heading").textContent())?.trim() || "";
  await firstCard.getByRole("link").click();

  await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-source", "supabase");
  await expect(
    page.locator(".product-info-panel").getByRole("heading", { name: productName, exact: true })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();

  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.getByRole("button", { name: "Open cart" }).click();

  await expect(page.locator(".cart-item").getByText(productName, { exact: true })).toBeVisible();
});

test("live mobile navigation can open the customize page", async ({ page }, testInfo) => {
  test.skip(!/mobile/i.test(testInfo.project.name), "This flow only applies to the mobile layout.");

  await waitForLiveStorefront(page);
  await page.getByRole("button", { name: "Open menu" }).click();

  const mobileMenu = page.locator(".mobile-menu-panel");
  await expect(mobileMenu).toBeVisible();
  await mobileMenu.getByRole("link", { name: "Customize" }).click();

  await expect(page).toHaveURL(/\/customize$/);
  await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-source", "supabase");
  await expect(page.getByRole("heading", { name: /custom crochet piece/i })).toBeVisible();
});
