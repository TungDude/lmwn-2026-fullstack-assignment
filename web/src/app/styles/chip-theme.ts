import type { Components, Theme } from "@mui/material";
import { baseTheme } from "./base-theme";

export const chipTheme: Components<Theme>['MuiChip'] = {
    styleOverrides: {
        root: {
            fontSize: "0.7rem",
            height: "20px",
            [baseTheme.breakpoints.up("sm")]: {
                fontSize: "0.75rem",
                height: "24px",
            },
            [baseTheme.breakpoints.up("md")]: {
                fontSize: "0.85rem",
                height: "28px",
            },
        },
        label: {
            paddingX: "8px",
            [baseTheme.breakpoints.up("sm")]: {
                paddingX: "10px",
            },
            [baseTheme.breakpoints.up("md")]: {
                paddingX: "12px",
            },
        },
    },
};