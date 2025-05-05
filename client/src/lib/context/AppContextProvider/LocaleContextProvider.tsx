"use client";

import defaultConfig from "@lib/constants/defaultConfig";
import { TLanguage } from "@src/types/basic";
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export interface LocaleContextData {
    locale: TLanguage;
    rtlLocale: string[];
}

export interface LocaleActionsData {
    updateLocale: (locale: TLanguage) => void;
}

export const LocaleContext = createContext<LocaleContextData>({
    locale: defaultConfig.locale,
    rtlLocale: defaultConfig.rtlLocale,
});
export const LocaleActionsContext = createContext<LocaleActionsData>({
    updateLocale: () => {},
});

export const useLocaleContext = () => useContext(LocaleContext);

export const useLocaleActionsContext = () => useContext(LocaleActionsContext);

interface LocaleContextProviderProps {
    children: ReactNode;
}

const LocaleContextProvider: React.FC<LocaleContextProviderProps> = ({ children }) => {
    const [locale, setLocale] = useState<TLanguage>(defaultConfig.locale);

    // Memoize the updateLocale function to maintain referential equality
    const updateLocale = useCallback((newLocale: TLanguage) => {
        setLocale(newLocale);
    }, []);

    // Memoize the locale context value
    const localeContextValue = useMemo(
        () => ({
            locale,
            rtlLocale: defaultConfig.rtlLocale,
        }),
        [locale],
    );

    // Memoize the actions context value
    const actionsContextValue = useMemo(
        () => ({
            updateLocale,
        }),
        [updateLocale],
    );

    return (
        <LocaleContext.Provider value={localeContextValue}>
            <LocaleActionsContext.Provider value={actionsContextValue}>{children}</LocaleActionsContext.Provider>
        </LocaleContext.Provider>
    );
};

export default React.memo(LocaleContextProvider);
