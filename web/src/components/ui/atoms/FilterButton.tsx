import { Button, Typography } from "@mui/material";
import { Funnel } from "lucide-react";

type FilterButtonProps = {
    label?: string;
    onFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
    hasActiveFilters?: boolean;
    isFilterMenuOpen?: boolean;
};

export default function FilterButton({ label, onFilterClick, hasActiveFilters, isFilterMenuOpen }: Readonly<FilterButtonProps>) {
    // State priority: Open > Active > Default
    const getStyles = () => {
        if (isFilterMenuOpen) {
            return {
                borderColor: "green.main",
                bgColor: "green.50",
                textColor: "green.main",
                iconFill: "#7bf1a8",
            };
        }

        if (hasActiveFilters) {
            return {
                borderColor: "green.main",
                bgColor: "grey.50",
                textColor: "green.main",
                iconFill: "#7bf1a8",
            };
        }

        return {
            borderColor: "#ccc",
            bgColor: "transparent",
            textColor: "text.primary",
            iconFill: "transparent",
        };
    };

    const styles = getStyles();

    return (
        <Button
            variant="outlined"
            onClick={onFilterClick}
            sx={{
                borderColor: styles.borderColor,
                color: styles.textColor,
                bgcolor: styles.bgColor,
                minWidth: "auto",
                width: "fit-content",
                height: "100%",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    borderColor: "#888",
                    backgroundColor: "grey.100",
                }
            }}
        >
            <Funnel
                size={16}
                strokeWidth={1.5}
                fill={styles.iconFill}
                style={{ marginRight: label ? 8 : 0 }}
            />
            {label && (
                <Typography variant="body2" fontWeight={hasActiveFilters || isFilterMenuOpen ? 500 : 400}>
                    {label}
                </Typography>
            )}
        </Button>
    );
}