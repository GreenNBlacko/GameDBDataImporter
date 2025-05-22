import Logger from "../../logs/logger";
import UserImageType from "../../schema/user/attributes/UserImageType.schema";

export default async function importUserImageType(_: any, logger: Logger): Promise<void> {
    logger.info("Importing user image types...");

    const types = ["Profile", "Banner"];

    try {
        const instances = types.map(label => {
            const inst = UserImageType.create();
            inst.Label = label;
            logger.info(`Added user image type: ${label}`);
            return inst;
        });

        await UserImageType.save(instances);

        logger.info(`Successfully imported ${instances.length} user image types.`);
    } catch (err) {
        logger.error("Failed to import user image types:", err);
    }
}
