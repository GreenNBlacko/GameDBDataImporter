import Logger from "../../logs/logger";
import UserType from "../../schema/user/UserType.schema";

export default async function insertUserTypes(_: any, logger: Logger): Promise<void> {
    const userTypes = ["Member", "Admin"];

    for (const label of userTypes) {
        const userType = UserType.create({ Label: label });
        await userType.save();
        logger.info(`Inserted UserType: ${label}`);
    }

    logger.info('Finished importing user types');
}
