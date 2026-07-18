async function recover(page) {
    // console.log("\nChecking Rapido state...");

    if (await page.locator(".fare-estimate-wrapper").isVisible().catch(() => false)) {
        // console.log("Current state: RESULTS");
        return "RESULTS";
    }

    if (await page.locator('input[name="pickup"]').isVisible().catch(() => false)) {
        // console.log("Current state: HOME");
        return "HOME";
    }

    // console.log("Unknown state.");

    // console.log("Navigating back to home...");

    await page.goto("https://m.rapido.bike/home", {
        waitUntil: "domcontentloaded",
    });

    await page.waitForSelector('input[name="pickup"]', {
        timeout: 30000,
    });

    // console.log("Recovered to HOME");

    return "HOME";
}

module.exports = recover;