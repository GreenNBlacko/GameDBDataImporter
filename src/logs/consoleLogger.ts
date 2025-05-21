import logger from "fancy-log";
import Logger from "./logger";

export default class ConsoleLogger extends Logger {
    protected output(...args: any[]): void {
        logger(...args);
    }
}