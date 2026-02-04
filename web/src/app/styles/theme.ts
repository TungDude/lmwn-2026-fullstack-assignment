import { createTheme, responsiveFontSizes } from "@mui/material";
import { chipTheme } from "./chip-theme";
import { cardTheme } from "./card-theme";
import { paletteTheme } from "./palette-theme";

export const theme = responsiveFontSizes(createTheme({
    palette: paletteTheme,
    components: {
        MuiCard: cardTheme,
        MuiChip: chipTheme,
    },
}));

export default theme;