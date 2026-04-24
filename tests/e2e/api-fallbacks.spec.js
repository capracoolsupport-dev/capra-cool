import { expect, test } from "@playwright/test";

test.describe("API Error Fallbacks", () => {
  test("contact form gracefully fails without a connected backend", async ({ page }) => {
    await page.goto("/contact");

    const contactForm = page.locator(".form-card").first();

    await contactForm.getByLabel("Name").fill("Playwright Tester");
    await contactForm.getByLabel("Email").fill("tester@example.com");
    await contactForm.getByRole("textbox", { name: "Message" }).fill("This is a mock fallback test.");

    await contactForm.getByRole("button", { name: "Send Message" }).click();
    
    // Verify fallback error toast
    await expect(
      contactForm.getByText("Messages are not available right now. Please try again soon.")
    ).toBeVisible();
  });

  test("custom order proxy handles a safe mock-mode submission gracefully", async ({ page }) => {
    await page.goto("/customize");

    const customOrderForm = page.locator(".form-card").first();

    await customOrderForm.getByLabel("Name").fill("Playwright Tester");
    await customOrderForm.getByLabel("Email").fill("tester@example.com");
    await customOrderForm.getByLabel("Product Type").selectOption({ label: "Flowers" });
    await customOrderForm.getByLabel("Customization Details").fill("Pastel tones please.");

    await customOrderForm.getByRole("button", { name: "Request Custom Order" }).click();
    
    // Verify fallback error toast
    await expect(
      customOrderForm.getByText("Custom orders are not available right now. Please try again soon.")
    ).toBeVisible();
  });
});
