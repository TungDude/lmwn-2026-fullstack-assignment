import type { TypographyVariantsOptions } from "@mui/material/styles";
import { baseTheme } from "./base-theme";

export const typographyTheme: TypographyVariantsOptions = {
    h1: {
        fontSize: "2rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "2.5rem",
        },
        [baseTheme.breakpoints.up("md")]: {
            fontSize: "3rem",
        },
    },
    h2: {
        fontSize: "1.75rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "2rem",
        },
        [baseTheme.breakpoints.up("md")]: {
            fontSize: "2.5rem",
        },
    },
    h3: {
        fontSize: "1.2rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "1.5rem",
        },
        [baseTheme.breakpoints.up("md")]: {
            fontSize: "2.4rem",
        },
    },
    h4: {
        fontSize: "1.1rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "1.25rem",
        },
        [baseTheme.breakpoints.up("md")]: {
            fontSize: "1.5rem",
        },
    },
    h5: {
        fontSize: "1rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "1.125rem",
        },
        [baseTheme.breakpoints.up("md")]: {
            fontSize: "1.25rem",
        },
    },
    h6: {
        fontSize: "0.95rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "1rem",
        },
        [baseTheme.breakpoints.up("md")]: {
            fontSize: "1.125rem",
        },
    },
    subtitle1: {
        fontSize: "0.875rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "1rem",
        },
        fontWeight: 500,
    },
    subtitle2: {
        fontSize: "0.8125rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "0.875rem",
        },
        fontWeight: 500,
    },
    body1: {
        fontSize: "0.875rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "1rem",
        },
    },
    body2: {
        fontSize: "0.75rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "0.875rem",
        },
    },
    button: {
        fontSize: "0.8125rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "0.875rem",
        },
        textTransform: "uppercase" as const,
        fontWeight: 500,
    },
    caption: {
        fontSize: "0.6875rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "0.75rem",
        },
    },
    overline: {
        fontSize: "0.6875rem",
        [baseTheme.breakpoints.up("sm")]: {
            fontSize: "0.75rem",
        },
        textTransform: "uppercase" as const,
        fontWeight: 400,
    },
};