import Logger from "../../logs/logger";
import User from "../../schema/user/User.schema";
import City from "../../schema/City.schema";
import ShippingAddress from "../../schema/user/attributes/ShippingAddress.schema";

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomStreetName(): string {
    const streets = [
        "Maple Street", "Oak Avenue", "Pine Road",
        "Cedar Lane", "Elm Drive", "Willow Way",
        "Birch Boulevard", "Ash Court"
    ];
    return streets[Math.floor(Math.random() * streets.length)];
}

export default async function importShippingAddresses(_: any, logger: Logger): Promise<void> {
    logger.info("Generating shipping addresses for users...");

    try {
        const users = await User.find();
        const cities = await City.find();

        if (users.length === 0 || cities.length === 0) {
            logger.warn("No users or cities found. Aborting shipping address import.");
            return;
        }

        const allAddresses: ShippingAddress[] = [];

        for (const user of users) {
            const addressCount = getRandomInt(1, 3);

            for (let i = 0; i < addressCount; i++) {
                const address = ShippingAddress.create();
                address.Street = getRandomStreetName();
                address.HouseNumber = getRandomInt(1, 200);
                address.ApartmentNumber = Math.random() < 0.5 ? undefined : getRandomInt(1, 50);
                address.user = user;
                address.city = cities[getRandomInt(0, cities.length - 1)];

                allAddresses.push(address);

                logger.info(`Added address for user ${user.Username}: ${address.Street} ${address.HouseNumber}${address.ApartmentNumber ? ` Apt ${address.ApartmentNumber}` : ''}, ${address.city.Name}`);
            }
        }

        await ShippingAddress.save(allAddresses);

        logger.info(`Successfully imported ${allAddresses.length} shipping addresses for ${users.length} users.`);
    } catch (err) {
        logger.error("Failed to import shipping addresses:", err);
    }
}
