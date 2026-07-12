const { chromium } = require("playwright");
const path = require("path");
const readline = require("readline");

const STATE = path.join(__dirname, "../../storage/rapido.json");

async function loginRapido() {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });

    const context = await browser.newContext({
        permissions: ["geolocation"],
        geolocation: {
            latitude: 28.4597,
            longitude: 77.0282
        }
    });

    const page = await context.newPage();

    console.log("Opening Rapido...");

    await page.goto("https://www.rapido.bike/", {
        waitUntil: "domcontentloaded"
    });

    console.log("");
    console.log("================================");
    console.log("Login to Rapido manually");
    console.log("================================");
    console.log("");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    await new Promise(resolve =>
        rl.question(
            "After login is complete, press ENTER...",
            () => {
                rl.close();
                resolve();
            }
        )
    );

    await context.storageState({
        path: STATE
    });

    console.log("");
    console.log("Storage saved:");
    console.log(STATE);

    await browser.close();
}

loginRapido();