import { expect, test } from "@playwright/test";

test.describe("Admin Access", () => {
  test("protected admin routes show setup guidance without Supabase credentials", async ({ page }) => {
    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { name: "Connect Supabase to unlock the admin workspace." })
    ).toBeVisible();
  });

  test("admin login explains the missing credentials state", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(
      page.getByRole("heading", { name: "Supabase credentials are required first." })
    ).toBeVisible();
    await expect(
      page.getByText("Add your Supabase environment values before trying to sign in to the admin workspace.")
    ).toBeVisible();
  });
});
