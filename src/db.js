const { MONGODB_URI } = require("./config.js");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

async function connectDB() {
    try {
        const db = await mongoose.connect(MONGODB_URI);
        logger.info(`Connected to database: ${db.connection.db.databaseName}`);
    } catch (ERROR) {
        logger.error(error);
    }
}

connectDB();
