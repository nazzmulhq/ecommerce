import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        font: {
            family: string;
            weight: {
                light: number | string;
                regular: number | string;
                medium: number | string;
                bold: number | string;
                extraBold: number | string;
                [key: string]: number | string;
            };
            size: {
                xs: string;
                sm: string;
                base: string;
                md: string;
                lg: string;
                xl: string;
                [key: string]: string;
            };
        };
        sizes: {
            borderRadius: {
                circle: string;
                [key: string]: string;
            };
            framed: {
                base: string;
                [key: string]: string;
            };
            [key: string]: any;
        };
        palette: {
            primary: {
                main: string;
                [key: string]: string;
            };
            secondary: {
                main: string;
                [key: string]: string;
            };
            text: {
                primary: string;
                secondary: string;
                [key: string]: string;
            };
            background: {
                paper: string;
                default: string;
                [key: string]: string;
            };
            white: string;
            gray: {
                [key: number | string]: string;
            };
            tooltipBg: string;
            [key: string]: any;
        };
        breakpoints: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
            [key: string]: number;
        };
        cardRadius: string;
        [key: string]: any;
    }
}
