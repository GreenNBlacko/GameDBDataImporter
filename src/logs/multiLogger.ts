// logs/multiLogger.ts
import Logger, { LogType } from './logger';

export default class MultiLogger extends Logger {
    private readonly loggers: Logger[];

    constructor(...loggers: Logger[]) {
        super();
        this.loggers = loggers;
    }

    protected output(...args: any[]): void {
        for (const logger of this.loggers) {
            logger['output'](...args);
        }
    }
}
