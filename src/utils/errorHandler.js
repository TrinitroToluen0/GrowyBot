const logger = require("./logger");

process.on("unhandledRejection", (reason) => {
    if (reason.stack) {
        logger.error(reason.stack);
    } else {
        logger.error("Unhandled rejection");
    }
});
process.on("uncaughtException", (error) => {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error("Uncaught exception");
    }
});
process.on("uncaughtExceptionMonitor", (error) => {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error("Uncaught exception monitor");
    }
});

logger.info("Error handler working");
