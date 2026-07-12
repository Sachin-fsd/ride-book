const S = require("./selectors");

async function parseRideCards(page) {
    console.log("\n======================");
    console.log("Parsing Ride Cards");
    console.log("======================");

    await page.waitForSelector(S.RIDE_CARD, {
        timeout: 30000,
    });

    const rides = await page.$$eval(S.RIDE_CARD, (cards) => {
        return cards.map((card) => {
            //--------------------------------------------------
            // Ride ID
            //--------------------------------------------------

            const id = card.dataset.itemid || null;

            //--------------------------------------------------
            // Image
            //--------------------------------------------------

            const image = card.querySelector("img")?.src || null;

            //--------------------------------------------------
            // Vehicle
            //--------------------------------------------------

            let vehicle = null;

            const firstP = card.querySelector("p");

            if (firstP) {
                vehicle = firstP.childNodes[0]?.textContent?.trim() || null;
            }

            //--------------------------------------------------
            // Capacity
            //--------------------------------------------------

            let capacity = null;

            const spans = firstP ? [...firstP.querySelectorAll("span")] : [];

            for (const span of spans) {
                const value = span.innerText.trim();

                if (/^\d+$/.test(value)) {
                    capacity = Number(value);

                    break;
                }
            }

            //--------------------------------------------------
            // ETA
            //--------------------------------------------------

            let eta = null;

            let arrivalTime = null;

            const etaNode = card.querySelector(
                '[data-testid="product_selector.list_item.eta_string"]',
            );

            if (etaNode) {
                const txt = etaNode.innerText;

                const parts = txt.split("•");

                eta = parts[0]?.trim() || null;

                arrivalTime = parts[1]?.trim() || null;
            }

            //--------------------------------------------------
            // Description
            //--------------------------------------------------

            let description = null;

            const divs = [...card.querySelectorAll("div")];

            for (const div of divs) {
                const txt = div.innerText.trim();

                if (
                    txt.includes("ride") ||
                    txt.includes("rides") ||
                    txt.includes("car") ||
                    txt.includes("cars")
                ) {
                    description = txt;

                    break;
                }
            }

            //--------------------------------------------------
            // Prices
            //--------------------------------------------------

            const prices = [...card.querySelectorAll("*")]
                .map((el) => el.innerText?.trim())
                .filter((text) => text && /^₹[\d,]+(\.\d+)?$/.test(text));

            let price = null;

            let originalPrice = null;

            if (prices.length) {
                price = Number(prices[0].replace(/[₹,]/g, ""));
            }

            if (prices.length > 1) {
                originalPrice = Number(prices[1].replace(/[₹,]/g, ""));
            }

            //--------------------------------------------------
            // Discount
            //--------------------------------------------------

            let discount = null;

            if (price !== null && originalPrice !== null) {
                discount = Number((originalPrice - price).toFixed(2));
            }

            //--------------------------------------------------

            return {
                platform: "uber",

                vehicle,

                capacity,

                eta,

                arrivalTime,

                description,

                price,

                originalPrice,

                discount,

                currency: "INR",

                image,
            };
        });
    });

    console.log("Ride Count:", rides.length);

    console.table(rides);

    return rides;
}

module.exports = parseRideCards;
