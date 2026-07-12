const { createPage } = require("../../browser");
const parseRideCards = require("./parser");
const { choosePickup, chooseDestination } = require("./search");

async function getOlaFare(from, to) {
    const page = await createPage("ola", "https://book.olacabs.com/home");

    try {
        console.log("\n=================================");
        console.log("OLA SEARCH STARTED");
        console.log("=================================");
        console.log("FROM :", from);
        console.log("TO   :", to);

        console.log("\nWaiting for Ola home...");

        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(3000);

        let fromCard = page.locator(".row-sm.ptr").filter({
            has: page.locator(".label", {
                hasText: "FROM",
            }),
        });

        let loaded = await fromCard.isVisible().catch(() => false);

        if (!loaded) {
            console.log("Home page not loaded correctly.");
            console.log("Reloading...");

            await page.reload({
                waitUntil: "domcontentloaded",
            });

            await page.waitForTimeout(3000);

            fromCard = page.locator(".row-sm.ptr").filter({
                has: page.locator(".label", {
                    hasText: "FROM",
                }),
            });

            loaded = await fromCard.isVisible().catch(() => false);

            if (!loaded) {
                throw new Error("Ola home page failed to load.");
            }

            console.log("✓ Reload fixed the page.");
        }

        console.log("Current URL:");
        console.log(page.url());

        await choosePickup(page, from);

        await chooseDestination(page, to);

        console.log("\nWaiting for ride results...");

        await page.waitForSelector(".card.car-cont .cab-row.ptr", {
            timeout: 3000,
        });

        const rides = await parseRideCards(page);

        return rides;
    } catch (err) {
        console.log("\n=================================");
        console.log("OLA SCRAPER FAILED");
        console.log("=================================");

        console.error(err);

        try {
            console.log("Saving failure screenshot...");

            await page.screenshot({
                path: "ola-error.png",
                fullPage: true,
            });

            console.log("Saved ola-error.png");
        } catch {
            console.log("Couldn't save screenshot.");
        }

        throw err;
    } finally {
        console.log("\nClosing page...");

        try {
            await page.close();
        } catch { }
    }
}

module.exports = {
    getOlaFare,
};
