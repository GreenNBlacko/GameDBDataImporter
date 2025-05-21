// src/api/imports/importHardwareTypeData.ts
import Logger from "../../logs/logger";
import HardwareType from "../../schema/game/attributes/HardwareType.schema";

export default async function importHardwareTypeData(_: any, logger: Logger): Promise<void> {
    logger.info("Importing hardware types...");

    const hardwareTypes = [
        "CPU",
        "GPU",
        "RAM",
        "Storage",
        "Operating System"
    ];

    try {
        const instances = hardwareTypes.map(name => {
            const inst = HardwareType.create();
            inst.Name = name;
            logger.info(`Prepared hardware type: ${name}`);
            return inst;
        });

        await HardwareType.save(instances);

        logger.info(`Successfully imported ${instances.length} hardware types.`);
    } catch (err) {
        logger.error("Failed to import hardware types:", err);
    }
}
