// const fs = require("fs");
async function parseRideCards(page) {
    // console.log("\n==============================");
    // console.log("Parsing Ola rides...");
    // console.log("==============================");
    await
        await page.waitForSelector(".card.car-cont .cab-row.ptr");
    // await page.screenshot({
    //     path: "ola-before-parse.png",
    //     fullPage: true,
    // });
    // const bodyHtml = await page.$eval("body", (body) => body.innerHTML);
    // const firstCard = await page.$eval(
    //     ".card.car-cont .cab-row.ptr",
    //     (el) => el.outerHTML
    // );

    // console.log(firstCard);
    // fs.writeFileSync("./ola.html", firstCard, "utf8");
    const rides = await page.$$eval(".card.car-cont .cab-row.ptr", (rows) => {
        return rows.map((row) => {
            const vehicle =
                row.querySelector(".cab-name")?.childNodes[0]?.textContent?.trim() ??
                null;

            const priceText =
                row.querySelector(".price span")?.textContent?.trim() ?? "";
            const fare = priceText ? Number(priceText.replace(/[^\d]/g, "")) : null;

            const eta = row.querySelector(".av-time")?.textContent?.trim() ?? null;

            const description =
                row.querySelector(".desc")?.textContent?.trim() ?? null;

            const image = row.querySelector("img")?.src ?? null;

            return {
                platform: "ola",
                vehicle,
                capacity: null,
                eta,
                arrivalTime: null,
                description,
                price: fare,
                originalPrice: fare,
                discount: null,
                currency: "INR",
                image,
            };
        });
    });
    // console.log(rides);
    // console.table(rides);
    return rides;
}

module.exports = parseRideCards;
