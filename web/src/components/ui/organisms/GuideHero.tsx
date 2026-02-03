import { useState } from "react";
import { Stack, Box, Typography, Skeleton } from "@mui/material";
import GuideHeader from "../atoms/GuideHeader";
import type { GuideDetail } from "@shared/packages";
import { formatDateTime } from "@/lib/utils";

const MAX_DESCRIPTION_LENGTH = 200;
const MIN_DESCRIPTION_LENGTH = 100;

interface GuideHeroProps {
    guide: GuideDetail;
    header?: React.ReactNode;
    onGuideClick?: (guideId: string) => void;
};

export default function GuideHero({ guide, header, onGuideClick }: Readonly<GuideHeroProps>) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleGuideClick = () => {
        onGuideClick?.(guide.id);
    };

    const getDescription = () => {
        const { description, shortDescription } = guide;

        if (description.length <= MAX_DESCRIPTION_LENGTH) {
            return description;
        }

        if (shortDescription.length >= MIN_DESCRIPTION_LENGTH) {
            return shortDescription;
        }

        return description.slice(0, MAX_DESCRIPTION_LENGTH) + "...";
    };

    return (
        <Stack spacing={2}>
            {header && <GuideHeader>{header}</GuideHeader>}
            <Stack
                spacing={2}
                onClick={handleGuideClick}
                sx={{ cursor: onGuideClick ? "pointer" : "default" }}
            >
                <Box sx={{ position: "relative", width: "100%" }}>
                    {!imageLoaded && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={300}
                            sx={{ borderRadius: 2 }}
                        />
                    )}
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
                    <Typography variant="caption" color="textSecondary">
                        {formatDateTime(guide.writeDate)}
                    </Typography>
                    <Typography variant="h3">{guide.title}</Typography>
                    <Typography variant="body1" color="textSecondary">
                        {getDescription()}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}