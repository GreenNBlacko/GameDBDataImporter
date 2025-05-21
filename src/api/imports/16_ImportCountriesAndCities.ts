import Logger from "../../logs/logger";
import City from "../../schema/City.schema";
import Country from "../../schema/Country.schema";

export default async function importCountryCityData(_: any, logger: Logger): Promise<void> {
    logger.info("Importing countries and their cities...");

    const countryData: Record<string, string[]> = {
        "United States": ["New York", "Los Angeles", "Chicago"],
        "Canada": ["Toronto", "Vancouver", "Montreal"],
        "Germany": ["Berlin", "Munich", "Hamburg"],
        "Japan": ["Tokyo", "Osaka", "Kyoto"],
        "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília"]
    };

    try {
        const allCountries: Country[] = [];
        const allCities: City[] = [];

        for (const [countryName, cities] of Object.entries(countryData)) {
            const country = Country.create();
            country.Name = countryName;
            allCountries.push(country);
            logger.info(`Added country: ${countryName}`);

            for (const cityName of cities) {
                const city = City.create();
                city.Name = cityName;
                city.country = country;
                allCities.push(city);
                logger.info(`Added city: ${cityName} (Country: ${countryName})`);
            }
        }

        await Country.save(allCountries);
        await City.save(allCities);

        logger.info(`Successfully imported ${allCountries.length} countries and ${allCities.length} cities.`);
    } catch (err) {
        logger.error("Failed to import countries and cities:", err);
    }
}
