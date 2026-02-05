import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from "@/app/styles/theme";

export const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {ui}
        </ThemeProvider>
    );
};