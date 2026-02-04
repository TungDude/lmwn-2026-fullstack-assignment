declare module "@mui/material/styles" {
    interface Palette {
        green: {
            main: string;
            contrastText: string;
        };
        gray: {
            main: string;
            contrastText: string;
        };
        border: {
            main: string;
        }
    }

    interface PaletteOptions {
        green?: {
            main?: string;
            contrastText?: string;
        };
        gray?: {
            main?: string;
            contrastText?: string;
        };
        border?: {
            main?: string;
        };
    }
}

export const paletteTheme = {
    green: {
        main: "#00C853",
        contrastText: "#FFFFFF",
    },
    gray: {
        main: "#070711",
        contrastText: "#FFFFFF",
    },
    border: {
        main: "#ACACAC"
    }
};