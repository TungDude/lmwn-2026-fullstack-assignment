import { Chip, Box, Typography } from "@mui/material";

interface TagsProps {
    tags: string[];
    variant?: "default" | "minimal";
    maxTags?: number;
}

export default function Tags({ tags, variant = "default", maxTags }: Readonly<TagsProps>) {
    const displayedTags = maxTags ? tags.slice(0, maxTags) : tags;
    const remainingCount = maxTags ? tags.length - maxTags : 0;

    if (variant === "minimal") {
        return (
            <Box sx={{ display: "flex", gap: 0.2, alignItems: "center", flexWrap: "wrap" }}>
                {displayedTags.map((tag, index) => (
                    <Box
                        key={`${tag}-${index}`}
                        sx={{
                            px: 0.5,
                            py: 0.25,
                            color: "black",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: 400,
                            lineHeight: 1.5,
                            border: "1px solid",
                            borderColor: "border.main",
                        }}
                    >
                        {tag}
                    </Box>
                ))}
                {remainingCount > 0 && (
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        +{remainingCount}
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", gap: 0.2, alignItems: "center", flexWrap: "wrap" }}>
            {displayedTags.map((tag, index) => (
                <Chip
                    key={`${tag}-${index}`}
                    label={tag}
                    size="small"
                    sx={{
                        height: "20px",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        bgcolor: "green.main",
                        color: "green.contrastText",
                        border: "1px solid",
                        borderColor: "green.contrastText",
                        "& .MuiChip-label": {
                            px: 1,
                            py: 0,
                        },
                    }}
                />
            ))}
            {remainingCount > 0 && (
                <Chip
                    label={`+${remainingCount}`}
                    size="small"
                    sx={{
                        height: "20px",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        bgcolor: "grey.200",
                        color: "text.secondary",
                        "& .MuiChip-label": {
                            px: 1,
                            py: 0,
                        },
                    }}
                />
            )}
        </Box>
    );
}