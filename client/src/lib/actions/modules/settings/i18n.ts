import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export const getI18n = (lang: string) => {
    try {
        const filePath = join(process.cwd(), "public", "locales", `${lang}.json`);

        // Check if the file exists, if not then create folder and in folder create file, create it with an empty JSON object
        if (!existsSync(filePath)) {
            const folderPath = join(process.cwd(), "public", "locales");
            if (!existsSync(folderPath)) {
                mkdirSync(folderPath, { recursive: true });
            }
            writeFileSync(filePath, JSON.stringify({}), "utf8");
        }

        const fileContents = readFileSync(filePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error) {
        console.error(`Error loading ${lang} translations:`, error);
        return {};
    }
};
