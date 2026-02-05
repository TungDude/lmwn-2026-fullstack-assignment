import { useState } from "react";
import { Box, Stack, Typography, Rating, Divider, IconButton, useTheme } from "@mui/material";
import ImageGallery from "../molecules/ImageGallery";
import Tags from "../atoms/Tags";
import LinkButton from "../atoms/LinkButton";
import EmptyState from "../atoms/EmptyState";
import ExpandableText from "../atoms/ExpandableText";
import type { GuideItemWithRestaurant } from "@shared/packages/schemas";
import useResponsive from "@/hooks/useResponsive";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { Phone, Map, Globe, Clock, Share2, BadgeCheck, Motorbike, ShoppingBag } from "lucide-react";

interface GuideItemProps {
    guideItem: GuideItemWithRestaurant;
    onImageClick?: (index: number) => void;
}

export default function GuideItem({ guideItem, onImageClick }: Readonly<GuideItemProps>) {
    const { t } = useTranslation("guideDetail");
    const { t: tCommon } = useTranslation("common");
    const { t: tUi } = useTranslation("ui");
    const { isMobile, isSmallScreen, isTablet } = useResponsive();
    const { showToast } = useToast();
    const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
    const theme = useTheme();

    if (!guideItem.restaurant) {
        return (
            <EmptyState message={t("missingRestaurantData")} />
        )
    }

    const restaurant = guideItem.restaurant;
    const hasSinglePhoto = guideItem.photos.length === 1;
    const shouldShowDescriptionInline = isTablet && hasSinglePhoto;
    const shouldShowSidePanel = !isSmallScreen;
    const shouldShowContactInfoInSidePanel = !isSmallScreen;

    const handleOpenUrl = () => {
        const url = restaurant.url;
        if (url) {
            window.open(url.startsWith('http') ? url : `https://${url}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleOpenLine = () => {
        const line = restaurant.line;
        if (line) {
            window.open(`https://line.me/ti/p/~${line}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleOpenInstagram = () => {
        const instagram = restaurant.instagram;
        if (instagram) {
            window.open(`https://instagram.com/${instagram}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleOpenFacebook = () => {
        const facebook = restaurant.facebook;
        if (facebook) {
            window.open(`https://facebook.com/${facebook}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleOpenMap = () => {
        const { lat, lng } = restaurant;
        if (lat && lng) {
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const handleCallPhone = () => {
        const phoneNo = restaurant.phoneNo;
        if (phoneNo) {
            globalThis.location.href = `tel:${phoneNo}`;
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: restaurant.name,
            text: `${restaurant.name}\n${guideItem.description || ''}`,
            url: restaurant.url || globalThis.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error("Error sharing content:", error);
                    showToast({
                        title: t("toast.shareFailed.title"),
                        description: t("toast.shareFailed.description"),
                        severity: "error",
                    });
                }
            }
        } else {
            showToast({
                title: t("toast.shareNotSupported.title"),
                description: t("toast.shareNotSupported.description"),
                severity: "warning",
            });
        }
    };

    const getDayName = (day: number) => {
        const days = [
            tCommon("weekDay.monday"),
            tCommon("weekDay.tuesday"),
            tCommon("weekDay.wednesday"),
            tCommon("weekDay.thursday"),
            tCommon("weekDay.friday"),
            tCommon("weekDay.saturday"),
            tCommon("weekDay.sunday"),
        ];
        return days[day];
    };

    const aggregateWorkingHours = (workingHours: Array<{ day: number; open: string; close: string }>) => {
        if (!workingHours || workingHours.length === 0) return [];

        const sorted = [...workingHours].sort((a, b) => a.day - b.day);
        const aggregated: Array<{ days: number[]; open: string; close: string }> = [];

        // Convert to 0-indexed (Mon=0, Sun=6)
        const hours = sorted.map(h => ({
            day: h.day - 1,
            open: h.open,
            close: h.close,
        }));

        let current = {
            days: [hours[0].day],
            open: hours[0].open,
            close: hours[0].close,
        };

        for (let i = 1; i < hours.length; i++) {
            const prev = hours[i - 1];
            const curr = hours[i];

            // Check if consecutive and same hours
            if (
                curr.open === current.open &&
                curr.close === current.close &&
                curr.day === prev.day + 1
            ) {
                current.days.push(curr.day);
            } else {
                aggregated.push(current);
                current = {
                    days: [curr.day],
                    open: curr.open,
                    close: curr.close,
                };
            }
        }
        aggregated.push(current);

        // Merge Sunday (6) with Monday (0) if they wrap around
        if (aggregated.length > 1) {
            const first = aggregated[0];
            const last = aggregated.at(-1)!;

            if (
                last.days.includes(6) &&
                first.days[0] === 0 &&
                last.open === first.open &&
                last.close === first.close
            ) {
                aggregated[0] = {
                    days: [...last.days, ...first.days],
                    open: first.open,
                    close: first.close,
                };
                aggregated.pop();
            }
        }

        return aggregated;
    };

    const formatDayRange = (days: number[]) => {
        if (days.length === 1) {
            return getDayName(days[0]);
        }

        if (isWrapAroundDays(days)) {
            return getWrapAroundDayRange(days);
        }

        return `${getDayName(days[0])} - ${getDayName(days.at(-1)!)}`;
    };

    const isWrapAroundDays = (days: number[]) => {
        const hasSunday = days.includes(6);
        const hasMonday = days.includes(0);
        return hasSunday && hasMonday && days.length > 1;
    };

    const getWrapAroundDayRange = (days: number[]) => {
        const sortedDays = [...days].sort((a, b) => a - b);

        if (sortedDays[0] === 0 && sortedDays.at(-1) === 6) {
            let breakIndex = -1;
            for (let i = 0; i < sortedDays.length - 1; i++) {
                if (sortedDays[i + 1] - sortedDays[i] > 1) {
                    breakIndex = i;
                    break;
                }
            }

            if (breakIndex >= 0) {
                return `${getDayName(sortedDays[breakIndex + 1])} - ${getDayName(sortedDays[breakIndex])}`;
            }
        }

        return `${getDayName(sortedDays[0])} - ${getDayName(sortedDays.at(-1)!)}`;
    };

    const aggregatedHours = restaurant.workingHours
        ? aggregateWorkingHours(restaurant.workingHours)
        : [];

    const renderWorkingHours = () => {
        if (aggregatedHours.length === 0) return null;

        return (
            <Stack spacing={1}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Clock size={16} color={theme.palette.grey[800]} />
                    <Typography variant="subtitle2" fontWeight={500} color="text.primary">
                        {t("workingHours")}
                    </Typography>
                </Box>
                <Stack spacing={0.5} pl={3}>
                    {aggregatedHours.map((hours, index) => (
                        <Box key={hours.days.join(",") + index} display="flex" justifyContent="space-between" gap={2}>
                            <Typography variant="body2" color="text.secondary">
                                {formatDayRange(hours.days)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {hours.open} - {hours.close}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Stack>
        );
    };

    const renderContactInfo = () => {
        return (
            <Stack spacing={1} flex={1} minWidth={0}>
                <Typography variant="subtitle2" fontWeight={500}>
                    {t("contactInfo")}
                </Typography>
                {restaurant.phoneNo && (
                    <LinkButton
                        label={restaurant.phoneNo}
                        icon={<Phone size={16} color={theme.palette.grey[800]} style={{ flexShrink: 0 }} />}
                        onClick={handleCallPhone}
                    />
                )}
                {restaurant.address && (
                    <LinkButton
                        label={restaurant.address}
                        icon={<Map size={16} color={theme.palette.grey[800]} style={{ flexShrink: 0 }} />}
                        onClick={handleOpenMap}
                    />
                )}
                {!restaurant.phoneNo && !restaurant.address && (
                    <EmptyState message={t("missingContactInfo")} />
                )}
            </Stack>
        )
    };

    const renderDescription = () => {
        return (
            <ExpandableText
                text={guideItem.description || t("noDescription")}
                showLabel={tUi("expandableText.showMore")}
                hideLabel={tUi("expandableText.showLess")}
                maxLength={300}
                isExpanded={isDescriptionExpanded}
                setExpanded={setDescriptionExpanded}
                textAlign="justify"
                flex={1}
                sx={{
                    lineHeight: 1.6,
                }}
            />
        );
    };

    const renderSidePanel = () => {
        return (
            <Stack
                spacing={1}
                divider={<Divider orientation="horizontal" />}
                sx={{ maxWidth: isSmallScreen ? 380 : 280, minWidth: 250 }}
            >
                {renderWorkingHours()}
                {shouldShowContactInfoInSidePanel && renderContactInfo()}
            </Stack>
        );
    };

    const renderSocialMedia = () => {
        const hasSocial = restaurant.line ||
            restaurant.instagram ||
            restaurant.facebook ||
            restaurant.url;
        if (!hasSocial) return null;

        return (
            <Stack spacing={1} flex={1} minWidth={0}>
                <Typography variant="subtitle2" fontWeight={500}>
                    {t("socialMedia")}
                </Typography>
                {restaurant.line && (
                    <LinkButton
                        label={restaurant.line}
                        icon={<img src="/icons/line-icon.svg" alt="Line" width={18} height={18} />}
                        onClick={handleOpenLine}
                    />
                )}
                {restaurant.instagram && (
                    <LinkButton
                        label={restaurant.instagram}
                        icon={<img src="/icons/instagram-icon.svg" alt="Instagram" width={18} height={18} />}
                        onClick={handleOpenInstagram}
                    />
                )}
                {restaurant.facebook && (
                    <LinkButton
                        label={restaurant.facebook}
                        icon={<img src="/icons/facebook-icon.svg" alt="Facebook" width={18} height={18} />}
                        onClick={handleOpenFacebook}
                    />
                )}
                {restaurant.url && (
                    <LinkButton
                        label={restaurant.url}
                        icon={<Globe size={18} />}
                        onClick={handleOpenUrl}
                    />
                )}
            </Stack>
        );
    };

    return (
        <Stack spacing={3}>
            <Stack spacing={2} direction={hasSinglePhoto ? "row" : "column"}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "start",
                    }}
                >
                    <ImageGallery
                        images={guideItem.photos}
                        maxColumns={4}
                        mobileMaxColumns={3}
                        mobileMaxHeight={200}
                        onImageClick={onImageClick}
                    />
                </Box>

                <Stack spacing={1} width="100%">
                    <Stack spacing={0.5}>
                        <Box sx={{ width: "fit-content" }}>
                            <Tags variant="minimal" tags={restaurant.categories} />
                        </Box>
                        <Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="h4" fontWeight={500}>
                                    {restaurant.name}
                                </Typography>
                                {restaurant.official && (
                                    <BadgeCheck
                                        size={isSmallScreen ? 24 : 28}
                                        strokeWidth={2}
                                        fill={theme.palette.green.main}
                                        color="white"
                                    />
                                )}
                            </Stack>
                            {restaurant.branch && (
                                <Typography variant="caption" color="text.secondary">
                                    {t("branch")} - {restaurant.branch}
                                </Typography>
                            )}
                            {(restaurant.delivery || restaurant.pickup) && (
                                <Stack direction="row" alignItems="center" spacing={1.5} mt={0.5}>
                                    {restaurant.delivery && (
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Motorbike size={14} color={theme.palette.grey[800]} strokeWidth={2} />
                                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                                {t("delivery")}
                                            </Typography>
                                        </Stack>
                                    )}
                                    {restaurant.pickup && (
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <ShoppingBag size={14} color={theme.palette.grey[800]} strokeWidth={2} />
                                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                                {t("pickup")}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    </Stack>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                                {restaurant.rating.toFixed(1)} ({restaurant.numberOfReviews.toLocaleString()})
                            </Typography>
                        </Stack>
                        <IconButton
                            aria-label="share"
                            size="small"
                            sx={{ color: theme.palette.grey[800] }}
                            onClick={handleShare}
                        >
                            <Share2 size={isSmallScreen ? 16 : 20} />
                        </IconButton>
                    </Box>

                    {/* Description - Inline for tablet with single photo */}
                    {shouldShowDescriptionInline && renderDescription()}

                    {/* Description + Side Panel - Desktop */}
                    {shouldShowSidePanel && (
                        <Stack
                            direction={isSmallScreen ? "column" : "row"}
                            divider={isSmallScreen ? undefined : <Divider orientation="vertical" />}
                            spacing={2}
                            width="100%"
                            justifyContent="space-between"
                        >
                            {(!hasSinglePhoto || (!isTablet && hasSinglePhoto)) && renderDescription()}
                            {renderSidePanel()}
                        </Stack>
                    )}
                </Stack>
            </Stack>

            {/* Description + Side Panel - Mobile */}
            {isSmallScreen && (
                <Stack
                    direction="column"
                    spacing={2}
                    width="100%"
                >
                    {(!hasSinglePhoto || !isTablet) && renderDescription()}
                    {renderSidePanel()}
                </Stack>
            )}

            {/* Contact & Social Section */}
            <Stack
                direction={isMobile ? "column" : "row"}
                spacing={isMobile ? 3 : 4}
                sx={{
                    bgcolor: "grey.100",
                    borderRadius: 2,
                    p: isMobile ? 1 : 3,
                }}
            >
                {isSmallScreen && renderContactInfo()}
                {renderSocialMedia()}
            </Stack>
        </Stack>
    );
}