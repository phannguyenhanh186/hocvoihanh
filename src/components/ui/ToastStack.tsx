import { CheckCircle2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function ToastStack() {
  const toasts = useAppStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 bg-ink text-white text-sm px-4 py-3 rounded-md shadow-lg animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2 size={16} className="text-accent-green shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
