import { Outlet } from "react-router-dom";
import { Box, Stack, Fab, Typography } from "@mui/material";
import Header from "@/components/ui/organisms/Header";
import { ToastsContainer } from "../ui/organisms/ToastContainer";
import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";

export default function AppLayout() {
    const [showFab, setShowFab] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                if (scrollContainerRef.current.scrollTop > 1000) {
                    setShowFab(true);
                } else {
                    setShowFab(false);
                }
            }
        };

        const scrollContainer = scrollContainerRef.current;
        scrollContainer?.addEventListener("scroll", handleScroll);

        return () => {
            scrollContainer?.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    return (
        <Stack
            direction="column"
            height="100vh"
            overflow="hidden"
            width="100vw"
        >
            <Header />
            <Box
                ref={scrollContainerRef}
                flexGrow={1}
                padding={4}
                paddingBottom={6}
                overflow="auto"
                className="custom-scrollbar"
            >
                <Outlet />
            </Box>
            {showFab && (
                <Fab
                    variant="extended"
                    size="small"
                    onClick={scrollToTop}
                    style={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        paddingRight: 16,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <ChevronUp size={20} />
                        <Typography variant="caption">Back to Top</Typography>
                    </Stack>
                </Fab>
            )}
            <ToastsContainer />
        </Stack>
    );
}