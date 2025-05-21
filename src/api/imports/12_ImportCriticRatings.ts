import seedrandom from "seedrandom";
import Logger from "../../logs/logger";
import Critic from "../../schema/game/attributes/Critic.schema";
import CriticReview from "../../schema/game/attributes/linking/CriticReview.schema";
import Game from "../../schema/game/Game.schema";

const rng = seedrandom("criticRatings");

export default async function importCriticRatings(client: any, logger: Logger): Promise<void> {
    logger.info("Linking Critic ratings to games...");

    const negativeTitles = [
        "Disappointing Experience",
        "Fails to Impress",
        "A Letdown",
        "Mediocre at Best",
        "Not Worth Your Time",
        "A Missed Opportunity",
        "Struggles to Deliver",
        "Below Expectations",
        "Flawed Execution",
        "Leaves Much to Be Desired"
    ];

    const mixedTitles = [
        "An Uneven Journey",
        "Hits and Misses",
        "A Mixed Bag",
        "Some Bright Spots",
        "Could Be Better",
        "Not Without Merit",
        "An Average Ride",
        "Has Potential, But...",
        "Decent, Not Great",
        "Room for Improvement"
    ];

    const positiveTitles = [
        "A Triumph",
        "Masterfully Crafted",
        "Outstanding Achievement",
        "Highly Recommended",
        "An Unforgettable Experience",
        "A Must-Play",
        "A Stunning Success",
        "Top-Tier Gaming",
        "Exceeds Expectations",
        "A True Gem"
    ];

    const negativeContents = [
        "Unfortunately, this game falls short in many areas. The gameplay feels repetitive and uninspired, and the story lacks depth.",
        "Technical issues and poor design choices make it difficult to enjoy this title fully.",
        "While it had some interesting ideas, the execution is inconsistent, resulting in a frustrating experience.",
        "The graphics and sound design are underwhelming, failing to immerse the player in its world.",
        "Overall, this game struggles to find its footing and leaves the player wanting more."
    ];

    const mixedContents = [
        "This game offers some enjoyable moments, but it's bogged down by uneven pacing and occasional glitches.",
        "There are flashes of brilliance here, but they're often overshadowed by frustrating mechanics.",
        "Fans of the genre might find enough to like, but casual players could struggle with its difficulty spikes.",
        "The story has potential, but the narrative delivery feels disjointed at times.",
        "It's an okay experience with a few memorable highlights, though it doesn't quite reach greatness."
    ];

    const positiveContents = [
        "This game shines with polished gameplay, an engaging story, and stunning visuals that captivate from start to finish.",
        "A remarkable achievement that sets a new standard in its genre.",
        "Every element comes together perfectly, delivering a rewarding and immersive experience.",
        "The developers have crafted a masterpiece that gamers will talk about for years to come.",
        "An exceptional title that is both challenging and deeply satisfying."
    ];

    const games = (await client
            .fields(['name', 'aggregated_rating', 'aggregated_rating_count'])
            .limit(150)
            .request('/games')).data;

    const criticCount = await Critic.count();

    for(const game of games) {
        if(!game.aggregated_rating_count) {
            logger.debug(`Skipping game due to no reviews being made: ${game.name}`);
            continue;
        }
        
        const maxStart = criticCount - game.aggregated_rating_count;
        const start = Math.min(0, Math.max(Math.floor(rng() * maxStart + 1), maxStart))

        const dbGame = await Game.findOne({ where: { Name: game.name }});

        if (!dbGame) {
            logger.error(`Game with Name ${game.name} not found in DB.`);
            continue;
        }

        for(let i = 1; i <= game.aggregated_rating_count; i++) {
            const rating = Math.min(game.aggregated_rating + 10, Math.max(1, Math.floor(rng() * 101) + 1, game.aggregated_rating - 10), 100);
            const critic = await Critic.findOne({ where: { ID: start + i }});
            if (!critic) {
                logger.error(`Critic with ID ${start + i} not found in DB.`);
                continue;
            }

            let titlePool, contentPool;
            if (rating <= 40) {
                titlePool = negativeTitles;
                contentPool = negativeContents;
            } else if (rating <= 70) {
                titlePool = mixedTitles;
                contentPool = mixedContents;
            } else {
                titlePool = positiveTitles;
                contentPool = positiveContents;
            }

            // Random pick for variety
            const title = titlePool[Math.floor(rng() * titlePool.length)];
            const content = contentPool[Math.floor(rng() * contentPool.length)];

            const criticReview = CriticReview.create();

            criticReview.Title = title;
            criticReview.Content = content;
            criticReview.Score = rating;
            criticReview.game = dbGame;
            criticReview.critic = critic;

            criticReview.save();

            logger.info(`Successfully added review from '${critic.Name}' to game: ${game.name}`);
        }
    }

    logger.info("Finished importing critic reviews");
}