import Logger from "../../logs/logger";
import CommunityContentType from "../../schema/communityContent/CommunityContentType.schema";

export default async function importCommunityContentTypes(_: any, logger: Logger): Promise<void> {
    logger.info("Importing community content types...");

    const labels = ["Post", "Guide", "Discussion", "Poll"];
    const existing = await CommunityContentType.find();

    if (existing.length > 0) {
        logger.info("Community content types already exist. Skipping import.");
        return;
    }

    const types = labels.map(label => CommunityContentType.create({ Label: label }));
    await CommunityContentType.save(types);

    logger.info(`Created ${types.length} community content types.`);
}
