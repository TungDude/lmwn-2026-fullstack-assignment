import { useState } from "react";
import { Stack, Divider } from "@mui/material";
import EmptyState from "../atoms/EmptyState";
import GuideItem from "../organisms/GuideItem";
import GuideItemSkeleton from "../organisms/GuideItemSkeleton";
import ImageCarousel from "../molecules/ImageCarousel";
import ResponsiveDialog from "../molecules/ResponsiveDialog";
import { SlideTransition } from "../atoms/SlideTransition";
import type { Image } from "../molecules/ImageGallery";
import type { GuideItemWithRestaurant } from "@shared/packages";
import { useTranslation } from "react-i18next";

interface GuideItemListProps {
    guideItems: GuideItemWithRestaurant[];
    isLoading?: boolean;
}

export default function GuideItemList({ guideItems, isLoading }: Readonly<GuideItemListProps>) {
    const { t } = useTranslation("guideDetail");
    const [isCarouselOpen, setCarouselOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Image[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (images: Image[], index: number) => {
        setSelectedImages(images);
        setSelectedImageIndex(index);
        setCarouselOpen(true);
    };

    const renderItems = () => {
        if (isLoading) {
            return ["gis1", "gis2", "gis3"].map(key => (
                <GuideItemSkeleton key={key} />
            ));
        }

        if (guideItems.length === 0) {
            return <EmptyState message={t("emptyState")} />;
        }

        return guideItems.map((item) => (
            <GuideItem
                key={item.id}
                guideItem={item}
                onImageClick={(index) => handleImageClick(item.photos, index)}
            />
        ));
    }

    return (
        <>
            <Stack divider={<Divider />} spacing={2}>
                {renderItems()}
            </Stack>
            <ResponsiveDialog
                open={isCarouselOpen}
                fullScreenOnMobile={true}
                onClose={() => setCarouselOpen(false)}
                maxWidth="lg"
                fullWidth
                slots={{
                    transition: SlideTransition,
                }}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: "transparent",
                            boxShadow: "none",
                            maxHeight: "90vh",
                            height: "auto",
                            justifyContent: "center",
                            alignItems: "center",
                        }
                    }
                }}
            >
                <ImageCarousel
                    images={selectedImages}
                    startIndex={selectedImageIndex}
                />
            </ResponsiveDialog>
        </>
    );
}