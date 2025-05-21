import Logger from "../../logs/logger";
import LicenseType from "../../schema/user/attributes/LicenseType.schema";

export default async function importLicenseTypes(_: any, logger: Logger): Promise<void> {
    logger.info("Importing license types...");

    const types = ["physical", "digital"];

    try {
        const entries = types.map(label => {
            const type = LicenseType.create();
            type.Label = label;
            logger.info(`Prepared license type: ${label}`);
            return type;
        });

        await LicenseType.save(entries);

        logger.info(`Successfully imported ${entries.length} license types.`);
    } catch (err) {
        logger.error("Failed to import license types:", err);
    }
}
