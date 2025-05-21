import { In } from "typeorm";
import Logger from "../../logs/logger";
import AgeRating from "../../schema/game/attributes/AgeRating.schema";
import GameAgeRating from "../../schema/game/attributes/linking/GameAgeRating.schema";
import Game from "../../schema/game/Game.schema";

export default async function importGameAgeRatings(client: any, logger: Logger): Promise<void> {
    logger.info("Linking age ratings to games...");

    const ratingLookup: Record<number, string> = {
        1: " Three", 2: " Seven", 3: " Twelve", 4: " Sixteen", 5: " Eighteen", 6: " RP",
        7: " EC", 8: " E", 9: " E10", 10: " T", 11: " M", 12: " AO", 13: "_A", 14: "_B",
        15: "_C", 16: "_D", 17: "_Z", 18: "_0", 19: "_6", 20: "_12", 21: "_16",
        22: "_18", 23: "_ALL", 24: "_Twelve", 25: "_Fifteen", 26: "_Eighteen",
        27: "_TESTING", 28: "_L", 29: "_Ten", 30: "_Twelve", 31: "_Fourteen",
        32: "_Sixteen", 33: "_Eighteen", 34: "_G", 35: "_PG", 36: "_M", 37: "_MA15",
        38: "_R18", 39: "_RC",
    };

    try {
        const response = await client.fields(['name', 'age_ratings']).limit(150).request('/games');
        const gameDataList = response.data;

        const gameNames = gameDataList.map((g: any) => g.name);
        const gameMap = new Map((await Game.find({ where: { Name: In(gameNames) } }))
            .map(g => [g.Name, g]));

        const allAgeRatingIds = [...new Set(gameDataList.flatMap((g: any) => g.age_ratings ?? []))] as any[];
        const ratings = (await client.fields(['id', 'organization', 'rating'])
            .where(`id=(${allAgeRatingIds.join(',')})`)
            .request('/age_ratings')).data;
        const ratingMap = new Map(ratings.map((r: any) => [r.id, r])) as Map<number, any>;

        const allOrgIds = [...new Set(ratings.map((r: any) => r.organization))] as any[];
        const organizations = (await client.fields(['id', 'name'])
            .where(`id=(${allOrgIds.join(',')})`)
            .request('/age_rating_organizations')).data;
        const orgMap = new Map(organizations.map((o: any) => [o.id, o])) as Map<number, any>;

        const ageRatingNames = ratings.map((r: any) => {
            const org = orgMap.get(r.organization);
            return org ? org.name + ratingLookup[r.rating] : null;
        }).filter((n: any): n is string => !!n) as string[];

        const ageRatingMap = new Map((await AgeRating.find({ where: { Name: In(ageRatingNames) } }))
            .map(ar => [ar.Name, ar]));

        const linksToSave: GameAgeRating[] = [];

        for (const gameData of gameDataList) {
            const game = gameMap.get(gameData.name);
            if (!game || !gameData.age_ratings?.length) continue;

            for (const ageRatingId of gameData.age_ratings) {
                const rating = ratingMap.get(ageRatingId);
                if (!rating) continue;

                const org = orgMap.get(rating.organization);
                if (!org) continue;

                const name = org.name + ratingLookup[rating.rating];
                const ageRating = ageRatingMap.get(name);

                if (!ageRating) {
                    logger.error(`AgeRating with Name '${name}' not found in DB.`);
                    continue;
                }

                const link = GameAgeRating.create({ game, ageRating });
                linksToSave.push(link);
            }
        }

        await GameAgeRating.save(linksToSave);
        logger.info(`Linked ${linksToSave.length} age ratings to games.`);
        logger.info("Finished linking age ratings to games.");
    } catch (err) {
        logger.error("Failed to link age ratings to games:", err);
    }
}
