import Logger from "../../logs/logger";
import User from "../../schema/user/User.schema";
import UserType from "../../schema/user/UserType.schema";
import Country from "../../schema/Country.schema";

const randomString = (len: number) =>
    Math.random().toString(36).substring(2, 2 + len);

export default async function generateUsers(_: any, logger: Logger): Promise<void> {
    logger.info("Starting user generation...");

    const userTypes = await UserType.find();
    const countries = await Country.find();

    if (userTypes.length < 2) {
        logger.error("UserTypes not populated. Run insertUserTypes first.");
        return;
    }

    if (countries.length === 0) {
        logger.error("Countries not populated. Run importCountriesAndCities first.");
        return;
    }

    for (let i = 0; i < 150; i++) {
        const username = `user_${randomString(5)}_${i}`;
        const email = `${username}@example.com`;
        const password = `hashedPassword${i}`;

        const user = User.create({
            Username: username,
            Email: email,
            PasswordHash: password,
            userType: userTypes[Math.floor(Math.random() * userTypes.length)],
            country: countries[Math.floor(Math.random() * countries.length)]
        });

        await user.save();
        logger.info(`Created user ${username}`);
    }

    logger.info("Finished importing users.");
}
