import { expect, test } from "@playwright/test";

async function waitForStorefront(page, path = "/") {
  await page.goto(path);
  const storefront = page.locator("#main-content");
  await expect(storefront).toHaveAttribute("data-storefront-source", "supabase");
  await expect(storefront).toHaveAttribute("data-storefront-status", "ready", { timeout: 15000 });
}

test.describe("Category Discovery", () => {
  test("category filters narrow the product grid and can be reset", async ({ page }) => {
    await waitForStorefront(page);

    const productCards = page.locator(".product-grid .product-card");
    await expect(productCards.first()).toBeVisible();
    const initialCount = await productCards.count();

    const firstCategory = page.locator(".category-pill").first();
    const categoryName = ((await firstCategory.locator("span").last().textContent()) || "").trim();

    await firstCategory.click();

    await expect(page).toHaveURL(/category=/);
    await expect(firstCategory).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: categoryName, exact: true })).toBeVisible();

    const filteredCount = await productCards.count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    await page.getByRole("button", { name: "Show all" }).click();

    await expect(page).toHaveURL(/\/(#featured)?$/);
    await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
    await expect(productCards).toHaveCount(initialCount);
  });

  test("mobile sticky add-to-cart bar works on the product page", async ({ page }, testInfo) => {
    test.skip(!/mobile/i.test(testInfo.project.name), "This flow only applies to the mobile layout.");

    await waitForStorefront(page);

    const firstCardLink = page.locator(".product-card").first().getByRole("link");
    const label = (await firstCardLink.getAttribute("aria-label")) || "";
    const productName = label.replace(/^View\s+/, "").trim();
    await firstCardLink.click();

    const stickyBar = page.locator(".product-sticky-bar");
    await expect(stickyBar).toBeVisible();

    await stickyBar.getByRole("button", { name: "+" }).click();
    await stickyBar.getByRole("button", { name: "Add to Cart" }).click();

    await expect(stickyBar).toContainText(`2 ${productName} added to cart.`);

    await page.getByRole("button", { name: "Open cart" }).click();
    await expect(page.locator(".cart-item").getByText(productName, { exact: true })).toBeVisible();
    await expect(page.locator(".cart-item").getByText("2", { exact: true })).toBeVisible();
  });
});
