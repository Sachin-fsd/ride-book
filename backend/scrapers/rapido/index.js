const { createPage } = require("../../browser");
const { choosePickup, chooseDestination, clickBookRide } = require("./search");
const parseRideCards = require("./parser");

async function waitForResults(page) {
    console.log("\nWaiting for Rapido results...");

    await page.waitForLoadState("domcontentloaded");

    await page.waitForSelector(".fare-estimate-wrapper", {
        state: "visible",
        timeout: 30000,
    });

    await page.waitForSelector(".fare-estimate-wrapper .card-wrap", {
        state: "visible",
        timeout: 30000,
    });

    console.log("Current URL:");
    console.log(page.url());

    console.log("✓ Ride cards loaded");
}

async function getRapidoFare(from, to) {
    const page = await createPage("rapido", "https://www.rapido.bike/");

    try {
        console.log("\n=================================");
        console.log("RAPIDO SEARCH STARTED");
        console.log("=================================");
        console.log("FROM :", from);
        console.log("TO   :", to);

        await page.waitForLoadState("domcontentloaded");

        await page.waitForTimeout(1500);

        await choosePickup(page, from);

        await chooseDestination(page, to);

        await clickBookRide(page);

        await waitForResults(page);

        const rides = await parseRideCards(page);

        console.log("\n=================================");
        console.log("RAPIDO SEARCH FINISHED");
        console.log("=================================");

        return rides;
    } catch (err) {
        console.log("\n=================================");
        console.log("RAPIDO SCRAPER FAILED");
        console.log("=================================");

        console.error(err);

        try {
            await page.screenshot({
                path: "rapido-error.png",
                fullPage: true,
            });
        } catch { }

        throw err;
    } finally {
        console.log("\nClosing page...");

        try {
            await page.close();
        } catch { }
    }
}

module.exports = {
    getRapidoFare,
};
