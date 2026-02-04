import { Alert, AlertProps, IconButton, Typography } from "@mui/material";
import useResponsive from "@/hooks/useResponsive";
import { X, Info } from "lucide-react";

export type Toast = {
    id: string;
    title: string;
    description: string;
} & Partial<AlertProps>;

interface ToastProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

export default function Toast({ toast, onDismiss }: Readonly<ToastProps>) {
    const { title, description, icon, ...rest } = toast;
    const { isSmallScreen } = useResponsive();

    return (
        <Alert
            {...rest}
            icon={
                icon ?? <Info size={20} />
            }
            sx={{
                pointerEvents: "auto",
                p: 2,
                width: isSmallScreen ? "75vw" : "30vw",
                maxWidth: 400,
                justifyContent: "start",
                alignItems: "center",
                transform: "translateY(0)",
                transition: "all 150ms ease-in-out",
                position: "relative",
            }}
        >
            <IconButton
                size="small"
                onClick={() => onDismiss(toast.id)}
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                }}
            >
                <X size={16} />
            </IconButton>
            <Typography variant="subtitle1" fontWeight="medium">{title}</Typography>
            <Typography variant="body2">{description}</Typography>
        </Alert>
    );
}