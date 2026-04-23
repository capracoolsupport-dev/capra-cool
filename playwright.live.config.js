import fs from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const isWindows = process.platform === "win32";
const devCommand = isWindows
  ? "npm.cmd run dev -- --host 127.0.0.1 --port 4174 --strictPort"
  : "npm run dev -- --host 127.0.0.1 --port 4174 --strictPort";

function readDotEnvFile() {
  if (!fs.existsSync(".env")) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(".env", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
        return [key, value];
      })
  );
}

const dotenvValues = readDotEnvFile();
const hasRealSupabaseUrl =
  dotenvValues.VITE_SUPABASE_URL &&
  !dotenvValues.VITE_SUPABASE_URL.includes("your-project-ref.supabase.co");
const hasRealSupabaseAnonKey =
  dotenvValues.VITE_SUPABASE_ANON_KEY &&
  !dotenvValues.VITE_SUPABASE_ANON_KEY.includes("your-anon-key");

if (!hasRealSupabaseUrl || !hasRealSupabaseAnonKey) {
  throw new Error(
    "Live Playwright tests require real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values in .env. Replace the placeholder Supabase values before running `npm.cmd run test:e2e:live`."
  );
}

export default defineConfig({
  testDir: "./tests/e2e-live",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  timeout: 40_000,
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "on-first-retry"
  },
  webServer: {
    command: devCommand,
    port: 4174,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 7"]
      }
    }
  ]
});
