const c = require("./colors.js");
const { DEV_MODE } = require("../config.js");
const fs = require("fs");

class Logger {
    constructor() {
        this.timestamp = null;
        this.updateTimestamp();
    }

    updateTimestamp() {
        this.timestamp = new Date().toLocaleString("es-CO", { hour12: false });
    }

    writeToLogFile(message, level) {
        const formattedMessage = `[${level}] ${this.timestamp} ${message}\n`;
        const logPath = DEV_MODE === true ? "./logs/dev.log" : "./logs/prod.log";

        fs.appendFile(logPath, formattedMessage, (err) => {
            if (err) {
                console.error(`Failed to write to log file: ${err}`);
            }
        });
    }

    log(level, color, message) {
        this.updateTimestamp();
        console.log(`[${color}${level}${c.reset}] ${c.bright}${c.gray}${this.timestamp}${c.reset} ${message}`);
        this.writeToLogFile(message, level);
    }

    info(message) {
        this.log("INFO", c.cyan, message);
    }

    error(message) {
        this.log("ERROR", c.red, message);
    }

    warn(message) {
        this.log("WARN", c.yellow, message);
    }

    debug(message) {
        this.log("DEBUG", c.magenta, message);
    }

    http(message) {
        this.log("HTTP", c.green, message);
    }
}

const logger = new Logger();

module.exports = logger;
