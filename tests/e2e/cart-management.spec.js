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

test.describe("Cart Management Flow", () => {
  test("adds a product to the cart and shows totals in the drawer", async ({ page }) => {
    const productName = await openFirstProduct(page);

    await page.getByRole("button", { name: "Add to Cart" }).first().click();
    await expect(page.getByRole("status")).toContainText(`${productName} added to cart.`);

    await page.getByRole("button", { name: "Open cart" }).click();

    const cartPanel = page.locator(".drawer-panel");
    const cartItem = page.locator(".cart-item").filter({ hasText: productName });

    await expect(cartPanel).toBeVisible();
    await expect(cartItem).toBeVisible();
    await expect(cartItem.getByText("1", { exact: true })).toBeVisible();
    await expect(page.locator(".cart-footer")).toBeVisible();
    await expect(page.locator(".cart-total-row").getByText("Total", { exact: true })).toBeVisible();
  });

  test("can adjust quantities within the cart drawer", async ({ page }) => {
    const productName = await openFirstProduct(page);

    await page.getByRole("button", { name: "Add to Cart" }).first().click();
    await page.getByRole("button", { name: "Open cart" }).click();

    const cartItem = page.locator(".cart-item").filter({ hasText: productName });
    const increaseButton = cartItem.getByRole("button", { name: "+" });

    await increaseButton.click();
    await increaseButton.click();

    await expect(cartItem.getByText("3", { exact: true })).toBeVisible();
  });

  test("removes items and reflects the empty cart state", async ({ page }) => {
    await openFirstProduct(page);

    await page.getByRole("button", { name: "Add to Cart" }).first().click();
    await page.getByRole("button", { name: "Open cart" }).click();

    const cartItems = page.locator(".cart-items");

    await cartItems.getByRole("button", { name: "Remove", exact: true }).first().click();

    await expect(cartItems.getByText(/Your cart is empty/i)).toBeVisible();
  });
});
