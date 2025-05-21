import Logger from "../../logs/logger";
import GameRequirementType from "../../schema/game/attributes/linking/GameRequirementType.schema";

export default async function importRequirementTypes(_: any, logger: Logger): Promise<void> {
  logger.info("Importing game requirement types...");

  const types = [
    { Label: "Minimum" },
    { Label: "Recommended" },
  ];

  try {
    const inserted = [];

    for (const t of types) {
      const type = GameRequirementType.create();
      type.Label = t.Label;

      await type.save();
      logger.info(`Inserted requirement type: ${t.Label}`);
      inserted.push(type);
    }

    logger.info(`Successfully imported ${inserted.length} requirement types.`);
  } catch (err) {
    logger.error("Failed to import requirement types: ", err);
  }
}
