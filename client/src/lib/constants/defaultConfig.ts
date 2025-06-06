import { DefaultTheme } from "styled-components";
import { Fonts, FooterType, LayoutDirection, MenuStyle, ThemeMode, ThemeStyle, ThemeStyleRadius } from "./AppEnums";

export const componentTokens = {};

export const appThemeFont = {
    family: ["Be Vietnam", "sans-serif"].join(","),
    weight: {
        light: Fonts.LIGHT,
        regular: Fonts.REGULAR,
        medium: Fonts.MEDIUM,
        bold: Fonts.BOLD,
        extraBold: Fonts.EXTRA_BOLD,
    },
    size: {
        xs: "10px",
        sm: "12px",
        base: "14px",
        md: "15px",
        lg: "16px",
        xl: "18px",
    },
};

export interface SidebarData {
    sidebarBgColor: string;
    sidebarTextColor: string;
    sidebarHeaderColor: string;
    sidebarMenuSelectedBgColor: string;
    sidebarMenuSelectedTextColor?: string;
    mode: string;
}

export const DarkSidebar = {
    sidebarBgColor: "#313541",
    sidebarTextColor: "#fff",
    sidebarHeaderColor: "#313541",
    sidebarMenuSelectedBgColor: "#F4F7FE",
    sidebarMenuSelectedTextColor: "rgba(0, 0, 0, 0.87)",
    mode: ThemeMode.DARK,
};
export const LightSidebar = {
    sidebarBgColor: "#fff",
    sidebarTextColor: "rgba(0, 0, 0, 0.60)",
    sidebarHeaderColor: "#fff",
    sidebarMenuSelectedBgColor: "#F4F7FE",
    sidebarMenuSelectedTextColor: "rgba(0, 0, 0, 0.87)",
    mode: ThemeMode.LIGHT,
};
export const textLight = {
    primary: "rgb(17, 24, 39)",
    secondary: "rgb(107, 114, 128)",
    disabled: "rgb(149, 156, 169)",
    hint: "rgb(174, 175, 184)",
    inverse: "#ffffff", // For text on dark backgrounds
};

export const textDark = {
    primary: "rgb(255,255,255)",
    secondary: "rgb(229, 231, 235)",
    disabled: "rgb(156, 163, 175)",
    inverse: "#000000", // For text on light backgrounds
};

export const backgroundDark = {
    paper: "#2B3137",
    default: "#1F2527",
    inverse: "#f5f5f5",
    selected: "#3a4148", // For selected items in dark mode
    hover: "#363e46",
};

export const backgroundLight = {
    paper: "#FFFFFF",
    default: "#F4F7FE",
    inverse: "#2B3137",
    selected: "#f0f7ff", // For selected items in light mode
    hover: "#f9f9f9",
};

export const defaultTheme: { theme: DefaultTheme } = {
    theme: {
        spacing: 4,
        cardRadius: ThemeStyleRadius.ROUNDED,
        cardRadius30: ThemeStyleRadius.MODERN,
        cardShadow: "0 0 5px 5px rgba(0,0,0,0.03)",
        direction: LayoutDirection.LTR, //ltr, rtl
        mode: ThemeMode.LIGHT,
        palette: {
            mode: ThemeMode.LIGHT,
            borderColor: "#0000001f",
            dividerColor: "rgba(0, 0, 0, 0.06)",
            tooltipBg: "rgba(0, 0, 0, 0.75)",
            tooltipText: "#ffffff",
            // Initialize selection object properly
            selection: {
                bg: "#f0f7ff",
                text: "rgb(17, 24, 39)",
                bgDark: "#3a4148",
                textDark: "#ffffff",
            },
            background: backgroundLight,
            primary: {
                main: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#3F51B5",
                contrastText: "#fff",
            },
            secondary: {
                main: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#F04F47",
            },
            success: {
                main: "#52c41a", //'#11C15B',
                light: "#D9F5E5",
            },
            warning: {
                main: "#FF5252",
                light: "#FFECDC",
            },
            gray: {
                50: "#fafafa",
                100: "#F5F5F5", //#F5F6FA,
                200: "#eeeeee", //#edf2f7',
                300: "#E0E0E0",
                400: "#bdbdbd", //#c5c6cb,
                500: "#9e9e9e", //#A8A8A8',
                600: "#757575", //#666666',
                700: "#616161", //'#4a5568',
                800: "#201e21",
                900: "#212121", //'#1a202c',
                A100: "#d5d5d5",
                A200: "#aaaaaa",
                A400: "#303030",
                A700: "#616161",
            },
            black: "#000",
            white: "#FFFFFF",
            orange: {
                5: "#ffa940",
                6: "#fa8c16",
            },
            cyan: {
                7: "#08979c",
            },
            red: {
                6: "#f5222d",
            },
            green: {
                3: "#b7eb8f",
                5: "#73d13d",
                6: "#52c41a",
                7: "#389e0d",
            },
            blue: {
                5: "#40a9ff",
                7: "#096dd9",
            },
            text: textLight,
        },
        status: {
            danger: "orange",
        },
        divider: "rgba(224, 224, 224, 1)",
        font: appThemeFont,
        sidebar: {
            light: LightSidebar,
            dark: DarkSidebar,
        },
        breakpoints: {
            xs: 480,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1600,
        },
        sizes: {
            line: {
                base: 1.35,
            },
            borderRadius: {
                base: "4px",
                circle: "50%",
            },
            framed: {
                base: "20px",
            },
        },
    },
};

const defaultConfig = {
    sidebar: {
        borderColor: "#757575",
        menuStyle: MenuStyle.DEFAULT as string,
        allowSidebarBgImage: false,
        sidebarBgImageId: 1,
        colorSet: LightSidebar,
    },

    locale: {
        languageId: "english",
        locale: "en",
        name: "English",
        icon: "us",
    },
    themeStyle: ThemeStyle.STANDARD as ThemeStyle,
    direction: LayoutDirection.LTR,
    themeMode: process.env.NEXT_PUBLIC_THEME_MODE as string,
    footerType: FooterType.FLUID,
    navStyle: process.env.NEXT_PUBLIC_NAV_STYLE as string,
    layoutType: process.env.NEXT_PUBLIC_LAYOUT_TYPE as string,
    footer: true,
    rtlLocale: ["ar"],
};
export default defaultConfig;
