import Logger from "../../logs/logger";
import Genre from "../../schema/game/attributes/Genre.schema";
import Tag from "../../schema/game/attributes/Tag.schema";
import Game from "../../schema/game/Game.schema";
import GameGenre from "../../schema/game/attributes/linking/GameGenre.schema";
import GameTag from "../../schema/game/attributes/linking/GameTag.schema";
import { In } from "typeorm";

type IGDBGame = {
    name: string;
    genres?: number[];
    keywords?: number[];
};

type IGDBEntity = {
    id: number;
    name: string;
};

export default async function linkGenresAndTags(client: any, logger: Logger): Promise<void> {
    logger.info("Linking genres and tags to games...");

    try {
        const igdbGamesResponse = await client
            .fields(['name', 'genres', 'keywords'])
            .limit(250)
            .where('genres != null | keywords != null')
            .request('/games');

        const igdbGames: IGDBGame[] = igdbGamesResponse.data;

        const allGenreIds = new Set<number>();
        const allKeywordIds = new Set<number>();
        const allGameNames = new Set<string>();

        for (const game of igdbGames) {
            if (game.genres) game.genres.forEach(id => allGenreIds.add(id));
            if (game.keywords) game.keywords.forEach(id => allKeywordIds.add(id));
            allGameNames.add(game.name);
        }

        const [localGames, genres, tags] = await Promise.all([
            Game.find({ where: { Name: In(Array.from(allGameNames)) } }),
            client.fields(['id', 'name']).where(`id = (${Array.from(allGenreIds).join(',')})`).limit(500).request('/genres'),
            client.fields(['id', 'name']).where(`id = (${Array.from(allKeywordIds).join(',')})`).limit(500).request('/keywords')
        ]);

        const gameMap = new Map<string, Game>();
        for (const game of localGames) gameMap.set(game.Name, game);

        const genreMap = new Map<number, string>();
        for (const genre of genres.data as IGDBEntity[]) genreMap.set(genre.id, genre.name);

        const tagMap = new Map<number, string>();
        for (const tag of tags.data as IGDBEntity[]) tagMap.set(tag.id, tag.name);

        const genreEntityMap = new Map<string, Genre>();
        const tagEntityMap = new Map<string, Tag>();

        const [genreEntities, tagEntities] = await Promise.all([
            Genre.find(), Tag.find()
        ]);
        for (const g of genreEntities) genreEntityMap.set(g.Name, g);
        for (const t of tagEntities) tagEntityMap.set(t.Name, t);

        for (const igdbGame of igdbGames) {
            const localGame = gameMap.get(igdbGame.name);
            if (!localGame) continue;

            if (igdbGame.genres?.length) {
                for (const genreId of igdbGame.genres) {
                    const genreName = genreMap.get(genreId);
                    const genre = genreName ? genreEntityMap.get(genreName) : null;
                    if (!genre) continue;

                    const existing = await GameGenre.findOne({ where: { game: { ID: localGame.ID }, genre: { ID: genre.ID } } });
                    if (!existing) {
                        await GameGenre.create({ game: localGame, genre }).save();
                        logger.info(`Linked genre "${genre.Name}" to "${localGame.Name}"`);
                    }
                }
            }

            if (igdbGame.keywords?.length) {
                for (const keywordId of igdbGame.keywords) {
                    const tagName = tagMap.get(keywordId);
                    const tag = tagName ? tagEntityMap.get(tagName) : null;
                    if (!tag) continue;

                    const existing = await GameTag.findOne({ where: { game: { ID: localGame.ID }, tag: { ID: tag.ID } } });
                    if (!existing) {
                        await GameTag.create({ game: localGame, tag }).save();
                        logger.info(`Linked tag "${tag.Name}" to "${localGame.Name}"`);
                    }
                }
            }
        }

        logger.info("Finished linking genres and tags to games.");
    } catch (err) {
        logger.error("Failed to link genres and tags:", err);
    }
}
