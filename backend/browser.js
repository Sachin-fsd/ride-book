const { chromium } = require("playwright");
const path = require("path");

const browsers = {};

async function initBrowser(platform) {
    if (browsers[platform]) return;

    // console.log(`Launching ${platform} browser...`);

    const browser = await chromium.launch({
        headless: true,
        args: [
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--no-sandbox",
        ],
    });

    browsers[platform] = {
        browser,
    };

    // console.log(`${platform} initialized.`);
}

async function createPage(platform, url) {
    const instance = browsers[platform];

    if (!instance) {
        throw new Error(`${platform} browser not initialized.`);
    }

    const context = await instance.browser.newContext({
        storageState: path.join(__dirname, "storage", `${platform}.json`),
        // recordVideo: {
        //     dir: "./videos",
        //     size: { width: 1280, height: 720 },
        // },
        permissions: ["geolocation"],

        geolocation: {
            latitude: 28.4597,
            longitude: 77.0282,
        },

        viewport: {
            width: 1440,
            height: 900,
        },
    });

    const page = await context.newPage();

    // console.log(`Opening ${url}`);

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    return page;
}

async function closeBrowser(platform) {
    if (platform) {
        if (browsers[platform]) {
            // console.log(`Closing ${platform} browser`);

            await browsers[platform].browser.close();

            delete browsers[platform];
        }

        return;
    }

    for (const key of Object.keys(browsers)) {
        // console.log(`Closing ${key} browser`);

        await browsers[key].browser.close();
    }
}

module.exports = {
    initBrowser,
    createPage,
    closeBrowser,
};
