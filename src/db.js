const { MONGODB_URI } = require("./config.js");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

async function connectDB(uri) {
    if (!uri) {
        throw new Error("MongoDB URI must be provided.");
    }
    try {
        const db = await mongoose.connect(uri);
        logger.info(`Connected to database: ${db.connection.db.databaseName}`);
    } catch (error) {
        logger.error("Connection to mongoDB failed: ", error);
        process.exit(1);
    }
}

connectDB(MONGODB_URI);
