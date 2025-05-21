import Logger from "../../logs/logger";
import Genre from "../../schema/game/attributes/Genre.schema";
import Tag from "../../schema/game/attributes/Tag.schema";

export default async function importGenresAndTags(client: any, logger: Logger): Promise<void> {
    logger.info("Importing genres and tags...");

    try {
        // Step 1: Fetch genre and keyword IDs from games
        const response = await client
            .fields(['genres', 'keywords'])
            .limit(150)
            .request('/games');

        const genreIds = new Set<number>();
        const tagIds = new Set<number>();

        for (const game of response.data) {
            game.genres?.forEach((id: number) => genreIds.add(id));
            game.keywords?.forEach((id: number) => tagIds.add(id));
        }

        // Step 2: Fetch genres
        if (genreIds.size > 0) {
            const genresResponse = await client
                .fields(['name'])
                .where(`id = (${[...genreIds].join(',')})`)
                .limit(250)
                .request('/genres');

            for (const genre of genresResponse.data) {
                const exists = await Genre.findOne({ where: { Name: genre.name } });
                if (!exists) {
                    const entry = Genre.create();
                    entry.Name = genre.name;
                    await entry.save();
                    logger.info(`Inserted genre: ${genre.name}`);
                }
            }
        }

        // Step 3: Fetch tags (keywords)
        if (tagIds.size > 0) {
            const tagsResponse = await client
                .fields(['name'])
                .where(`id = (${[...tagIds].join(',')})`)
                .limit(250)
                .request('/keywords');

            for (const tag of tagsResponse.data) {
                const exists = await Tag.findOne({ where: { Name: tag.name } });
                if (!exists) {
                    const entry = Tag.create();
                    entry.Name = tag.name;
                    await entry.save();
                    logger.info(`Inserted tag: ${tag.name}`);
                }
            }
        }

        logger.info("Successfully imported genres and tags.");
    } catch (err) {
        logger.error("Failed to import genres and tags:", err);
    }
}
