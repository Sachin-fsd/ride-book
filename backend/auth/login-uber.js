const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
    // Create auth folder if it doesn't exist
    const authDir = path.join(__dirname, "auth");

    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir);
    }

    console.log("Launching browser...");

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100, // Slow down actions slightly for visibility
    });

    const context = await browser.newContext();

    const page = await context.newPage();

    console.log("Opening Uber...");

    // We'll change this URL later if needed based on your country
    await page.goto("https://m.uber.com/", {
        waitUntil: "domcontentloaded",
    });

    console.log("");
    console.log("=========================================");
    console.log("Login manually.");
    console.log("Complete OTP if required.");
    console.log("Wait until you reach Uber's home page.");
    console.log("");
    console.log("DO NOT close the browser.");
    console.log("When finished, come back to the terminal");
    console.log("and press ENTER.");
    console.log("=========================================");

    process.stdin.resume();

    await new Promise((resolve) => {
        process.stdin.once("data", resolve);
    });

    await context.storageState({
        path: "./storage/uber.json",
    });

    console.log("");
    console.log("✅ Login session saved!");
    console.log("Saved at: auth/uber.json");

    await browser.close();

    process.exit(0);
})();