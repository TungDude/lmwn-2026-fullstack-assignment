import { AlertProps } from "@mui/material";
import { useToastStore } from "@/stores/toast-store";

type ShowToastOptions = {
    title: string;
    description: string;
    duration?: number;
} & Partial<AlertProps>;

export function useToast() {
    const toasts = useToastStore((state) => state.toasts);
    const addToast = useToastStore((state) => state.addToast);
    const removeToast = useToastStore((state) => state.removeToast);
    const clearToasts = useToastStore((state) => state.clearToasts);

    const showToast = ({
        title,
        description,
        duration = 4000,
        ...props
    }: ShowToastOptions) => {
        const id = addToast({ title, description, ...props });

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