import { useParams, useLocation } from "react-router-dom";
import { Box, Stack, Divider, Alert, Typography, IconButton } from "@mui/material";
import Tags from "../ui/atoms/Tags";
import EmptyState from "../ui/atoms/EmptyState";
import BackButton from "../ui/molecules/BackButton";
import GuideHero from "../ui/organisms/GuideHero";
import GuideItemList from "../ui/templates/GuideItemList";
import { useGuideItemsByGuideId } from "@/hooks/useGuideQueries";
import type { GuideDetail } from "@shared/packages";
import { useTranslation } from "react-i18next";
import useResponsive from "@/hooks/useResponsive";
import { RotateCw } from "lucide-react";

export default function GuideDetailPage() {
    const { t } = useTranslation("guideDetail");
    const { guideId } = useParams<{ guideId: string }>();
    const location = useLocation();
    const guide = location.state?.guide as GuideDetail | undefined;
    const { isMobile, isSmallScreen } = useResponsive();
    const { data: guideItems = [], isLoading, isError, error, refetch } = useGuideItemsByGuideId(guideId ?? "");

    const getMaxTags = () => {
        switch (true) {
            case isMobile:
                return 3;
            case isSmallScreen:
                return 6;
            default:
                return undefined;
        }
    };

    const getErrorMessage = () => {
        if (!guideId) {
            return t("missingGuideId");
        }

        if (error instanceof Error) {
            return error.message;
        } else {
            return t("error");
        }
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 800 }}>
                {guide ? (
                    <GuideHero
                        guide={guide}
                        descriptionType="full"
                        expandableDescription={true}
                        header={
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 2 }}>
                                <BackButton />
                                <Tags tags={guide.tags} maxTags={getMaxTags()} />
                            </Box>
                        }
                    />
                ) : (
                    <EmptyState message={t("missingGuideData")} />
                )}
                <Divider />

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
                        {getErrorMessage()}
                    </Alert>
                ) : (
                    <>
                        <Typography variant="h5" fontWeight={400}>
                            {t("editorsPick")} ({guideItems.length})
                        </Typography>
                        <Divider />
                        <GuideItemList guideItems={guideItems} isLoading={isLoading} />
                    </>
                )}
            </Stack>
        </Box>
    );
}