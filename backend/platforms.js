const { getUberFare } = require("./scrapers/uber");
const { getOlaFare } = require("./scrapers/ola");
const { getRapidoFare } = require("./scrapers/rapido");

async function searchAll(from, to) {
    const tasks = [
        getUberFare(from, to),
        getOlaFare(from, to),
        getRapidoFare(from, to),
    ];

    const results = await Promise.allSettled(tasks);

    const rides = [];

    for (const result of results) {
        if (result.status === "fulfilled") {
            rides.push(...result.value);
        } else {
            console.error(result.reason);
        }
    }

    return rides;
}

module.exports = { searchAll };