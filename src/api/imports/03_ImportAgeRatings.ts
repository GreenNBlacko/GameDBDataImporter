import Logger from "../../logs/logger";
import AgeRating from "../../schema/game/attributes/AgeRating.schema";

export default async function importAgeRatingData(_: any, logger: Logger): Promise<void> {
    logger.info("Importing age rating data...");

    const ratings = [
        // ESRB (North America)
        { name: "ESRB EC", icon: undefined },
        { name: "ESRB E", icon: undefined },
        { name: "ESRB E10", icon: undefined },
        { name: "ESRB T", icon: undefined },
        { name: "ESRB M", icon: undefined },
        { name: "ESRB AO", icon: undefined },
        { name: "ESRB RP", icon: undefined },

        // PEGI (Europe)
        { name: "PEGI Three", icon: undefined },
        { name: "PEGI Seven", icon: undefined },
        { name: "PEGI Twelve", icon: undefined },
        { name: "PEGI Sixteen", icon: undefined },
        { name: "PEGI Eighteen", icon: undefined },

        // CERO (Japan)
        { name: "CERO_A", icon: undefined },
        { name: "CERO_B", icon: undefined },
        { name: "CERO_C", icon: undefined },
        { name: "CERO_D", icon: undefined },
        { name: "CERO_Z", icon: undefined },

        // USK (Germany)
        { name: "USK_0", icon: undefined },
        { name: "USK_6", icon: undefined },
        { name: "USK_12", icon: undefined },
        { name: "USK_16", icon: undefined },
        { name: "USK_18", icon: undefined },

        { name: "GRAC_ALL", icon: undefined},
        { name: "GRAC_Twelve", icon: undefined},
        { name: "GRAC_Fifteen", icon: undefined},
        { name: "GRAC_Eighteen", icon: undefined},
        { name: "GRAC_TESTING", icon: undefined},

        { name: "CLASS_IND_L", icon: undefined},
        { name: "CLASS_IND_Ten", icon: undefined},
        { name: "CLASS_IND_Twelve", icon: undefined},
        { name: "CLASS_IND_Fourteen", icon: undefined},
        { name: "CLASS_IND_Sixteen", icon: undefined},
        { name: "CLASS_IND_Eighteen", icon: undefined},

        { name: "ACB_G", icon: undefined},
        { name: "ACB_PG", icon: undefined},
        { name: "ACB_M", icon: undefined},
        { name: "ACB_MA15", icon: undefined},
        { name: "ACB_R18", icon: undefined},	
        { name: "ACB_RC", icon: undefined},

        // Other
        { name: "Not Rated", icon: undefined }
    ];

    try {
        const instances = ratings.map(rating => {
            const instance = AgeRating.create();
            instance.Name = rating.name;
            instance.IconURL = rating.icon; // Always undefined per your requirement
            logger.info(`Prepared age rating: ${rating.name}`);
            return instance;
        });

        await AgeRating.save(instances);

        logger.info(`Successfully imported ${instances.length} age ratings.`);
    } catch (err) {
        logger.error("Failed to import age rating data: ", err);
    }
}