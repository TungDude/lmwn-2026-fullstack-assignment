import { useState } from "react";
import { Stack, Box, Typography, Skeleton } from "@mui/material";
import ExpandableText from "../atoms/ExpandableText";
import type { GuideDetail } from "@shared/packages";
import { formatDateTime } from "@/lib/utils";

const MAX_DESCRIPTION_LENGTH = 200;
const MIN_DESCRIPTION_LENGTH = 100;

interface GuideHeroProps {
    guide: GuideDetail;
    descriptionType?: "short" | "full" | "auto";
    expandableDescription?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    onGuideClick?: (guideId: string) => void;
};

export default function GuideHero({ guide, descriptionType = "auto", expandableDescription = false, header, footer, onGuideClick }: Readonly<GuideHeroProps>) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

    const handleGuideClick = () => {
        onGuideClick?.(guide.id);
    };

    const getDescription = () => {
        const { description, shortDescription } = guide;

        switch (descriptionType) {
            case "short":
                return shortDescription;

            case "full":
                return description;

            case "auto":
            default:
                if (description.length <= MAX_DESCRIPTION_LENGTH) {
                    return description;
                }

                if (shortDescription.length >= MIN_DESCRIPTION_LENGTH) {
                    return shortDescription;
                }

                return description.slice(0, MAX_DESCRIPTION_LENGTH) + "...";
        }
    };

    return (
        <Stack spacing={1}>
            {header &&
                <Box sx={{ width: "100%" }}>{header}</Box>
            }
            <Stack
                spacing={1}
                onClick={handleGuideClick}
                sx={{ cursor: onGuideClick ? "pointer" : "default" }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        "&:hover": {
                            opacity: onGuideClick ? 0.9 : 1,
                        }
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            borderRadius: 2,
                            opacity: imageLoaded ? 0 : 1,
                            display: imageLoaded ? "none" : "block",
                            transition: "opacity 0.3s ease-in-out"
                        }}
                    />
                    <Box
                        component="img"
                        src={guide.coverPhoto.largeUrl}
                        alt={guide.title}
                        onLoad={() => setImageLoaded(true)}
                        sx={{
                            width: "100%",
                            borderRadius: 2,
                            aspectRatio: "16/9",
                            objectFit: "cover",
                            opacity: imageLoaded ? 1 : 0,
                            transition: "opacity 0.3s ease-in-out"
                        }}
                    />
                </Box>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                        {formatDateTime(guide.writeDate)}
                    </Typography>
                    <Typography variant="h4">{guide.title}</Typography>
                    {expandableDescription ? (
                        <ExpandableText
                            text={getDescription()}
                            variant="body1"
                            showLabel="Show more"
                            hideLabel="Show less"
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            isExpanded={isDescriptionExpanded}
                            setExpanded={setDescriptionExpanded}
                            textAlign="justify"
                        />
                    ) : (
                        <Typography variant="body1" color="text.secondary" textAlign="justify">
                            {getDescription()}
                        </Typography>
                    )}
                    {footer &&
                        <Box sx={{ width: "100%" }}>{footer}</Box>
                    }
                </Stack>
            </Stack>
        </Stack>
    );
}