import Logger from "../../logs/logger";
import TrackedGameStatus from "../../schema/user/attributes/TrackedGameStatus.schema";

export default async function insertTrackedGameStatuses(_: any, logger: Logger): Promise<void> {
    logger.info("Inserting tracked game statuses...");

    const statuses = [
        "Planning to Play",
        "Playing",
        "On Hold",
        "Dropped",
        "Completed"
    ];

    try {
        const instances = statuses.map(label => {
            const status = TrackedGameStatus.create();
            status.Label = label;
            logger.info(`Added status: ${label}`);
            return status;
        });

        await TrackedGameStatus.save(instances);
        logger.info(`Successfully inserted ${instances.length} statuses.`);
    } catch (err) {
        logger.error("Failed to insert tracked game statuses:", err);
    }
}
