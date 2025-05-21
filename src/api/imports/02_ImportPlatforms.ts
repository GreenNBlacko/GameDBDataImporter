import Logger from "../../logs/logger";
import Platform from "../../schema/game/attributes/Platform.schema";

export default async function importPlatformData(client: any, logger: Logger): Promise<void> {
    logger.info("Importing platform data...");

    try {
        const response = await client
            .fields(['name', 'platforms'])
            .limit(150)
            .request('/games');

        const platformIds = new Set<number>();
        for (const game of response.data) {
            if (Array.isArray(game.platforms)) {
                game.platforms.forEach((id: number) => platformIds.add(id));
            }
        }

        if (platformIds.size === 0) {
            logger.warn("No platform IDs found in the first 150 games.");
            return;
        }

        const platforms = (await client
            .fields(['id', 'name', 'platform_logo.url'])
            .where(`id = (${Array.from(platformIds).join(',')})`)
            .limit(150)
            .request('/platforms')).data;

        for (const platform of platforms) {
            const existing = await Platform.findOne({ where: { Name: platform.name } });
            if (existing) {
                logger.info(`Platform '${platform.name}' already exists. Skipping.`);
                continue;
            }

            const entry = Platform.create();
            entry.Name = platform.name;
            entry.IconURL = platform.platform_logo?.url ?? null;

            await entry.save();
            logger.info(`Imported platform: ${platform.name}`);
        }

        logger.info(`Successfully imported platforms from ${response.data.length} games.`);
    } catch (err) {
        logger.error("Failed to import platform data: ", err);
    }
}
