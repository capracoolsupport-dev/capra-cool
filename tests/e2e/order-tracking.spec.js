import { expect, test } from "@playwright/test";

test("order tracking page validates inputs and enforces uppercase order number", async ({ page }) => {
  await page.goto("/track-order");

  const orderInput = page.getByPlaceholder("TSS-1234ABCD");
  const emailInput = page.getByPlaceholder("you@example.com");

  // Type lowercase order number, expect it to format as uppercase
  await orderInput.fill("tss-9876xyz");
  // NOTE: Depending on React's event flow, React handles onChange to uppercase it.
  await expect(orderInput).toHaveValue("TSS-9876XYZ");

  await emailInput.fill("TESTER@EXAMPLE.COM");
  // Email stays as typed initially but the API translates it to lower.

  // Attempt to submit
  await page.getByRole("button", { name: "Track Order" }).click();

  // Without a connected Supabase, the API throws a graceful fallback message:
  await expect(
    page.getByText("Order tracking is not available until Supabase is connected.")
  ).toBeVisible();
});

test("order tracking populated via URL search parameters", async ({ page }) => {
  await page.goto("/track-order?order=TSS-AUTO&email=auto@example.com");

  const orderInput = page.getByPlaceholder("TSS-1234ABCD");
  const emailInput = page.getByPlaceholder("you@example.com");

  await expect(orderInput).toHaveValue("TSS-AUTO");
  await expect(emailInput).toHaveValue("auto@example.com");
});
