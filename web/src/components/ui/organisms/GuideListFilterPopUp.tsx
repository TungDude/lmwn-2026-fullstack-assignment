import {
    Box,
    Typography,
    Popover,
    ClickAwayListener,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import useResponsive from "@/hooks/useResponsive";
import { useTranslation } from "react-i18next";

interface GuideListFilterPopUpProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    anchorEl: HTMLElement | null;
    selectedTags: string[];
    tagFilterOptions: string[];
    onTagFilterChange?: (selectedTags: string[]) => void;
    isLoading?: boolean;
}

const toggleButtonRootSx = {
    '& .MuiToggleButton-root': {
        width: '100%',
        border: '1px solid rgba(0, 0, 0, 0.12) !important',
        borderRadius: '4px !important',
        marginLeft: '0 !important',
        '&.Mui-selected': {
            borderColor: 'green.main',
            backgroundColor: '#b9f8cf',
            '&:hover': {
                backgroundColor: '#7bf1a8',
            },
        },
    },
}

export default function GuideListFilterPopUp({
    open,
    setOpen,
    anchorEl,
    selectedTags,
    tagFilterOptions,
    onTagFilterChange,
    isLoading,
}: Readonly<GuideListFilterPopUpProps>) {
    const { t } = useTranslation("guideList");
    const { isMobile } = useResponsive();

    const handleClickAway = () => {
        setOpen(false);
    }

    const tagOptions = tagFilterOptions.length > 0 ? tagFilterOptions : selectedTags;

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transitionDuration={200}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 2,
                        mt: 1,
                        minWidth: isMobile ? 300 : 400,
                        maxWidth: isMobile ? 350 : 500,
                    },
                },
            }}
        >
            <ClickAwayListener onClickAway={handleClickAway}>
                <Paper
                    sx={{
                        p: 2,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: 2,
                        minWidth: isMobile ? 300 : 400,
                        maxWidth: isMobile ? 350 : 500,
                    }}
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1, pb: 1 }}>
                        <Typography variant="h6">
                            {t("filter.title")}
                        </Typography>
                    </Box>
                    <Stack spacing={1}>
                        {tagOptions.length > 0 && (
                            <Stack>
                                <Typography variant="overline" sx={{ fontSize: "1rem" }} className="text-gray-400">
                                    {t("filter.tags")}
                                </Typography>
                                <ToggleButtonGroup
                                    value={selectedTags}
                                    onChange={(_: React.MouseEvent<HTMLElement>, newTags) => {
                                        onTagFilterChange?.(newTags);
                                    }}
                                    disabled={isLoading}
                                    aria-label="Tag filter"
                                    size="small"
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
                                        gap: 0.5,
                                        ...toggleButtonRootSx,
                                    }}
                                >
                                    {tagOptions.map((tag) => (
                                        <ToggleButton
                                            key={tag}
                                            value={tag}
                                            aria-label={tag}
                                        >
                                            {tag}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            </ClickAwayListener>
        </Popover>
    )
}