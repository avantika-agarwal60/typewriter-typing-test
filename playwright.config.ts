import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "tests",
    use: { baseURL: "http://localhost:5500" },
    webServer: { command: "npx serve -l 5500", url: "http://localhost:5500", reuseExistingServer: !process.env.CI },
});