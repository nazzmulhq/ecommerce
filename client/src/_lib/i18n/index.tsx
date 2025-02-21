// import json

import { useEffect, useState } from "react";
import bn from "./locales/bn.json";
import en from "./locales/en.json";

interface Locales {
    en: keyof typeof en;
    bn: keyof typeof bn;
}

const useTranslation = () => {
    const [locale, setLocale] = useState<keyof Locales>("en");
    const locales = {
        en,
        bn,
    };

    const onClickChangeLanguage = () => {
        const newLocale = locale === "en" ? "bn" : "en";
        setLocale(newLocale);
        localStorage.setItem("lang", newLocale);
        document.documentElement.lang = newLocale;
    };

    useEffect(() => {
        const lang = localStorage.getItem("lang");
        if (lang) {
            document.documentElement.lang = lang;
            setLocale(lang as keyof Locales);
        } else {
            localStorage.setItem("lang", "en");
        }
    }, []);

    return {
        translation: locales[locale],
        locale,
        setLocale,
        onClickChangeLanguage,
    };
};

export default useTranslation;
