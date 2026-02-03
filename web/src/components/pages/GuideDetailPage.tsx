import { useParams, useLocation } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import Tags from "../ui/atoms/Tags";
import BackButton from "../ui/molecules/BackButton";
import GuideHero from "../ui/organisms/GuideHero";
import type { GuideDetail } from "@shared/packages";

export default function GuideDetailPage() {
    const { guideId } = useParams<{ guideId: string }>();
    const location = useLocation();
    const guide = location.state?.guide as GuideDetail | undefined;

    if (!guideId) {
        return <div>Guide ID is missing.</div>;
    }

    if (!guide) {
        return <div>Guide data is missing.</div>;
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 800 }}>
                <GuideHero
                    guide={guide}
                    header={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 2 }}>
                            <BackButton />
                            <Tags tags={guide.tags} />
                        </Box>
                    }
                />
                {guideId}
            </Stack>
        </Box>
    );
}