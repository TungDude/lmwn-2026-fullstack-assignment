import { create } from "zustand";
import { type Toast } from "@/components/ui/molecules/Toast";

type ToastState = {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast: Omit<Toast, "id">) => {
        const id = crypto.randomUUID();
        set((state) => ({
            toasts: [...state.toasts, { id, ...toast }],
        }));
        return id;
    },
    removeToast: (id: string) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
    clearToasts: () => set({ toasts: [] })
}));