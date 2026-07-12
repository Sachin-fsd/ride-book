const S = require("./selectors");

async function chooseLocation(page, location, isPickup) {
    console.log("\n==================================");
    console.log(isPickup ? "Selecting Pickup" : "Selecting Destination");
    console.log("==================================");

    const input = page.locator(isPickup ? S.PICKUP_INPUT : S.DROPOFF_INPUT);

    await input.waitFor({
        state: "visible",
        timeout: 30000,
    });

    console.log("✓ Input visible");

    await input.click();

    await input.fill("");

    await input.type(location, {
        delay: 70,
    });

    console.log("Typed:", location);

    const cards = page.locator(S.SUGGESTION_CARD);

    await cards.first().waitFor({
        state: "visible",
        timeout: 30000,
    });

    const count = await cards.count();

    console.log("Suggestions:", count);

    if (!count) {
        throw new Error("No suggestions found.");
    }

    const first = cards.first();

    await first.scrollIntoViewIfNeeded();

    await first.hover();

    await page.waitForTimeout(800);
    // await page.pause();
    await first.click({
        force: true,
    });

    console.log("✓ Suggestion clicked");

    await cards.first().waitFor({
        state: "hidden",
        timeout: 10000,
    });
}

async function choosePickup(page, location) {
    return chooseLocation(page, location, true);
}

async function chooseDestination(page, location) {
    return chooseLocation(page, location, false);
}

async function clickBookRide(page) {
    console.log("\nClicking Book Ride...");

    await Promise.all([
        page.waitForURL("**m.rapido.bike/**"),
        page.locator(S.SEARCH_BUTTON).click(),
    ]);

    console.log("✓ Redirected to results page");
}

module.exports = {
    choosePickup,
    chooseDestination,
    clickBookRide,
};
