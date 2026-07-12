const express = require("express");
const cors = require("cors")
const {
    initBrowser,

    closeBrowser,
} = require("./browser");

const { searchAll } = require("./platforms");

const app = express();

app.use(express.json());
app.use(cors())
const PORT = 3000;

app.get("/health", (req, res) => {
    res.json({
        success: true,
    });
});

app.post("/api/rides/search", async (req, res) => {
    try {
        const {
            from,

            to,
        } = req.body;

        if (!from || !to) {
            return res.status(400).json({
                success: false,

                error: "from and to are required",
            });
        }

        const rides = await searchAll(
            from,

            to,
        );

        res.json({
            success: true,

            rides,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,

            error: err.message,
        });
    }
});

(async () => {
    try {
        await initBrowser("uber");

        await initBrowser("ola");

        await initBrowser("rapido");

        app.listen(
            PORT,

            () => {
                console.log(`Server running on ${PORT}`);
            },
        );
    } catch (err) {
        console.error(err);

        process.exit(1);
    }
})();

process.on("SIGINT", async () => {
    await closeBrowser();

    process.exit(0);
});

process.on("SIGTERM", async () => {
    await closeBrowser();

    process.exit(0);
});
