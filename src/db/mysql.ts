import log from '../logger';
import { DataSource } from 'typeorm';
import { env } from '../config';

export async function connectToDB() {
    try {
        const AppDataSource = new DataSource({
            type: "mysql",
            host: env.DB_HOST,
            port: env.DB_PORT,
            username: env.DB_USER,
            password: env.DB_PASS,
            database: env.DB_NAME,
            synchronize: true,
            logging: false,
            entities: [env.SCHEMA_PATH]
        })

        await AppDataSource.initialize();

        if(env.DESTROY_DB) {
            await AppDataSource.dropDatabase();
            await AppDataSource.synchronize();
        }

        log.success("Connected to database");
    } catch (error) {
        log.error(error);
        process.exit(1);
    }
}