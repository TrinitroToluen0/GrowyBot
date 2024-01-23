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

    log(level, color, ...messages) {
        this.updateTimestamp();
        const fullMessages = messages.map((message) => (message instanceof Error ? message.stack : message));
        const consoleMessages = DEV_MODE ? fullMessages : messages;
        const messageToConsole = consoleMessages.join(" ");
        const messageToFile = fullMessages.join(" ").replace(/\x1b\[[0-9;]*m/g, ""); // Limpia los códigos de escape
        console.log(`${c.reset}[${color}${level}${c.reset}] ${c.bright}${c.gray}${this.timestamp}${c.reset} ${messageToConsole}`);
        this.writeToLogFile(messageToFile, level);
    }

    info(...messages) {
        this.log("INFO", c.cyan, ...messages);
    }

    error(...messages) {
        this.log("ERROR", c.red, ...messages);
    }

    warn(...messages) {
        this.log("WARN", c.yellow, ...messages);
    }

    debug(...messages) {
        this.log("DEBUG", c.magenta, ...messages);
    }

    http(...messages) {
        this.log("HTTP", c.green, ...messages);
    }
}

const logger = new Logger();

module.exports = logger;
