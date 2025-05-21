import Logger from "../../logs/logger";
import Critic from "../../schema/game/attributes/Critic.schema";

export default async function importCritics(_: any, logger: Logger): Promise<void> {
  logger.info("Importing known critics...");

  const critics = [
    { Name: "IGN", MaxScore: 100 },
    { Name: "GameSpot", MaxScore: 100 },
    { Name: "Polygon", MaxScore: 100 },
    { Name: "PC Gamer", MaxScore: 100 },
    { Name: "Game Informer", MaxScore: 100 },
    { Name: "Destructoid", MaxScore: 100 },
    { Name: "Eurogamer", MaxScore: 100 },
    { Name: "Kotaku", MaxScore: 100 },
    { Name: "Rock Paper Shotgun", MaxScore: 100 },
    { Name: "Video Chums", MaxScore: 100 },
    { Name: "Worth Playing", MaxScore: 100 },
    { Name: "Impulse Gamer", MaxScore: 100 },
    { Name: "GamesRadar", MaxScore: 100 },
    { Name: "Hardcore Gamer", MaxScore: 100 },
    { Name: "Metacritic", MaxScore: 100 },
  ];

  try {
    const inserted = [];

    for (const c of critics) {
      const critic = Critic.create();
      critic.Name = c.Name;
      critic.MaxScore = c.MaxScore;

      await critic.save();
      logger.info(`Inserted critic: ${c.Name}`);
      inserted.push(critic);
    }

    logger.info(`Successfully imported ${inserted.length} critics.`);
  } catch (err) {
    logger.error("Failed to import critics: ", err);
  }
}
