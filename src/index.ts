import { connectToDB } from './db/mysql';
import ConsoleLogger from './logs/consoleLogger';
const log = new ConsoleLogger();

async function start() {
    log.info("Connecting to DB");
    await connectToDB();

    log.info("Starting the importer");
    await ImportData();

    log.success("Data import is done! Exiting...");
    log.info("Have a nice day!");
    exit(0);
}

import './config'
import ImportData from './igdb';
import { exit } from 'process';

log.success(".env file validated successfully");

start();
