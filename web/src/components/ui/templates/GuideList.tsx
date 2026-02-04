import React from "react";
import { Stack, Divider, Typography } from "@mui/material";
import EmptyState from "../atoms/EmptyState";
import Tags from "../atoms/Tags";
import GuideHero from "../organisms/GuideHero";
import GuideHeroSkeleton from "../organisms/GuideHeroSkeleton";
import type { GuideDetail } from "@shared/packages";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GuideListProps {
    guides: GuideDetail[];
    isLoading?: boolean;
    onGuideClick?: (guideId: string) => void;
};

export default function GuideList({ guides, isLoading, onGuideClick }: Readonly<GuideListProps>) {
    const { t } = useTranslation("guideList");

    const handleGuideClick = (guideId: string) => {
        if (isLoading) return;

        onGuideClick?.(guideId);
    }

    const renderItems = () => {
        if (isLoading) {
            return ["s1", "s2", "s3"].map(key => (
                <GuideHeroSkeleton key={key} />
            ));
        }

        if (guides.length === 0) {
            return <EmptyState message={t("emptyGuide")} />;
        }

        return guides.map(guide => (
            <GuideHero
                key={guide.id}
                guide={guide}
                header={<Tags tags={guide.tags} />}
                footer={
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="end"
                        spacing={0.5}
                        sx={{
                            cursor: "pointer",
                            color: "text.secondary",
                            "&:hover": {
                                color: "primary.main",
                                "& .lucide": {
                                    transform: "translateX(3px)"
                                }
                            },
                            transition: "color 0.2s ease-in-out"
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                userSelect: "none",
                                fontStyle: "italic",
                                textDecoration: "underline",
                            }}
                        >
                            {t("readMore")}
                        </Typography>
                        <ChevronRight
                            size={16}
                            style={{ transition: "transform 0.2s ease-in-out" }}
                            className="lucide"
                        />
                    </Stack>
                }
                onGuideClick={handleGuideClick}
            />
        ));
    };

    return (
        <Stack divider={<Divider />} spacing={2}>
            {renderItems()}
        </Stack>
    );
}