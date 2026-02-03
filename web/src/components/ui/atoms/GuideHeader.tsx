import { Box } from "@mui/material";

interface GuideHeaderProps {
    children: React.ReactNode;
}

export default function GuideHeader({ children }: Readonly<GuideHeaderProps>) {
    return (
        <Box sx={{ width: "100%" }}>
            {children}
        </Box>
    );
};