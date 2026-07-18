const S = require("./selectors");

async function recover(page) {

    // console.log("\n======================");
    // console.log("Recovering Browser");
    // console.log("======================");

    if (page.isClosed()) {
        throw new Error("Browser closed.");
    }

    //
    // Close autocomplete if open
    //

    await page.keyboard.press("Escape");

    await page.waitForTimeout(300);

    //
    // Popup 1
    //

    const confirm = page.getByRole("button", {
        name: S.CONFIRM_BUTTON,
    });

    if (await confirm.count()) {

        // console.log("Closing Confirm popup");

        await confirm.click();

        await page.waitForTimeout(1000);
    }

    //
    // Popup 2
    //

    const cont = page.getByRole("button", {
        name: S.CONTINUE_BUTTON,
    });

    if (await cont.count()) {

        // console.log("Closing Continue popup");

        await cont.click();

        await page.waitForTimeout(1000);
    }

    const url = page.url();

    // console.log("Current URL:", url);

    //
    // Already on ride page
    //

    if (url.includes("/product-selection")) {

        // console.log("State : RESULTS");

        return "RESULTS";

    }

    //
    // Searching page
    //

    if (url.includes("/drop")) {

        // console.log("State : SEARCH");

        return "SEARCH";

    }

    //
    // Home
    //

    if (url.includes("/home")) {

        // console.log("State : HOME");

        return "HOME";

    }

    //
    // Unknown
    //

    // console.log("Unknown page.");

    // console.log("Navigating Home.");

    await page.goto(
        "https://m.uber.com/go/home",
        {
            waitUntil: "domcontentloaded",
        }
    );

    return "HOME";
}

module.exports = recover;