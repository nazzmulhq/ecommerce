import { promises as fs } from "fs";

class File {
    static async readFilesInFolder(folderPath: string): Promise<string[]> {
        try {
            return await fs.readdir(folderPath);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async readJsonFile(filePath: string): Promise<any> {
        try {
            const data = await fs.readFile(filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return null; // Return null in case of an error
        }
    }

    static async writeJsonFile(filePath: string, data: any): Promise<void> {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
        } catch (error) {
            console.error(error);
        }
    }
}

export default File;
