import File from "../../../lib/utils/file";

export async function GET() {
    try {
        const path = `${process.cwd()}/src/lib/localization/locales`;

        const folder = await File.readFilesInFolder(path);

        // Define the type for the files object
        const files: { [key: string]: any } = {};

        // Use Promise.all to handle async operations in a loop
        await Promise.all(
            folder.map(async file => {
                const lan = file.split(".")[0];
                const filePath = `${path}/${file}`;
                const data = await File.readJsonFile(filePath);
                files[lan] = data;
            }),
        );

        return new Response(JSON.stringify(files), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        console.error("Error reading files:", error);
        return new Response(
            JSON.stringify({
                message: "Error reading files",
                error: error.message as any,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}

export async function POST(request: Request) {
    try {
        const path = `${process.cwd()}/public/locales`;

        const { languages, data } = await request.json();

        languages.forEach(async (lang: string) => {
            const filePath = `${path}/${lang}.json`;
            await File.writeJsonFile(filePath, data[lang]);
        });

        return new Response(
            JSON.stringify({
                message: "File created successfully",
                data,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error: any) {
        console.error("Error writing file:", error);
        return new Response(
            JSON.stringify({
                message: "Error writing file",
                error: error.message as any,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
