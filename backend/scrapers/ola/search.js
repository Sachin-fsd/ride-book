const S = require("./selectors");

async function chooseLocation(page, location, isPickup) {
    // console.log("\n==================================");
    // console.log(isPickup ? "Selecting Pickup" : "Selecting Destination");
    // console.log("==================================");

    let row;

    if (isPickup) {
        // console.log("Opening pickup...");

        row = page.locator(".row-sm.ptr").filter({
            has: page.locator(".label", {
                hasText: "FROM",
            }),
        });
    } else {
        // console.log("Opening destination...");

        row = page.locator(".row-sm.ptr").filter({
            has: page.locator(".label", {
                hasText: "TO",
            }),
        });
    }

    await row.waitFor({
        state: "visible",
    });

    //
    // Click the visible value/placeholder inside that row
    //

    const clickable = row.locator(
        ".right.text.value:visible, .right.text.placeholder:visible",
    );

    await clickable.click();

    // console.log("✓ Modal opened");

    const input = page.locator("#addressInput");

    await input.waitFor();

    await input.click();

    // console.log("✓ Input clicked");

    if (isPickup) {
        await input.press("Control+A");
        await input.press("Backspace");

        // console.log("✓ Previous pickup cleared");
    }

    await input.type(location, {
        delay: 70,
    });

    // console.log("Typed:", location);

    await page.waitForSelector(".results-row");

    const firstCard = page.locator(".results-row .row.results").nth(1);

    await firstCard.waitFor({
        state: "visible",
    });

    // console.log("Clicking first suggestion...");

    await firstCard.click();

    // console.log("✓ First suggestion clicked");

    await input.waitFor({
        state: "hidden",
    });

    // console.log("✓ Modal closed");
}
async function choosePickup(page, location) {
    return chooseLocation(
        page,

        location,

        true,
    );
}

async function chooseDestination(page, location) {
    return chooseLocation(
        page,

        location,

        false,
    );
}

module.exports = {
    choosePickup,

    chooseDestination,
};
