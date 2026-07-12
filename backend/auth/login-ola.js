const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {

    const browser = await chromium.launch({

        headless: false,

        slowMo: 50,

    });

    const context = await browser.newContext({

        viewport: {

            width: 1440,

            height: 900,

        },

    });

    const page = await context.newPage();

    console.log("Opening Ola...");

    await page.goto(
        "https://book.olacabs.com/",
        {
            waitUntil: "domcontentloaded",
        }
    );

    console.log("\n====================================");
    console.log("Please login manually.");
    console.log("After login reaches the booking page,");
    console.log("press ENTER here.");
    console.log("====================================\n");

    process.stdin.resume();

    process.stdin.once("data", async () => {

        const authDir = path.join(__dirname, "storage");

        if (!fs.existsSync(authDir)) {

            fs.mkdirSync(authDir);

        }

        await context.storageState({

            path: path.join(authDir, "ola.json"),

        });

        console.log("Saved auth/ola.json");

        await browser.close();

        process.exit(0);

    });

})();