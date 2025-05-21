import Logger from "../../logs/logger";
import Game from "../../schema/game/Game.schema";

export default async function importGameData(client: any, logger: Logger): Promise<void> {
    logger.info("Importing game data...");

    try {
        const response = await client
            .fields(['name', 'summary', 'cover.image_id'])
            .limit(150)
            .request('/games');

        const games: Game[] = response.data.map((game: any) => {
            const name = game.name ?? 'Unknown';
            const description = game.summary ?? '';
            const coverImageId = game.cover?.image_id ?? null;
            const coverUrl = coverImageId
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${coverImageId}.jpg`
                : undefined;

            logger.info(`Fetched: ${name}`);

            const newGame = Game.create();

            newGame.Name = name;
            newGame.Description = description;
            newGame.CoverImage = coverUrl;

            return newGame;
        });

        logger.info("Data retrieved successfully, saving to database...");

        await Game.save(games);

        logger.info(`Successfully imported ${games.length} games.`);
    } catch (err) {
        logger.error("Failed to import game data: ", err);
    }
}