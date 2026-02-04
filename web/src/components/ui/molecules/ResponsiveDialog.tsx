import { Dialog, DialogProps, IconButton } from "@mui/material";
import useResponsive from "@/hooks/useResponsive";
import { X } from "lucide-react";

interface ResponsiveDialogProps extends DialogProps {
    fullScreenOnMobile?: boolean;
};

export default function ResponsiveDialog({
    fullScreenOnMobile = false,
    ...props
}: Readonly<ResponsiveDialogProps>) {
    const { isMobile } = useResponsive();
    const { children, onClose, ...rest } = props;
    const fullScreen = fullScreenOnMobile && isMobile;

    return (
        <Dialog
            fullScreen={fullScreen}
            {...rest}
        >
            {onClose && (
                <IconButton
                    onClick={(event) => onClose?.(event, "backdropClick")}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" }
                    }}
                >
                    <X size={20} />
                </IconButton>
            )}
            {children}
        </Dialog>
    );
}