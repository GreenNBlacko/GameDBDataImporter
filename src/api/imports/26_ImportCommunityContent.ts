import Logger from "../../logs/logger";
import ImageBlock from "../../schema/communityContent/blockTypes/ImageBlock.schema";
import TextBlock from "../../schema/communityContent/blockTypes/TextBlock.schema";
import TextImageBlock from "../../schema/communityContent/blockTypes/TextImageBlock.schema";
import CommunityContent from "../../schema/communityContent/CommunityContent.schema";
import CommunityContentType from "../../schema/communityContent/CommunityContentType.schema";
import Game from "../../schema/game/Game.schema";
import User from "../../schema/user/User.schema";
import seedrandom from "seedrandom";

const rng = seedrandom("Community");

function getRandom<T>(arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
}

function generateBlocks(type: string, contentId: number): { text: string; image?: string }[] {
    const blocks: { text: string; image?: string }[] = [];

    const intros = [
        "Here's my take on this game.", "Just finished a run, and I had to share this.", "Noticed something cool today.",
        "Been thinking about this mechanic lately.", "This is my go-to strategy.", "The devs outdid themselves here.",
        "This game surprised me.", "Trying out a new strategy.", "This was unexpected.", "Loved this sequence!",
        "Back at it again.", "A quick thought.", "Exploring something new.", "This one's for the veterans.",
        "Couldn't resist sharing this.", "Grinding pays off!", "Speedrun thoughts.", "The lore runs deep here.",
        "This build is insane.", "Caught something interesting.", "Late-night grind vibes.", "Weekend update thoughts.",
        "Broke my old record!", "This boss was brutal.", "Hardcore mode activated.", "Something worth noting.",
        "Need help with this part.", "Challenging but fun!", "Unpopular opinion here.", "I finally get it now.",
        "Mechanics breakdown incoming.", "Anyone else notice this?", "Pushed it to the limit today.",
        "Let's talk systems.", "I maxed out everything.", "Found a weird bug.", "Tried a new build today.",
        "So close, yet so far.", "The soundtrack slaps.", "Quick guide ahead.", "My favorite moment so far.",
        "Made a cool discovery.", "Here's how I approach this.", "A hidden gem moment.", "Worth the grind.",
        "Never thought I'd like this.", "Slow start but worth it.", "Better than expected.",
        "This aged like fine wine.", "Patch thoughts incoming."
    ];

    const bodies = [
        "The graphics are stunning. Every frame feels like a painting.", "Multiplayer is a bit laggy, but the gameplay is solid.",
        "The story is rich and immersive.", "Endgame content lacks depth.", "Here's a guide I made for new players.",
        "This trick helped me beat the hardest boss.", "Crafting could use a balance patch.",
        "Community feedback has improved the game a lot.", "The soundtrack really sets the mood.",
        "Combat feels responsive and satisfying.", "Controls need refinement.", "Economy is broken in the late game.",
        "This class feels overpowered.", "I love the customization options.", "The pacing is spot on.",
        "Feels repetitive after 20 hours.", "Exploration is very rewarding.", "AI has improved noticeably.",
        "Tons of quality-of-life changes.", "Level design is impressive.", "Too many fetch quests.",
        "Love the character interactions.", "Balance issues aside, it's fun.", "The update added much-needed content.",
        "Skill tree is too convoluted.", "Everything just clicks now.", "Physics engine is hilarious.",
        "Loot system is addictive.", "Dialogues are actually funny.", "Voice acting is top-notch.",
        "Armor progression feels meaningful.", "Too many menus to dig through.", "Some quests are downright confusing.",
        "Enemies scale poorly.", "Best boss fight so far.", "Hitboxes need tweaking.", "Great optimization for low-end PCs.",
        "Progression feels natural.", "UI is a mess, though.", "Amazing visuals with low GPU usage.",
        "Still confused by the story.", "DLCs add great variety.", "Achievements are well designed.",
        "I wish it had mod support.", "Would love to see PvP.", "This dev team listens to feedback.",
        "Microtransactions are manageable.", "Surprisingly emotional ending.", "Very polished for early access.",
        "Multiplayer sync issues ruin it."
    ];

    const conclusions = [
        "Definitely worth playing.", "Needs polish but has heart.", "Share your tips below!",
        "Would love to discuss more.", "Hope this helps someone.", "Looking forward to the next patch.",
        "Let me know what you think.", "Drop your thoughts!", "Curious how others play this.",
        "That's all for now.", "I'd do it all again.", "Waiting for the sequel already.",
        "So much fun!", "I'll be back tomorrow.", "Time well spent.", "Anyone else feel the same?",
        "Try this and thank me later.", "I recommend giving it a shot.", "More thoughts coming soon.",
        "That's my current take.", "End of rant.", "Let's chat!", "Can't wait for the next update.",
        "Still can't get over it.", "This game deserves more love.", "Let's keep this thread going.",
        "That's my build for now.", "Open to suggestions!", "Keep grinding!", "Thanks for reading!",
        "What are your strategies?", "Appreciate the devs' efforts.", "I'm impressed.", "That wraps it up.",
        "Peace out!", "Tell me your experience!", "What did I miss?", "I may be wrong—prove me wrong!",
        "Excited for what's next.", "That's how I play it.", "Do you agree?", "Add me in-game if you play this!",
        "Let's squad up sometime.", "GGs!", "No regrets.", "Feels good to share this.", "Hope this helps.",
        "Catch y'all later.", "Done and dusted."
    ];

    const blockCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < blockCount; i++) {
        const text = `${getRandom(intros)} ${getRandom(bodies)} ${getRandom(conclusions)}`;
        const useImage = type !== "Discussion" && Math.random() < 0.6;

        const image = `https://placehold.co/600x400?text=Image+${contentId}-${i}`;

        if (useImage && type !== "Post") {
            blocks.push({ text, image });
        } else if (useImage && type === "Post") {
            blocks.push({ text: "", image });
        } else {
            blocks.push({ text });
        }
    }

    return blocks;
}

export default async function importCommunityContent(_: any, logger: Logger): Promise<void> {
    logger.info("Importing community content entries...");

    const users = await User.find();
    const games = await Game.find();
    const types = await CommunityContentType.find();

    if (!users.length || !games.length || !types.length) {
        logger.error("Missing users, games, or community content types.");
        return;
    }

    const contentEntries: CommunityContent[] = [];
    const textBlocks: TextBlock[] = [];
    const imageBlocks: ImageBlock[] = [];
    const textImageBlocks: TextImageBlock[] = [];

    const TARGET_COUNT = Math.floor(rng() * 1000) + 1000;

    var increment = 1;

    for (let i = 0; i < TARGET_COUNT; i++) {
        const user = getRandom(users);
        const game = getRandom(games);
        const type = getRandom(types);

        const titleOptions = [
            "Thoughts on Update 1.2", "Tips for Beginners", "My Progress Journey",
            "A Controversial Take", "Top 5 Mistakes New Players Make", "Theorycrafting Time"
        ];

        const content = CommunityContent.create({
            user,
            game,
            type,
            Title: `${type.Label}: ${getRandom(titleOptions)}`
        });

        await content.save();

        const blocks = generateBlocks(type.Label, content.ID);
        for (const block of blocks) {
            if (block.text && block.image) {
                textImageBlocks.push(TextImageBlock.create({
                    ID:increment++,
                    content,
                    Content: block.text,
                    Image: block.image
                }));
            } else if (block.image && !block.text) {
                imageBlocks.push(ImageBlock.create({
                    ID:increment++,
                    content,
                    Image: block.image
                }));
            } else {
                textBlocks.push(TextBlock.create({
                    ID:increment++,
                    content,
                    Content: block.text
                }));
            }
        }

        contentEntries.push(content);

        if ((i + 1) % 200 === 0) {
            logger.info(`Progress: ${i + 1}/${TARGET_COUNT}`);
        }
    }

    await TextBlock.save(textBlocks);
    await ImageBlock.save(imageBlocks);
    await TextImageBlock.save(textImageBlocks);

    logger.info(`Created ${contentEntries.length} community content items.`);
    logger.info(`Blocks created — Text: ${textBlocks.length}, Image: ${imageBlocks.length}, Text+Image: ${textImageBlocks.length}`);
}
