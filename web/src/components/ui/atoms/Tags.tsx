import { Chip, Box } from "@mui/material";

interface TagsProps {
    tags: string[];
};

export default function Tags({ tags }: Readonly<TagsProps>) {
    return (
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", justifyContent: "end", flexWrap: "wrap" }}>
            {tags.map((tag, index) => (
                <Chip
                    color="success"
                    variant="outlined"
                    key={`${tag}-${index}`}
                    label={tag}
                    size="small"
                />
            ))}
        </Box>
    );
}