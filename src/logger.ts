import chalk from 'chalk';
import logger from 'fancy-log'

class Logger {
    protected padding = chalk.redBright("EXCEPTION").length + 3;

    protected log(type: LogType, ...args: any[]) {
        const logMessage: { [key in LogType]: string } = {
            "info":         `[${chalk.cyan("INFO")}]`.padEnd(this.padding),
            "debug":        `[${chalk.white("DEBUG")}]`.padEnd(this.padding),
            "error":        `[${chalk.red("ERROR")}]`.padEnd(this.padding),
            "warn":         `[${chalk.yellow("WARN")}]`.padEnd(this.padding),
            "fatal":        `[${chalk.redBright("FATAL")}]`.padEnd(this.padding),
            "exception":    `[${chalk.redBright("EXCEPTION")}]`.padEnd(this.padding),
            "success":      `[${chalk.green("SUCCESS")}]`.padEnd(this.padding)
        }

        logger(`${logMessage[type]}`, args.join(" "));
    }

    info(...args: any[]) {
        this.log(LogType.Info, args);
    }

    debug(...args: any[]) {
        this.log(LogType.Debug, args);
    }

    warn(...args: any[]) {
        this.log(LogType.Warn, args);
    }

    fatal(...args: any[]) {
        this.log(LogType.Fatal, args);
    }

    exception(...args: any[]) {
        this.log(LogType.Exception, args);
    }

    error(...args: any[]) {
        this.log(LogType.Error, args);
    }

    success(...args: any[]) {
        this.log(LogType.Success, args)
    }
}

enum LogType {
    Info = "info",
    Debug = "debug",
    Warn = "warn",
    Error = "error",
    Exception = "exception",
    Fatal = "fatal",
    Success = "success"
}

const Log = new Logger();

export default Log;