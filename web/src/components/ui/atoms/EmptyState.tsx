import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
    message: string;
};

export default function EmptyState({ message }: Readonly<EmptyStateProps>) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                py: 4,
                px: 2,
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        </Box>
    )
}