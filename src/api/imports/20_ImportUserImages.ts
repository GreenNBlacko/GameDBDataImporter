import Logger from "../../logs/logger";
import User from "../../schema/user/User.schema";
import UserImage from "../../schema/user/attributes/UserImage.schema";
import UserImageType from "../../schema/user/attributes/UserImageType.schema";

export default async function importUserImages(_: any, logger: Logger): Promise<void> {
    logger.info("Assigning images to users...");

    try {
        const users = await User.find();
        const imageTypes = await UserImageType.find();

        if (users.length === 0 || imageTypes.length === 0) {
            logger.warn("No users or user image types found. Aborting image import.");
            return;
        }

        const allImages: UserImage[] = [];

        for (const user of users) {
            for (const type of imageTypes) {
                const image = UserImage.create();
                image.URL = `https://placehold.er/600x400?text=${type.Label}+${user.ID}`;
                image.imageType = type;
                image.user = user;

                allImages.push(image);

                logger.info(`Added ${type.Label} image for user ${user.Username}`);
            }
        }

        await UserImage.save(allImages);

        logger.info(`Successfully assigned ${allImages.length} user images to ${users.length} users.`);
    } catch (err) {
        logger.error("Failed to import user images:", err);
    }
}
