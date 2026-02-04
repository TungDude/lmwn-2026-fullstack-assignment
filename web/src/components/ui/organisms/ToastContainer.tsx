import Toast from "@/components/ui/molecules/Toast";
import { useToast } from "@/hooks/useToast";

export const ToastsContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        >
            {toasts.map((toast) => (
                <Toast 
                    key={toast.id}
                    toast={toast} 
                    onDismiss={removeToast}
                />
            ))}
        </div>
    );
};