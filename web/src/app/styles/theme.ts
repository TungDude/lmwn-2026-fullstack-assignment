import { createTheme } from "@mui/material";
import { typographyTheme } from "./typography-theme";
import { chipTheme } from "./chip-theme";

export const theme = createTheme({
    typography: typographyTheme,
    components: {
        MuiChip: chipTheme,
    },
});

export default theme;