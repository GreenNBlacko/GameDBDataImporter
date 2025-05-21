import seedrandom from "seedrandom";
import Logger from "../../logs/logger";
import Hardware from "../../schema/game/attributes/Hardware.schema";
import HardwareType from "../../schema/game/attributes/HardwareType.schema";
import GameHardware from "../../schema/game/attributes/linking/GameHardware.schema";
import GameRequirementType from "../../schema/game/attributes/linking/GameRequirementType.schema";
import Game from "../../schema/game/Game.schema";
const rng = seedrandom("hardware");

export default async function importGameHardware(client: any, logger: Logger): Promise<void> {
    logger.info("Assigning hardware requirements to PC games...");

    try {
        const allGames = await Game.find();
        const requirementTypes = await GameRequirementType.find(); // Minimum + Recommended

        const hardwareByType: Map<string, Hardware[]> = new Map();
        const hardwareTypes = await HardwareType.find();

        for (const type of hardwareTypes) {
            const hw = await Hardware.find({ where: { Type: { ID: type.ID } } });
            hardwareByType.set(type.Name, hw);
        }

        const pcGamesResponse = await client
            .fields(['name', 'platforms'])
            .limit(150)
            .where('platforms != null & platforms = (6)')
            .request('/games');

        const pcGameIds = new Set<string>(pcGamesResponse.data.map((g: any) => g.name));

        for (const game of allGames) {
            if (!pcGameIds.has(game.Name)) continue;

            for (const [typeName, hardwareList] of hardwareByType) {
                if (hardwareList.length < 2) continue;

                const minIndex = Math.floor(rng() * hardwareList.length);
                const recommendedIndex = Math.min(
                    minIndex + Math.floor(rng() * (hardwareList.length - minIndex)),
                    hardwareList.length - 1
                );

                const min = GameHardware.create();
                min.Game = game;
                min.RequirementType = requirementTypes.find(t => t.Label === "Minimum")!;
                min.Hardware = hardwareList[minIndex];
                await min.save();

                const rec = GameHardware.create();
                rec.Game = game;
                rec.RequirementType = requirementTypes.find(t => t.Label === "Recommended")!;
                rec.Hardware = hardwareList[recommendedIndex];
                await rec.save();

                logger.info(`Assigned ${typeName} reqs to game: ${game.Name}`);
            }
        }

        logger.info("Hardware requirements assignment complete.");
    } catch (err) {
        logger.error("Failed to assign game hardware requirements: ", err);
    }
}
