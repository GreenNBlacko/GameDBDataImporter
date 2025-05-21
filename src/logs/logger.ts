import chalk from 'chalk';
import { env } from '../config';

export enum LogType {
    Info      = "info",
    Debug     = "debug",
    Warn      = "warn",
    Error     = "error",
    Exception = "exception",
    Fatal     = "fatal",
    Success   = "success"
}

const LOG_LEVELS: Record<typeof env.LOG_LEVEL, LogType[]> = {
    INFO:    [LogType.Info, LogType.Success, LogType.Fatal],
    WARNING: [LogType.Info, LogType.Success, LogType.Fatal, LogType.Warn],
    ERROR:   [LogType.Info, LogType.Success, LogType.Fatal, LogType.Warn, LogType.Error, LogType.Exception],
    DEBUG:   Object.values(LogType)
}

abstract class Logger {
    private _logLevel: "INFO" | "WARNING" | "ERROR" | "DEBUG";

    constructor(logLevel?: "INFO" | "WARNING" | "ERROR" | "DEBUG") {
        this._logLevel = logLevel ?? env.LOG_LEVEL as "INFO" | "WARNING" | "ERROR" | "DEBUG";
    }

    private log(type: LogType, ...args: any[]) {
        if (!LOG_LEVELS[this._logLevel].includes(type)) return;

        const INFO      = chalk.cyan("INFO");
        const DEBUG     = chalk.white("DEBUG");
        const WARN      = chalk.hex("D3B400")("WARN");
        const ERROR     = chalk.red("ERROR");
        const EXCEPTION = chalk.redBright("EXCEPTION");
        const FATAL     = chalk.redBright("FATAL");
        const SUCCESS   = chalk.green("SUCCESS");

        const logMessage: { [key in LogType]: string } = {
            [LogType.Info      ]: `[${INFO}]     `,
            [LogType.Debug     ]: `[${DEBUG}]    `,
            [LogType.Warn      ]: `[${WARN}]     `,
            [LogType.Error     ]: `[${ERROR}]    `,
            [LogType.Exception ]: `[${EXCEPTION}]`,
            [LogType.Fatal     ]: `[${FATAL}]    `,
            [LogType.Success   ]: `[${SUCCESS}]  `
        }

        this.output(`${logMessage[type]}  ┃`, ...args);
    }

    protected abstract output(...args: any[]): void;

    info      (...args: any[]) { this.log(LogType.Info,      ...args); }
    debug     (...args: any[]) { this.log(LogType.Debug,     ...args); }
    warn      (...args: any[]) { this.log(LogType.Warn,      ...args); }
    fatal     (...args: any[]) { this.log(LogType.Fatal,     ...args); }
    exception (...args: any[]) { this.log(LogType.Exception, ...args); }
    error     (...args: any[]) { this.log(LogType.Error,     ...args); }
    success   (...args: any[]) { this.log(LogType.Success,   ...args); }
}

export default Logger;
