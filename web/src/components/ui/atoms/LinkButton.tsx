import { Button, Stack, Box, Typography } from "@mui/material";
import { ExternalLink } from "lucide-react";

interface LinkButtonProps {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
};

export default function LinkButton({ label, icon, onClick }: Readonly<LinkButtonProps>) {
    return (
        <Button
            onClick={onClick}
            sx={{
                p: 0,
                width: "100%",
                textTransform: "none",
            }}
        >
            <Stack
                sx={{
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    p: 0.5,
                    alignItems: "center"
                }}
                direction="row"
                spacing={1}
            >
                {icon}
                <Box 
                    flex={1} 
                    textAlign="left"
                    sx={{ minWidth: 0 }}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {label}
                    </Typography>
                </Box>
                <Box color="primary.main">
                    <ExternalLink size={12} />
                </Box>
            </Stack>
        </Button>
    )
}