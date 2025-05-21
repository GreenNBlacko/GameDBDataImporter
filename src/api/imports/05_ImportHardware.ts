import Logger from "../../logs/logger";
import Hardware from "../../schema/game/attributes/Hardware.schema";
import HardwareType from "../../schema/game/attributes/HardwareType.schema";

export default async function importHardware(_: any, logger: Logger): Promise<void> {
    logger.info("Importing hardware specifications...");

    const hardwareMap: { [type: string]: string[] } = {
        CPU: [
            "Intel Core i3-8100",
            "Intel Core i5-9600K",
            "Intel Core i7-10700K",
            "AMD Ryzen 3 3200G",
            "AMD Ryzen 5 3600",
            "AMD Ryzen 7 3700X"
        ],
        RAM: [
            "4 GB RAM",
            "8 GB RAM",
            "16 GB RAM",
            "32 GB RAM"
        ],
        Storage: [
            "20 GB available space",
            "50 GB available space",
            "100 GB available space",
            "SSD Recommended"
        ],
        GPU: [
            "NVIDIA GeForce GTX 1050 Ti",
            "NVIDIA GeForce GTX 1660",
            "NVIDIA GeForce RTX 2060",
            "NVIDIA GeForce RTX 3080",
            "AMD Radeon RX 570",
            "AMD Radeon RX 6800 XT"
        ],
        "Operating System": [
            "Windows 7",
            "Windows 10",
            "Windows 11",
            "Ubuntu 20.04",
            "macOS Ventura"
        ]
    };

    try {
        for (const [typeName, values] of Object.entries(hardwareMap)) {
            const type = await HardwareType.findOneByOrFail({ Name: typeName });

            for (const val of values) {
                const hw = Hardware.create();
                hw.Value = val;
                hw.Type = type;
                await hw.save();
                logger.info(`Inserted hardware: [${typeName}] ${val}`);
            }
        }

        logger.info("Successfully imported all hardware specifications.");
    } catch (err) {
        logger.error("Failed to import hardware data:", err);
    }
}
