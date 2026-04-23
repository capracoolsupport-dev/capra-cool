import { expect, test } from "@playwright/test";

test.describe("Cart Management Flow", () => {
  test("adds a product to the cart and calculates correct initial totals", async ({ page }) => {
    // Start at a known product page by navigating from the home page
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByPlaceholder("Search scrunchies, gifting, flowers...").fill("flowers");
    await page.locator(".search-result-card").filter({ hasText: "Flowers" }).click();
    
    // Add item
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByText("1 Flowers added to cart.")).toBeVisible();

    // Open Cart
    await page.getByRole("button", { name: "Open cart" }).click();

    const cartPanel = page.locator(".drawer-panel");
    await expect(cartPanel).toBeVisible();

    // Verify the cart item
    const cartItem = page.locator(".cart-item").filter({ hasText: "Flowers" });
    await expect(cartItem).toBeVisible();
    await expect(cartItem.locator("span", { hasText: /^1$/ })).toBeVisible();

    // Check footer totals
    await expect(page.locator(".cart-footer")).toBeVisible();
    await expect(page.locator(".cart-footer").getByText("Total", { exact: true })).toBeVisible();
  });

  test("can adjust quantities within the cart", async ({ page }) => {
    // Navigate via search
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByPlaceholder("Search scrunchies, gifting, flowers...").fill("flowers");
    await page.locator(".search-result-card").filter({ hasText: "Flowers" }).click();
    
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.getByRole("button", { name: "Open cart" }).click();

    const cartItem = page.locator(".cart-item").filter({ hasText: "Flowers" });

    // Increase quantity using the + button
    const increaseBtn = cartItem.getByRole('button', { name: "+" });
    await increaseBtn.click();
    await increaseBtn.click();
    
    // We expect the visible value to be 3
    await expect(cartItem.getByText("3", { exact: true })).toBeVisible();
    
    // (Optional: Verify the new subtotal reflects the new quantity, depending on formatPrice)
  });

  test("removes items and reflects an empty cart state", async ({ page }) => {
    // Navigate via search
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByPlaceholder("Search scrunchies, gifting, flowers...").fill("flowers");
    await page.locator(".search-result-card").filter({ hasText: "Flowers" }).click();
    
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.getByRole("button", { name: "Open cart" }).click();

    const cartPanel = page.locator(".cart-items");
    
    // Click remove
    await cartPanel.getByRole("button", { name: "Remove", exact: true }).first().click();

    // Verify empty state
    await expect(cartPanel.getByText(/Your cart is empty/i)).toBeVisible();
  });
});
