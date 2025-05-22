import Logger from "../../logs/logger";
import Game from "../../schema/game/Game.schema";
import GamePurchase from "../../schema/user/attributes/GamePurchase.schema";
import LicenseType from "../../schema/user/attributes/LicenseType.schema";
import ShippingAddress from "../../schema/user/attributes/ShippingAddress.schema";
import User from "../../schema/user/User.schema";

export default async function generateGamePurchases(_: any, logger: Logger): Promise<void> {
    logger.info("Generating game purchases...");

    const [users, games, licenseTypes, addresses] = await Promise.all([
        User.find(),
        Game.find(),
        LicenseType.find(),
        ShippingAddress.find({relations: {
            user: true
        }})
    ]);

    if (!users.length || !games.length || !licenseTypes.length) {
        logger.error("Missing required data: make sure users, games, and license types are populated.");
        return;
    }

    const purchases: GamePurchase[] = [];

    for (const user of users) {
        const purchaseCount = Math.floor(Math.random() * 4); // up to 3 purchases per user
        const shuffledGames = [...games].sort(() => 0.5 - Math.random());

        for (let i = 0; i < purchaseCount; i++) {
            const game = shuffledGames[i];
            const license = licenseTypes[Math.floor(Math.random() * licenseTypes.length)];

            const purchase = GamePurchase.create();

            purchase.user = user;
            purchase.game = game;
            purchase.PurchaseDate = new Date(Date.now() - Math.floor(Math.random() * 1_000_000_000));
            purchase.license = license;
            purchase.shippingAddress = license.Label === "physical"
            ? addresses.find(addr => addr.user.ID === user.ID) ?? undefined
            : undefined;

            purchases.push(purchase);
        }
    }

    try {
        await GamePurchase.save(purchases);
        logger.info(`Successfully generated ${purchases.length} game purchases.`);
    } catch (err) {
        logger.error("Failed to generate game purchases:", err);
    }
}
