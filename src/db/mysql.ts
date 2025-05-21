import { DataSource } from 'typeorm';
import { env } from '../config';
import { loadEntities } from '../schema';
import ConsoleLogger from '../logs/consoleLogger';
const log = new ConsoleLogger();

export async function connectToDB() {
    try {
        log.info("Importing tables...");

        const AppDataSource = new DataSource({
            type: "mysql",
            host: env.DB_HOST,
            port: env.DB_PORT,
            username: env.DB_USER,
            password: env.DB_PASS,
            database: env.DB_NAME,
            synchronize: env.DESTROY_DB,
            logging: false,
            entities: await loadEntities()
        })

        await AppDataSource.initialize();

        if(env.DESTROY_DB) {
            await AppDataSource.dropDatabase();
            await AppDataSource.synchronize();
        }

        log.success("Database initalized successfully");
    } catch (error) {
        log.error(error);
        process.exit(1);
    }
}