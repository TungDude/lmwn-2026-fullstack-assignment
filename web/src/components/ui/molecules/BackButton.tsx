import { Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
    const { t } = useTranslation("ui");
    const navigate = useNavigate();

    return (
        <Stack
            component="button"
            direction="row"
            alignItems="center"
            spacing={0.5}
            onClick={() => navigate(-1)}
            sx={{
                cursor: "pointer",
                color: "text.secondary",
                "&:hover": {
                    color: "primary.main",
                    "& .lucide": {
                        transform: "translateX(-3px)"
                    }
                },
                transition: "color 0.2s ease-in-out"
            }}
        >
            <ChevronLeft
                size={20}
                style={{ transition: "transform 0.2s ease-in-out" }}
                className="lucide"
            />
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    userSelect: "none"
                }}
            >
                {t("backButton.label")}
            </Typography>
        </Stack>
    );
}