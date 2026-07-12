const { createPage } = require("../../browser");

const recover = require("./recovery");
const parseRideCards = require("./parser");

const {
    choosePickup,
    chooseDestination,
    clickSearch,
} = require("./search");

async function handleOptionalPopups(page) {
    console.log("\nChecking Optional Popups...");

    //
    // Popup 1
    //

    const confirm = page.getByRole("button", {
        name: "Confirm",
    });

    if (await confirm.isVisible().catch(() => false)) {
        console.log("Intercity popup detected.");

        await confirm.click();

        console.log("✓ Confirm clicked");

        await page.waitForTimeout(1500);
    }

    //
    // Popup 2
    //

    const cont = page.getByRole("button", {
        name: "Continue",
    });

    if (await cont.isVisible().catch(() => false)) {
        console.log("Pickup time popup detected.");

        await cont.click();

        console.log("✓ Continue clicked");

        await page.waitForTimeout(2500);
    }
}

async function getUberFare(from, to) {
    const page = await createPage("uber", "https://m.uber.com/go/home");

    try {
        console.log("\n=================================");
        console.log("Uber Search Started");
        console.log("=================================");

        console.log("FROM :", from);
        console.log("TO   :", to);

        //
        // Recover
        //

        const state = await recover(page);

        console.log("Recovered State :", state);

        //
        // Pickup
        //

        await choosePickup(page, from);
        await page.waitForTimeout(2000);

        await chooseDestination(page, to);
        await page.waitForTimeout(2000);

        //
        // Destination
        //

        // await openDestination(page, state);
        // await page.waitForTimeout(2000);

        // await chooseLocation(page, to, 1);
        // await page.waitForTimeout(2000);

        //
        // Search
        //

        await clickSearch(page);

        //
        // Optional dialogs
        //

        await handleOptionalPopups(page);

        //
        // Parse rides
        //

        const rides = await parseRideCards(page);

        console.log("\n=================================");
        console.log("Uber Search Finished");
        console.log("=================================");

        return rides;
    } catch (err) {
        console.log("\n=================================");
        console.log("SCRAPER FAILED");
        console.log("=================================");

        console.error(err);

        try {
            console.log("Current URL:");

            console.log(page.url());

            await page.screenshot({
                path: "error.png",

                fullPage: true,
            });

            console.log("Screenshot saved.");
        } catch {
            console.log("Couldn't capture screenshot.");
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
    getUberFare,
};
