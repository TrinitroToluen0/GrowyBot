const { MONGODB_URI } = require("./config.js");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

async function connectDB(uri) {
    try {
        if (!uri) {
            throw new Error("MongoDB URI must be provided.");
        }
        const db = await mongoose.connect(uri);
        logger.info(`Connected to database: ${db.connection.db.databaseName}`);
    } catch (error) {
        logger.error("Connection to mongoDB failed: ", error);
        process.exit();
    }
}

connectDB(MONGODB_URI);
