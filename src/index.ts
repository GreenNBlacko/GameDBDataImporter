import './config'
import log from './logger'
import { connectToDB } from './db/mysql';
import { exit } from 'process';
import chalk from 'chalk';

async function start() {
    log.info("Connecting to DB");
    await connectToDB();
}

console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║            Game IS DB data importer          ║
║                  By ${chalk.hex("#008000").bold("Grayscale")}                ║
║                                              ║
╚══════════════════════════════════════════════╝
`);

log.success(".env file validated successfully");

start();
