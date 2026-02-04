import { Stack, Skeleton, Box } from "@mui/material";
import useResponsive from "@/hooks/useResponsive";

export default function GuideItemSkeleton() {
    const { isMobile } = useResponsive();

    return (
        <Stack spacing={2}>
            <Stack spacing={2}>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        width: "100%",
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: "100%",
                                height: isMobile ? 120 : 300,
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: "100%",
                                height: isMobile ? 120 : 300,
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: "100%",
                                height: isMobile ? 120 : 300,
                            }}
                        />
                    </Box>
                </Stack>
            </Stack>

            <Stack spacing={1} width="100%">
                <Stack spacing={0.5}>
                    <Skeleton variant="rectangular" width={100} height={12} />
                    <Skeleton variant="rectangular" width="60%" height={24} />
                    <Skeleton variant="rectangular" width="40%" height={16} />
                </Stack>
                <Stack spacing={0.1}>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="30%" height={20} />
                </Stack>
                <Skeleton variant="rectangular" width="100%" height={60} />
            </Stack>
        </Stack>
    );
}