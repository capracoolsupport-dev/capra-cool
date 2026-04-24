import { expect, test } from "@playwright/test";

async function addFlowersToCart(page) {
  await page.goto("/products/flowers");
  await page.getByRole("button", { name: "Add to Cart" }).first().click();
  await expect(page.getByRole("status").getByText("1 Flowers added to cart.")).toBeVisible();
}

test.describe("Checkout & Validation", () => {
  test("enforces required customer inputs before checkout", async ({ page }) => {
    await addFlowersToCart(page);
    await page.goto("/checkout");

    await page.getByRole("button", { name: /Pay/i }).click();

    await expect(page.getByLabel("Full Name *")).toBeFocused();
  });

  test("shows a safe payment fallback when Supabase is not connected", async ({ page }) => {
    await addFlowersToCart(page);
    await page.goto("/checkout");

    await page.getByLabel("Full Name *").fill("Playwright Tester");
    await page.getByLabel("Email *").fill("tester@example.com");
    await page.getByRole("button", { name: /Pay/i }).click();

    await expect(
      page.getByText("Payments are not available until Supabase is connected.")
    ).toBeVisible();
  });

  test("displays an empty state when the cart is empty", async ({ page }) => {
    await page.goto("/checkout");

    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore Collection/i })).toBeVisible();
  });
});
