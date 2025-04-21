import { getI18n } from "@lib/actions/settings/i18n";
import React, { FC } from "react";

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
