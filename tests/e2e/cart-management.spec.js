import { expect, test } from "@playwright/test";

async function openFlowersProduct(page) {
  await page.goto("/");
  await page.getByRole("link", { name: "View Flowers" }).click();
  await expect(page).toHaveURL(/\/products\/flowers$/);
}

test.describe("Cart Management Flow", () => {
  test("adds a product to the cart and shows totals in the drawer", async ({ page }) => {
    await openFlowersProduct(page);

    await page.getByRole("button", { name: "Add to Cart" }).first().click();
    await expect(page.getByRole("status").getByText("1 Flowers added to cart.")).toBeVisible();

    await page.getByRole("button", { name: "Open cart" }).click();

    const cartPanel = page.locator(".drawer-panel");
    const cartItem = page.locator(".cart-item").filter({ hasText: "Flowers" });

    await expect(cartPanel).toBeVisible();
    await expect(cartItem).toBeVisible();
    await expect(cartItem.getByText("1", { exact: true })).toBeVisible();
    await expect(page.locator(".cart-footer")).toBeVisible();
    await expect(page.locator(".cart-total-row").getByText("Total", { exact: true })).toBeVisible();
  });

  test("can adjust quantities within the cart drawer", async ({ page }) => {
    await openFlowersProduct(page);

    await page.getByRole("button", { name: "Add to Cart" }).first().click();
    await page.getByRole("button", { name: "Open cart" }).click();

    const cartItem = page.locator(".cart-item").filter({ hasText: "Flowers" });
    const increaseButton = cartItem.getByRole("button", { name: "+" });

    await increaseButton.click();
    await increaseButton.click();

    await expect(cartItem.getByText("3", { exact: true })).toBeVisible();
  });

  test("removes items and reflects the empty cart state", async ({ page }) => {
    await openFlowersProduct(page);

    await page.getByRole("button", { name: "Add to Cart" }).first().click();
    await page.getByRole("button", { name: "Open cart" }).click();

    const cartItems = page.locator(".cart-items");

    await cartItems.getByRole("button", { name: "Remove", exact: true }).first().click();

    await expect(cartItems.getByText(/Your cart is empty/i)).toBeVisible();
  });
});
