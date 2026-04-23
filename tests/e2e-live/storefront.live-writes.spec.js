import { expect, test } from "@playwright/test";

test.describe("live Supabase write flows", () => {
  test.skip(
    process.env.PLAYWRIGHT_ALLOW_SUPABASE_WRITES !== "1",
    "Set PLAYWRIGHT_ALLOW_SUPABASE_WRITES=1 to run write tests against a staging Supabase project."
  );

  function buildUniqueToken() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  test("newsletter signup can submit to Supabase", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-status", "ready");
    await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-source", "supabase");

    const footerForm = page.locator(".newsletter-form");
    const email = `playwright-newsletter-${buildUniqueToken()}@example.com`;

    await footerForm.getByPlaceholder("Enter your email").fill(email);
    await footerForm.getByRole("button", { name: "Join" }).click();

    await expect(
      footerForm.getByText("Thanks. You are on the list for new handmade drops.")
    ).toBeVisible();
  });

  test("contact form can submit to Supabase", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-status", "ready");
    await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-source", "supabase");

    const token = buildUniqueToken();
    const contactForm = page.locator(".form-card").first();

    await contactForm.getByLabel("Name").fill(`Playwright Contact ${token}`);
    await contactForm.getByLabel("Email").fill(`playwright-contact-${token}@example.com`);
    await contactForm.getByLabel("Phone Number (optional)").fill("9999999999");
    await contactForm
      .getByLabel("Message")
      .fill(`Playwright live contact submission ${token} to verify Supabase insert access.`);

    await contactForm.getByRole("button", { name: "Send Message" }).click();

    await expect(
      contactForm.getByText("Thanks for reaching out. We will get back to you soon.")
    ).toBeVisible();
  });

  test("custom order form can submit to Supabase", async ({ page }) => {
    await page.goto("/customize");
    await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-status", "ready");
    await expect(page.locator("#main-content")).toHaveAttribute("data-storefront-source", "supabase");

    const token = buildUniqueToken();
    const customOrderForm = page.locator(".form-card").first();

    await customOrderForm.getByLabel("Name").fill(`Playwright Custom ${token}`);
    await customOrderForm.getByLabel("Email").fill(`playwright-custom-${token}@example.com`);
    await customOrderForm.getByLabel("Product Type").selectOption({ index: 1 });
    await customOrderForm
      .getByLabel("Customization Details")
      .fill(`Playwright live custom order ${token} to verify Supabase insert access.`);

    await customOrderForm.getByRole("button", { name: "Request Custom Order" }).click();

    await expect(
      customOrderForm.getByText("Your custom order request is in. We will review it and get back to you soon.")
    ).toBeVisible();
  });
});
