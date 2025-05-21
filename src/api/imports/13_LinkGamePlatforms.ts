import Logger from "../../logs/logger";
import Game from "../../schema/game/Game.schema";
import Platform from "../../schema/game/attributes/Platform.schema";
import GamePlatform from "../../schema/game/attributes/linking/GamePlatform.schema";

export default async function linkGamePlatforms(client: any, logger: Logger): Promise<void> {
    logger.info("Linking platforms to games...");

    const games = (await client
        .fields(['name', 'platforms.name', 'platforms.platform_logo.url'])
        .limit(150)
        .request('/games')).data;

    for (const game of games) {
        if (!game.platforms || game.platforms.length === 0) {
            logger.debug(`No platforms for game: ${game.name}`);
            continue;
        }

        const dbGame = await Game.findOne({ where: { Name: game.name } });
        if (!dbGame) {
            logger.error(`Game '${game.name}' not found in DB.`);
            continue;
        }

        for (const apiPlatform of game.platforms) {
            const platformName = apiPlatform.name.trim();
            const platformIcon = apiPlatform.platform_logo?.url?.replace("t_thumb", "t_logo_med") ?? null;

            let platform = await Platform.findOne({ where: { Name: platformName } });

            if (!platform) {
                platform = Platform.create();
                platform.Name = platformName;
                platform.IconURL = platformIcon;
                await platform.save();
                logger.info(`Created new platform: ${platformName}`);
            }

            const existingLink = await GamePlatform.findOne({
                where: {
                    game: { ID: dbGame.ID },
                    platform: { ID: platform.ID }
                }
            });

            if (existingLink) {
                logger.debug(`Link already exists between '${dbGame.Name}' and '${platformName}'`);
                continue;
            }

            const link = GamePlatform.create();
            link.game = dbGame;
            link.platform = platform;

            await link.save();

            logger.info(`Linked platform '${platformName}' to game '${dbGame.Name}'`);
        }
    }

    logger.info("Finished linking platforms to games.");
}
