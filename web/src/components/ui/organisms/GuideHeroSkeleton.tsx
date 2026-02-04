import { Stack, Skeleton } from "@mui/material";

export default function GuideHeroSkeleton() {
    return (
        <Stack spacing={2} sx={{ width: "100%" }}>
            <Stack direction="row" spacing={0.5} justifyContent="end">
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={100} height={24} />
                <Skeleton variant="rounded" width={90} height={24} />
            </Stack>

            <Skeleton
                variant="rectangular"
                width="100%"
                height={300}
                sx={{ borderRadius: 2 }}
            />
            <Skeleton variant="text" width="70%" height={40} />

            <Stack spacing={0.5}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="60%" />
            </Stack>
        </Stack>
    );
}