import { expect, test } from "@playwright/test";

test.describe("Admin Access", () => {
  test("protected admin route redirects guests to login", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: "Sign in to the studio dashboard." })).toBeVisible();
  });

  test("admin login renders the production sign-in form", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(page.getByLabel("Admin Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });
});
