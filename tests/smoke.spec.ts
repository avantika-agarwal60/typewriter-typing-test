import { test, expect } from "@playwright/test";

test.skip(!process.env.BASE_URL, "set BASE_URL to run against the deployed site");

test("deployed site loads a passage", async ({ page }) => {
    await page.goto("");
    await expect(page.locator("#passage span").first()).toBeVisible({ timeout: 30_000 });
});