import React from "react";
import languageData from "./data";

import { LayoutDirection } from "@lib/constants/AppEnums";
import { useLayoutActionsContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useLocaleActionsContext, useLocaleContext } from "@lib/context/AppContextProvider/LocaleContextProvider";
import { LanguageProps } from "@src/types/Apps";
import { Dropdown } from "antd";
import { IoLanguageOutline } from "react-icons/io5";
import { StyledLangBtn, StyledLangIcon, StyledLangItem, StyledLangText } from "./index.styled";

type AppLanguageSwitcherProps = {
    iconOnly?: boolean;
};
const AppLanguageSwitcher: React.FC<AppLanguageSwitcherProps> = () => {
    const { rtlLocale, locale } = useLocaleContext();
    const { updateLocale } = useLocaleActionsContext();
    const { updateDirection } = useLayoutActionsContext();

    const changeLanguage = (language: LanguageProps) => {
        if (rtlLocale.indexOf(language.locale) !== -1) {
            updateDirection(LayoutDirection.RTL);
        } else {
            updateDirection(LayoutDirection.LTR);
        }
        updateLocale(language);
    };

    const items = languageData.map((language, index) => {
        return {
            key: index,
            label: (
                <StyledLangItem key={index} onClick={() => changeLanguage(language)}>
                    <h4>{language.name}</h4>
                </StyledLangItem>
            ),
        };
    });

    return (
        <>
            <Dropdown menu={{ items }} overlayStyle={{ zIndex: 1052 }} trigger={["click"]}>
                <StyledLangBtn className="ant-dropdown-link langBtn" onClick={e => e.preventDefault()}>
                    <StyledLangIcon>
                        <IoLanguageOutline />
                    </StyledLangIcon>
                    <StyledLangText className="lang-text">{locale.name}</StyledLangText>
                </StyledLangBtn>
            </Dropdown>
        </>
    );
};

export default AppLanguageSwitcher;
