import { useState, useRef } from "react";
import { Box, IconButton, MobileStepper } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface Image {
    id: string;
    smallUrl: string;
    largeUrl: string;
}

interface ImageCarouselProps {
    images: Image[];
    startIndex?: number;
}

export default function ImageCarousel({ images, startIndex = 0 }: Readonly<ImageCarouselProps>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(startIndex);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const maxSteps = images.length;

    const refPassthrough = (el: HTMLDivElement) => {
        swipeHandlers.ref(el);
        containerRef.current = el;
    };

    const handleNext = () => {
        setIsTransitioning(true);
        setSwipeOffset(-containerRef.current!.offsetWidth);
        setTimeout(() => {
            setActiveStep((prev) => (prev + 1) % maxSteps);
            setSwipeOffset(0);
            setIsTransitioning(false);
        }, 400);
    };

    const handleBack = () => {
        setIsTransitioning(true);
        setSwipeOffset(containerRef.current!.offsetWidth);
        setTimeout(() => {
            setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);
            setSwipeOffset(0);
            setIsTransitioning(false);
        }, 400);
    };

    const swipeHandlers = useSwipeable({
        onSwiping: (eventData) => {
            if (!isTransitioning) {
                setIsSwiping(true);
                setSwipeOffset(eventData.deltaX);
            }
        },
        onSwiped: (eventData) => {
            if (isTransitioning) return;
            
            setIsSwiping(false);

            const threshold = 50;
            if (Math.abs(eventData.deltaX) > threshold) {
                if (eventData.deltaX < 0) {
                    handleNext();
                } else {
                    handleBack();
                }
            } else {
                setSwipeOffset(0);
            }
        },
        trackMouse: true,
        preventScrollOnSwipe: true,
        touchEventOptions: { passive: false },
    });

    const getPrevIndex = () => (activeStep - 1 + maxSteps) % maxSteps;
    const getNextIndex = () => (activeStep + 1) % maxSteps;

    return (
        <Box
            {...swipeHandlers}
            ref={refPassthrough}
            sx={{
                position: "relative",
                width: "100%",
                bgcolor: "black",
                userSelect: "none",
                overflow: "hidden",
                touchAction: "pan-y",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    transform: `translateX(${swipeOffset}px)`,
                    transition: (isSwiping || isTransitioning) ? "transform 0.4s ease-out" : "none",
                }}
            >
                <Box
                    component="img"
                    src={images[getPrevIndex()].largeUrl}
                    alt="Previous"
                    sx={{
                        position: "absolute",
                        left: "-100%",
                        width: "100%",
                        maxHeight: { xs: 400, sm: 500, md: 600 },
                        objectFit: "contain",
                        pointerEvents: "none",
                    }}
                />
                <Box
                    component="img"
                    src={images[activeStep].largeUrl}
                    alt={`Image ${activeStep + 1}`}
                    sx={{
                        width: "100%",
                        maxHeight: { xs: 400, sm: 500, md: 600 },
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                        pointerEvents: "none",
                    }}
                />
                <Box
                    component="img"
                    src={images[getNextIndex()].largeUrl}
                    alt="Next"
                    sx={{
                        position: "absolute",
                        left: "100%",
                        width: "100%",
                        maxHeight: { xs: 400, sm: 500, md: 600 },
                        objectFit: "contain",
                        pointerEvents: "none",
                    }}
                />
            </Box>

            {maxSteps > 1 && (
                <>
                    <IconButton
                        size="small"
                        onClick={handleBack}
                        disabled={isTransitioning}
                        sx={{
                            position: "absolute",
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                            zIndex: 10,
                        }}
                        data-testid="previous-image-button"
                    >
                        <ChevronLeft size={24} />
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={handleNext}
                        disabled={isTransitioning}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                            zIndex: 10,
                        }}
                        data-testid="next-image-button"
                    >
                        <ChevronRight size={24} />
                    </IconButton>

                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            bgcolor: "transparent",
                            zIndex: 10,
                            "& .MuiMobileStepper-dot": {
                                bgcolor: "rgba(255,255,255,0.5)"
                            },
                            "& .MuiMobileStepper-dotActive": {
                                bgcolor: "white"
                            }
                        }}
                        nextButton={<></>}
                        backButton={<></>}
                    />
                </>
            )}
        </Box>
    );
}