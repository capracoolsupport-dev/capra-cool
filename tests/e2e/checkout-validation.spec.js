import { expect, test } from "@playwright/test";

async function waitForStorefront(page, path = "/") {
  await page.goto(path);
  const storefront = page.locator("#main-content");
  await expect(storefront).toHaveAttribute("data-storefront-source", "supabase");
  await expect(storefront).toHaveAttribute("data-storefront-status", "ready", { timeout: 15000 });
}

async function addFirstProductToCart(page) {
  await waitForStorefront(page);

  const firstCardLink = page.locator(".product-card").first().getByRole("link");
  const label = (await firstCardLink.getAttribute("aria-label")) || "";
  const productName = label.replace(/^View\s+/, "").trim();

  await firstCardLink.click();
  await expect(page.getByRole("heading", { name: productName, exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Add to Cart" }).first().click();
  await expect(page.getByRole("status")).toContainText(`${productName} added to cart.`);
}

test.describe("Checkout & Validation", () => {
  test("enforces required customer inputs before checkout", async ({ page }) => {
    await addFirstProductToCart(page);
    await page.goto("/checkout");

    await page.getByRole("button", { name: /Pay/i }).click();

    await expect(page.getByLabel("Full Name *")).toBeFocused();

    await page.getByLabel("Full Name *").fill("Playwright Tester");
    await page.getByLabel("Email *").fill("tester@example.com");
    await page.getByRole("button", { name: /Pay/i }).click();

    await expect(page.getByLabel("Phone *")).toBeFocused();

    await page.getByLabel("Phone *").fill("9999999999");
    await page.getByRole("button", { name: /Pay/i }).click();

    await expect(page.getByLabel("Address Line 1 *")).toBeFocused();
  });

  test("displays an empty state when the cart is empty", async ({ page }) => {
    await waitForStorefront(page, "/checkout");

    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore Collection/i })).toBeVisible();
  });
});
