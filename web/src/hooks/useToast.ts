import { AlertProps } from "@mui/material";
import { useToastStore } from "@/stores/toast-store";

type ShowToastOptions = {
    title: string;
    description: string;
    severity?: AlertProps["severity"];
    duration?: number;
};

export function useToast() {
    const toasts = useToastStore((state) => state.toasts);
    const addToast = useToastStore((state) => state.addToast);
    const removeToast = useToastStore((state) => state.removeToast);
    const clearToasts = useToastStore((state) => state.clearToasts);

    const showToast = ({ title, description, severity, duration = 6000 }: ShowToastOptions) => {
        const id = addToast({ title, description, severity });

        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    };

    return {
        toasts,
        showToast,
        removeToast,
        clearToasts,
    };
}