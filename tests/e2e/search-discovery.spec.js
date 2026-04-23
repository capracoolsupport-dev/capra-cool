import { expect, test } from "@playwright/test";

test.describe("Search & Discovery", () => {
  test("search modal opens and finds a known product", async ({ page }) => {
    await page.goto("/");

    // Open search modal
    await page.getByRole("button", { name: "Open search" }).click();
    await expect(page.getByRole("heading", { name: "Find handmade crochet pieces quickly" })).toBeVisible();

    // Perform a search
    await page.getByPlaceholder("Search scrunchies, gifting, flowers...").fill("flowers");
    
    // Click the result
    await page.locator(".search-result-card").filter({ hasText: "Flowers" }).click();

    // Verify successful navigation and product rendering
    await expect(page).toHaveURL(/\/products\/flowers$/);
    await expect(page.getByRole("heading", { name: "Flowers" })).toBeVisible();
  });

  test("renders 404 or empty state on unknown search queries", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByPlaceholder("Search scrunchies, gifting, flowers...").fill("ASDFASDF12345");
    
    // Verify the "No results" message is visible
    await expect(page.getByText(/No products matched that search/i)).toBeVisible();
  });
});
