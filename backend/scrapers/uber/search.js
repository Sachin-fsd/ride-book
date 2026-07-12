const S = require("./selectors");

async function closeChoosePlacePopup(page) {
    const popup = page.getByTestId("common.modal.title");

    if (await popup.isVisible().catch(() => false)) {
        console.log("Saved places popup detected.");

        await page.getByTestId("baseui-modal-close").click();

        await page.waitForTimeout(800);

        console.log("Popup closed.");
    }
}

async function chooseLocation(page, text, index) {
    console.log("Searching:", text);

    const input = page.locator(S.COMBOBOX).nth(index);

    await input.waitFor({
        state: "visible",
        timeout: 30000,
    });

    await input.scrollIntoViewIfNeeded();

    await input.click();

    await input.press("Control+A");
    await input.press("Backspace");

    await input.type(text, {
        delay: 70,
    });

    console.log("Typed.");

    await page.waitForTimeout(1000);

    await closeChoosePlacePopup(page);

    await page.waitForSelector(S.LOCATION_RESULT, {
        timeout: 30000,
    });

    await page.waitForTimeout(800);

    const results = page.locator(S.LOCATION_RESULT);
    const count = await results.count();

    console.log("Suggestions:", count);

    if (!count) {
        throw new Error("No suggestions found.");
    }

    let clicked = false;

    for (let i = 0; i < count; i++) {
        const item = results.nth(i);
        const textContent = ((await item.textContent()) || "").trim();

        if (
            textContent.includes("Saved places") ||
            textContent.includes("Add a new place") ||
            textContent.includes("Choose a place")
        ) {
            console.log("Skipping:", textContent);
            continue;
        }

        console.log("Selecting:", textContent);

        await item.click();

        clicked = true;
        break;
    }

    if (!clicked) {
        throw new Error("No valid location suggestion found.");
    }

    await closeChoosePlacePopup(page);

    console.log("Selected.");

    await page.waitForTimeout(1200);
}

async function choosePickup(page, location) {
    return chooseLocation(page, location, 0);
}

async function chooseDestination(page, location) {
    return chooseLocation(page, location, 1);
}

async function clickSearch(page) {
    console.log("Clicking Search...");

    const button = page.locator(S.SEARCH_BUTTON);

    await button.waitFor({
        state: "visible",
        timeout: 30000,
    });

    await button.click();

    console.log("Search clicked.");
}

module.exports = {
    choosePickup,
    chooseDestination,
    clickSearch,
};