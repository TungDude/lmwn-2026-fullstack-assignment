import { Typography, TypographyProps, Button, Box } from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps extends TypographyProps {
    text: string;
    maxLength: number;
    showLabel?: string;
    hideLabel?: string;
    isExpanded: boolean;
    setExpanded: (expanded: boolean) => void;
}

export default function ExpandableText({
    text,
    maxLength,
    showLabel = "Show more",
    hideLabel = "Show less",
    isExpanded,
    setExpanded,
    ...typographyProps
}: Readonly<ExpandableTextProps>) {

    const isLongText = text.length > maxLength;
    const displayedText =
        !isLongText || isExpanded ? text : text.slice(0, maxLength) + "...";

    return (
        <Box flex={1} sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" {...typographyProps}>
                {displayedText}
                &nbsp;
                {isLongText && (
                    <Button
                        size="small"
                        onClick={() => setExpanded(!isExpanded)}
                        sx={{ px: 0.5, minWidth: "auto", textTransform: "none" }}
                        disableRipple={true}
                    >
                        {isExpanded ? (
                            <>
                                {hideLabel}
                                <ChevronUp strokeWidth={1} size={16} className="ml-0.5" />
                            </>
                        ) : (
                            <>
                                {showLabel}
                                <ChevronDown strokeWidth={1} size={16} className="ml-0.5" />
                            </>
                        )}
                    </Button>
                )}
            </Typography>
        </Box>
    );
}
