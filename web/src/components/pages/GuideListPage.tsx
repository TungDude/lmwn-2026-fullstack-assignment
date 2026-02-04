import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography, Alert, IconButton } from "@mui/material";
import { useGuides } from "@/hooks/queries/useGuideQueries";
import GuideList from "../ui/templates/GuideList";
import GuideListFilterPopUp from "../ui/organisms/GuideListFilterPopUp";
import Searchbar from "../ui/molecules/SearchBar";
import FilterButton from "../ui/atoms/FilterButton";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/useToast";
import { RotateCw, Search } from "lucide-react";

export default function GuideListPage() {
    const navigate = useNavigate();
    const { t } = useTranslation("guideList");
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);

    const { data: guides = [], isLoading, isError, error, refetch } = useGuides();

    const handleGuideClick = (guideId: string) => {
        const guide = guides.find(g => g.id === guideId);
        navigate(`/guides/${guideId}`, { state: { guide } });
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        showToast({
            title: t("search.toast.title"),
            description: t("search.toast.description", { query }),
            severity: "success",
            icon: <Search size={20} />,
            duration: 2000,
        })
    }

    const uniqueGuideTags = Array.from(new Set(guides.flatMap(guide => guide.tags)));

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = 
            guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags = selectedTags.length < 1 || selectedTags.every(tag => guide.tags.includes(tag));
        return matchesSearch && matchesTags;
    });

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 800 }}>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Searchbar
                        value={searchQuery}
                        onSearch={handleSearch}
                        placeholder={t("searchPlaceholder")}
                        storageKey="guideSearchHistory"
                    />
                    <FilterButton
                        onFilterClick={handleFilterClick}
                        isFilterMenuOpen={Boolean(filterAnchorEl)}
                        hasActiveFilters={selectedTags.length > 0}
                    />
                </Stack>
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
                        guides={filteredGuides}
                        tagFilter={selectedTags}
                        isLoading={isLoading}
                        onGuideClick={handleGuideClick}
                    />
                )}
            </Stack>

            <GuideListFilterPopUp
                open={Boolean(filterAnchorEl)}
                setOpen={(open) => {
                    if (!open) {
                        setFilterAnchorEl(null);
                    }
                }}
                anchorEl={filterAnchorEl}
                selectedTags={selectedTags}
                tagFilterOptions={uniqueGuideTags}
                onTagFilterChange={setSelectedTags}
                isLoading={isLoading}
            />
        </Box>
    );
}