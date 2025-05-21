import chalk from "chalk";
import Logger from "./logger"
import fs from 'fs';

export default class FileLogger extends Logger {
    private file: string;

    constructor(fileName: string, logLevel?: "INFO" | "WARNING" | "ERROR" | "DEBUG") {
        super(logLevel);
        this.file = fileName;

        if(fs.existsSync(fileName))
            fs.writeFileSync(fileName, "");
    }

    protected output(...args: any[]): void {
        if(!fs.existsSync(this.file))
            fs.writeFileSync(this.file, "");

        const now = new Date(Date.now());

        fs.appendFileSync(this.file, `[${now.toLocaleTimeString('en', { hour12: false })}] ${args.join(' ')}\n`.replace(/[[0-9]+(;[0-9]+)*m/gi, ""));
    }

}