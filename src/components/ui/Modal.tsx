import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export default function Modal({ title, onClose, children, footer, maxWidth = "max-w-md" }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${maxWidth} bg-white rounded-card border border-line shadow-xl max-h-[85vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h2 className="text-base font-display font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-ink/40 hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-line flex justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
