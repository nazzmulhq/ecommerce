import React, { FC } from "react";

import { readFileSync } from "fs";
import { join } from "path";

const getI18n = (lang: string) => {
    try {
        const filePath = join(process.cwd(), "public", "locales", `${lang}.json`);
        const fileContents = readFileSync(filePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error) {
        console.error(`Error loading ${lang} translations:`, error);
        return {};
    }
};

export interface IComponent {
    params: Promise<{
        lang: string;
    }>;
}

const Component: FC<IComponent> = async ({ params }) => {
    const { lang } = await params;
    const i18n = await getI18n(lang);
    return (
        <>
            <p>{i18n.title}</p>
            {
                // indicates very long content
                Array.from({ length: 100 }, (_, index) => (
                    <React.Fragment key={index}>
                        {index % 20 === 0 && index ? "more" : "..."}
                        <br />
                    </React.Fragment>
                ))
            }
        </>
    );
};

export default Component;
