import Logger from "../../logs/logger";
import Game from "../../schema/game/Game.schema";
import Review from "../../schema/user/attributes/Review.schema";
import User from "../../schema/user/User.schema";

function getReviewScore(): number {
    const rand = Math.random();
    if (rand < 0.1) return Math.floor(Math.random() * 3) + 1; // 1–3 (bad)
    if (rand < 0.4) return Math.floor(Math.random() * 3) + 4; // 4–6 (mid)
    return Math.floor(Math.random() * 4) + 7; // 7–10 (good)
}

function getReviewText(score: number): { title: string, content: string } {
    const good = [
        ["An Amazing Experience", "This game blew me away. Stunning visuals, immersive gameplay, and a story that sticks with you. Highly recommended!"],
        ["One of the Best!", "From start to finish, it was a masterpiece. I couldn’t put it down for days."],
        ["Just Perfect", "It’s rare to find a game this polished. Every mechanic felt satisfying and rewarding."]
    ];

    const mid = [
        ["Had Potential", "The game had good ideas, but poor execution held it back. Worth a try, but don’t expect too much."],
        ["Mixed Feelings", "Some parts were enjoyable, but others were frustrating or buggy. It’s a decent time-waster."],
        ["Mediocre at Best", "Nothing memorable. Feels like it could have been better with more polish."]
    ];

    const bad = [
        ["Major Disappointment", "Terrible controls, boring story, and constant bugs. I regret playing this."],
        ["Unplayable", "Everything from the graphics to the gameplay was just bad. Would not recommend to anyone."],
        ["Waste of Time", "I kept hoping it would get better, but it never did. Complete letdown."]
    ];

    if (score >= 8) {
        return good.map((item: string[]) => { return {title: item.at(0) ?? "", content: item.at(1) ?? ""} })[Math.floor(Math.random() * good.length)];
    } else if (score >= 4) {
        return mid.map((item: string[]) => { return {title: item.at(0) ?? "", content: item.at(1) ?? ""} })[Math.floor(Math.random() * mid.length)];
    } else {
        return bad.map((item: string[]) => { return {title: item.at(0) ?? "", content: item.at(1) ?? ""} })[Math.floor(Math.random() * bad.length)];
    }
}

export default async function generateReviews(_: any, logger: Logger): Promise<void> {
    logger.info("Generating reviews...");

    const users = await User.find();
    const games = await Game.find();

    if (!users.length || !games.length) {
        logger.error("Users or games missing. Populate them first.");
        return;
    }

    const reviews: Review[] = [];

    for (const user of users) {
        const reviewCount = Math.floor(Math.random() * 3); // 0–2 reviews per user
        const reviewedGames = new Set<number>();

        for (let i = 0; i < reviewCount; i++) {
            const game = games[Math.floor(Math.random() * games.length)];
            if (reviewedGames.has(game.ID)) continue; // prevent duplicate reviews
            reviewedGames.add(game.ID);

            const score = getReviewScore();
            const { title, content } = getReviewText(score);

            const review = Review.create({
                user,
                game,
                Score: score,
                Title: title,
                Content: content
            });

            reviews.push(review);
        }
    }

    try {
        await Review.save(reviews);
        logger.info(`Successfully created ${reviews.length} reviews.`);
    } catch (err) {
        logger.error("Error saving reviews:", err);
    }
}
