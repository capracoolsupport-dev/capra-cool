import { expect, test } from "@playwright/test";

test.describe("Category Discovery", () => {
  test("category filters narrow the product grid and can be reset", async ({ page }) => {
    await page.goto("/");

    const productCards = page.locator(".product-grid .product-card");
    await expect(productCards.first()).toBeVisible();
    await expect(productCards).toHaveCount(9);

    await page.getByRole("button", { name: "Gifting" }).click();

    await expect(page).toHaveURL(/category=gifting/);
    await expect(page.getByRole("heading", { name: "Gifting", exact: true })).toBeVisible();
    await expect(productCards).toHaveCount(2);
    await expect(page.getByText("2 products ready to browse in Gifting.")).toBeVisible();

    await page.getByRole("button", { name: "Show all" }).click();

    await expect(page).toHaveURL(/\/(#featured)?$/);
    await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
    await expect(productCards).toHaveCount(9);
  });

  test("mobile sticky add-to-cart bar works on the product page", async ({ page }, testInfo) => {
    test.skip(!/mobile/i.test(testInfo.project.name), "This flow only applies to the mobile layout.");

    await page.goto("/products/flowers");

    const stickyBar = page.locator(".product-sticky-bar");
    await expect(stickyBar).toBeVisible();

    await stickyBar.getByRole("button", { name: "+" }).click();
    await stickyBar.getByRole("button", { name: "Add to Cart" }).click();

    await expect(stickyBar.getByText("2 Flowers added to cart.")).toBeVisible();

    await page.getByRole("button", { name: "Open cart" }).click();
    await expect(page.locator(".cart-item").getByText("Flowers", { exact: true })).toBeVisible();
    await expect(page.locator(".cart-item").getByText("2", { exact: true })).toBeVisible();
  });
});
