import { useState } from "react";
import { Box, ImageList, ImageListItem, Skeleton } from "@mui/material";
import useResponsive from "@/hooks/useResponsive";

export interface Image {
    id: string;
    smallUrl: string;
    largeUrl: string;
}

interface ImageGalleryProps {
    images: Image[];
    maxColumns?: number;
    mobileMaxColumns?: number;
    maxHeight?: number;
    mobileMaxHeight?: number;
    onImageClick?: (index: number) => void;
}

export default function ImageGallery({
    images,
    maxColumns = 4,
    mobileMaxColumns = 3,
    maxHeight = 400,
    mobileMaxHeight = 300,
    onImageClick,
}: Readonly<ImageGalleryProps>) {
    const { isMobile } = useResponsive();
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    const effectiveMaxColumns = isMobile ? Math.min(mobileMaxColumns, maxColumns) : maxColumns;
    const effectiveMaxHeight = isMobile ? mobileMaxHeight : maxHeight;
    const columns = Math.min(images.length, effectiveMaxColumns);

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };

    return (
        <ImageList
            cols={columns}
            gap={8}
            sx={{ width: "fit-content" }}
            data-testid="image-gallery"
        >
            {images.slice(0, columns).map((image, index) => (
                <Box
                    key={image.id + index}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ImageListItem
                        sx={{
                            cursor: "pointer",
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            "&:hover": { opacity: 0.9 }
                        }}
                        onClick={() => onImageClick?.(index)}
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
                                opacity: loadedImages.has(index) ? 0 : 1,
                                display: loadedImages.has(index) ? "none" : "block",
                                transition: "opacity 0.3s ease-in-out"
                            }}
                        />
                        <img
                            src={image.smallUrl}
                            alt={String(index + 1)}
                            loading="lazy"
                            onLoad={() => handleImageLoad(index)}
                            style={{
                                width: "100%",
                                maxHeight: effectiveMaxHeight,
                                objectFit: "contain",
                                opacity: loadedImages.has(index) ? 1 : 0,
                                transition: "opacity 0.3s ease-in-out",
                            }}
                        />
                        {index === columns - 1 && images.length > columns && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: 24,
                                    fontWeight: 600
                                }}
                                data-testid="image-gallery-overlay"
                            >
                                +{images.length - columns}
                            </Box>
                        )}
                    </ImageListItem>
                </Box>
            ))
            }
        </ImageList >
    );
}