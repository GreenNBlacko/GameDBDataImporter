import Logger from "../../logs/logger";
import Game from "../../schema/game/Game.schema";
import TrackedGame from "../../schema/user/attributes/TrackedGame.schema";
import TrackedGameStatus from "../../schema/user/attributes/TrackedGameStatus.schema";
import User from "../../schema/user/User.schema";

export default async function generateTrackedGames(_: any, logger: Logger): Promise<void> {
    logger.info("Generating tracked games...");

    const [users, games, statuses] = await Promise.all([
        User.find(),
        Game.find(),
        TrackedGameStatus.find()
    ]);

    if (!users.length || !games.length || !statuses.length) {
        logger.error("Missing required data: make sure users, games, and statuses are imported.");
        return;
    }

    const entries: TrackedGame[] = [];

    for (const user of users) {
        const trackedCount = Math.floor(Math.random() * 5) + 1;
        const shuffledGames = [...games].sort(() => 0.5 - Math.random());

        for (let i = 0; i < trackedCount; i++) {
            const game = shuffledGames[i];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            const tracked = TrackedGame.create({
                user,
                game,
                status
            });

            entries.push(tracked);
        }
    }

    try {
        await TrackedGame.save(entries);
        logger.info(`Successfully generated ${entries.length} tracked games.`);
    } catch (err) {
        logger.error("Failed to generate tracked games:", err);
    }
}
