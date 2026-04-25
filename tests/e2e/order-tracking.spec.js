import { expect, test } from "@playwright/test";

async function waitForStorefront(page, path = "/track-order") {
  await page.goto(path);
  const storefront = page.locator("#main-content");
  await expect(storefront).toHaveAttribute("data-storefront-source", "supabase");
  await expect(storefront).toHaveAttribute("data-storefront-status", "ready", { timeout: 15000 });
}

test("order tracking page validates inputs and enforces uppercase order number", async ({ page }) => {
  await waitForStorefront(page);

  const orderInput = page.getByPlaceholder("TSS-1234ABCD");
  const emailInput = page.getByPlaceholder("you@example.com");

  await orderInput.fill("tss-9876xyz");
  await expect(orderInput).toHaveValue("TSS-9876XYZ");

  await emailInput.fill("TESTER@EXAMPLE.COM");
  await page.getByRole("button", { name: "Track Order" }).click();

  await expect(page.locator(".tracking-layout .checkout-form-card .form-status")).toHaveText(
    "No order matched those details."
  );
});

test("order tracking populated via URL search parameters", async ({ page }) => {
  await waitForStorefront(page, "/track-order?order=TSS-AUTO&email=auto@example.com");

  const orderInput = page.getByPlaceholder("TSS-1234ABCD");
  const emailInput = page.getByPlaceholder("you@example.com");

  await expect(orderInput).toHaveValue("TSS-AUTO");
  await expect(emailInput).toHaveValue("auto@example.com");
});
