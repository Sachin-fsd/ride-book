async function parseRideCards(page) {
    console.log("\nParsing Rapido rides...");

    const cards = page.locator(".fare-estimate-wrapper .card-wrap");

    const count = await cards.count();

    console.log("Ride cards:", count);

    const rides = [];

    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);

        try {
            const vehicle = (
                await card.locator(".card-content").textContent()
            )?.trim() || null;

            const priceText = (
                await card.locator("xpath=./div[last()]").textContent()
            )?.trim() || "";

            const image =
                await card.locator("img").getAttribute("src");

            let price = null;
            let originalPrice = null;

            const nums = priceText.match(/\d+/g);

            if (nums) {
                if (nums.length === 1) {
                    price = Number(nums[0]);
                    originalPrice = Number(nums[0]);
                } else {
                    price = Number(nums[0]);
                    originalPrice = Number(nums[1]);
                }
            }

            rides.push({
                platform: "rapido",
                vehicle,
                capacity: null,
                eta: null,
                description: null,
                price,
                originalPrice,
                discount: null,
                currency: "INR",
                image,
                priceText,
            });

            console.log(
                `✓ ${vehicle} | ${priceText}`
            );

        } catch (err) {
            console.log(`Skipping card ${i + 1}`);
        }
    }

    console.log(`Parsed ${rides.length} rides.`);

    return rides;
}

module.exports = parseRideCards;