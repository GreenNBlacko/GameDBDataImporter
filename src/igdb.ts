import { env } from './config';
import igdb from 'igdb-api-node';
import ConsoleLogger from './logs/consoleLogger';
import FileLogger from './logs/fileLogger';
import MultiLogger from './logs/multiLogger';
import path from 'path';
import { readdir } from 'fs/promises';
const log = new ConsoleLogger();

export default async function ImportData() {
    const startTime = Date.now();
    log.info("Loading the API...");

    const client = igdb(env.TWITCH_CLIENT_ID, env.TWITCH_APP_ACCESS_TOKEN);

    log.success("Connected to API");
    log.info("Starting import...");

    const file = new FileLogger("import.log");
    const logger = new MultiLogger(log, file);
    logger.info("Starting API crawl...");

    logger.debug("Crawling import classes");

    const importDir = path.join(__dirname, 'api', 'imports');
    const files = await readdir(importDir);

    for (const file of files) {
        if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
        if (file === 'index.ts' || file === 'index.js') continue;

        const filePath = path.join(importDir, file);
        try {
            const module = await import(filePath);
            const importer = module.default;

            if (typeof importer === 'function') {
                logger.debug(`Running importer: ${file}`);
                await importer(client, logger);
            } else {
                logger.warn(`Skipping ${file}: No default function export.`);
            }
        } catch (err) {
            logger.error(`Failed to import ${file}:`, err);
        }
    }

    const end = Date.now();
    const elapsedMs = end - startTime;

    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);

    logger.success(`Data import completed in ${minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''} and ` : ""}${seconds} second${seconds !== 1 ? 's' : ''}.`);
    log.info("Logs saved to 'import.log'");
}