import { z } from "zod"
import dotenv from "dotenv"
import chalk from "chalk";
import ConsoleLogger from "./logs/consoleLogger";
const log = new ConsoleLogger("DEBUG");

dotenv.config()

const envSchema = z.object({
	DB_HOST: z.string().min(1, "DB_HOST is required"),
	DB_PORT: z.coerce.number().default(3306),
	DB_NAME: z.string().min(1, "DB_NAME is required"),
	DB_USER: z.string().min(1, "DB_USER is required"),
	DB_PASS: z.string().min(1, "DB_PASS is required"),
	DESTROY_DB: z.coerce.boolean().default(false),
	LOG_LEVEL: z.string().default("unset"),
	TWITCH_CLIENT_ID: z.string().min(29, "Invalid client ID"),
	TWITCH_APP_ACCESS_TOKEN: z.string().min(29, "Invalid access token")
})

const parsedEnv = envSchema.safeParse(process.env)

console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║            Game IS DB data importer          ║
║                  By ${chalk.hex("#008000").bold("Grayscale")}                ║
║                                              ║
╚══════════════════════════════════════════════╝
`);

if (!parsedEnv.success) {
	
	log.fatal(".env file dependencies are not met");
	log.error("Details:");
	parsedEnv.error.errors.forEach(err => {
		log.error(`\t${err.path.toString().padEnd(30).trimStart()} ${(err.fatal ?? false) ? "\x1b[33m" : "\x1b[31m"} ${err.message} \x1b[0m`)
	});
	process.exit(1);
}

const VALID_LOG_LEVELS = ["INFO", "WARNING", "ERROR", "DEBUG"] as const;
const log_level = parsedEnv.data.LOG_LEVEL;

if (!(parsedEnv.data.LOG_LEVEL && VALID_LOG_LEVELS.includes(parsedEnv.data.LOG_LEVEL as any))) {
	if (log_level != "unset") {
		log.warn(`Invalid LOG_LEVEL '${parsedEnv.data?.LOG_LEVEL}', defaulting to 'DEBUG'.`);
	}

	parsedEnv.data.LOG_LEVEL = 'DEBUG';
}

export const env = parsedEnv.data;