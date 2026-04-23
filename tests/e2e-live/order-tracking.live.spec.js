import { expect, test } from "@playwright/test";

test("tracking shows a clear message when the order does not exist", async ({ page }) => {
  await page.goto("/track-order");
  await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-status", "ready");
  await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-source", "supabase");

  await page.getByPlaceholder("TSS-1234ABCD").fill("TSS-NOTREAL");
  await page.getByPlaceholder("you@example.com").fill("nobody@example.com");
  await page.getByRole("button", { name: "Track Order" }).click();

  await expect(page.locator(".tracking-layout .checkout-form-card .form-status")).toHaveText(
    "No order matched those details."
  );
});
