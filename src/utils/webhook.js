const express = require("express");
const app = express();
const logger = require("./logger.js");
const { EXPRESS_PORT } = require("../config.js");

app.post("/vote", (req, res) => {});

app.listen(EXPRESS_PORT, () => {
    logger.info(`Express server listening on port ${EXPRESS_PORT}`);
});
