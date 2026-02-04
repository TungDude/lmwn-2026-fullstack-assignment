import { useTheme, useMediaQuery } from "@mui/material";

export default function useResponsive() {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return {
        isMobile,
        isTablet,
        isDesktop,
        isSmallScreen
    };
}