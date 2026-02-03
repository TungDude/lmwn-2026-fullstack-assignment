import React from "react";
import { Stack, Divider } from "@mui/material";
import EmptyState from "../atoms/EmptyState";
import Tags from "../atoms/Tags";
import GuideHero from "../organisms/GuideHero";
import GuideHeroSkeleton from "../organisms/GuideHeroSkeleton";
import type { GuideDetail } from "@shared/packages";
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