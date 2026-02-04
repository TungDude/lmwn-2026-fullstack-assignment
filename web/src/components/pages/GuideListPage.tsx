import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography, Alert, IconButton } from "@mui/material";
import { useGuides } from "@/hooks/queries/useGuideQueries";
import GuideList from "../ui/templates/GuideList";
import { useTranslation } from "react-i18next";
import { RotateCw } from "lucide-react";

export default function GuideListPage() {
    const { t } = useTranslation("guideList");
    const navigate = useNavigate();
    const { data: guides = [], isLoading, isError, error, refetch } = useGuides();

    const handleGuideClick = (guideId: string) => {
        const guide = guides.find(g => g.id === guideId);
        navigate(`/guides/${guideId}`, { state: { guide } });
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 800 }}>
                <Typography variant="h3">{t("title")}</Typography>
                {isError ? (
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="retry"
                                size="small"
                                color="error"
                                onClick={() => refetch()}
                            >
                                <RotateCw size={16} />
                            </IconButton>
                        }
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        {error instanceof Error
                            ? error.message
                            : t("error")}
                    </Alert>
                ) : (
                    <GuideList
                        guides={guides}
                        isLoading={isLoading}
                        onGuideClick={handleGuideClick}
                    />
                )}
            </Stack>
        </Box>
    );
}