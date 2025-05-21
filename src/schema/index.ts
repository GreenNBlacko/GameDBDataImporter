import fs from "fs";
import path from "path";
import chalk from "chalk";
import ConsoleLogger from "../logs/consoleLogger";
const Log = new ConsoleLogger();

const isCompiled = __filename.endsWith(".js");
const ext = isCompiled ? ".js" : ".ts";
const baseDir = path.resolve(__dirname, "./");

async function getEntityClasses(dir: string): Promise<any[]> {
    const entities: any[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const subEntities = await getEntityClasses(fullPath);
            entities.push(...subEntities);
        } else if (entry.isFile() && entry.name.endsWith(ext) && entry.name != "index.ts") {
            const modulePath = fullPath;

            // Dynamic import
            const module = await import(modulePath);

            for (const exported of Object.values(module)) {
                if (typeof exported === "function") {
                    Log.debug(`Importing table: ${chalk.green(entry.name.substring(0, entry.name.indexOf(".")))}`);
                    entities.push(exported);
                }
            }
        }
    }

    return entities;
}

export const loadEntities = () => getEntityClasses(baseDir);
