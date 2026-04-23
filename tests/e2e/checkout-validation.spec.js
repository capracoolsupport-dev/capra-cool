import { expect, test } from "@playwright/test";

test.describe("Checkout & Validation", () => {
  test("enforces validation on required customer inputs", async ({ page }) => {
    // Navigate via search
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByPlaceholder("Search scrunchies, gifting, flowers...").fill("flowers");
    await page.locator(".search-result-card").filter({ hasText: "Flowers" }).click();
    
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/checkout");

    const checkoutBtn = page.getByRole("button", { name: /Pay/i });
    if(await checkoutBtn.count() > 0) {
      await checkoutBtn.click();
    }
    
    // Expect the name input to be focused because of HTML5 validation
    const nameInput = page.getByPlaceholder("Your full name");
    await expect(nameInput).toBeFocused();
  });

  test("displays empty state when cart is empty", async ({ page }) => {
    await page.goto("/checkout");

    // "Your cart is empty."
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore/i })).toBeVisible();
  });
});
