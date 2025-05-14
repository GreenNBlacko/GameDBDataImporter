import { z } from "zod"
import dotenv from "dotenv"
import log from './logger'

dotenv.config()

const envSchema = z.object({
	DB_HOST: z.string().min(1, "DB_HOST is required"),
	DB_PORT: z.coerce.number().default(3306),
	DB_NAME: z.string().min(1, "DB_NAME is required"),
	DB_USER: z.string().min(1, "DB_USER is required"),
	DB_PASS: z.string().min(1, "DB_PASS is required"),
	DESTROY_DB: z.coerce.boolean().default(false),
	SCHEMA_PATH: z.string().min(1, "SCHEMA_PATH is required")
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
	log.fatal(".env file dependencies are not met")
	log.error("Details:");
	parsedEnv.error.errors.forEach(err => {
		log.error(`\t${err.path.toString().padEnd(30).trimStart()} ${(err.fatal ?? false) ? "\x1b[33m" : "\x1b[31m"} ${err.message} \x1b[0m`)
	});
	process.exit(1);
}

export const env = parsedEnv.data