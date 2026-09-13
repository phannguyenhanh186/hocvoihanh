import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Modal from "../ui/Modal";
import { useAppStore } from "../../store/useAppStore";
import { HOMEWORK_CONTENT_KIND_LABELS, HomeworkPackage } from "../../types";
import { getSnapshotPreview } from "../../lib/contentPreview";
import ContentPreviewBody from "./ContentPreviewBody";

export default function HomeworkDetailModal({ pkg, onClose }: { pkg: HomeworkPackage; onClose: () => void }) {
  const classes = useAppStore((s) => s.classes);
  const students = useAppStore((s) => s.students);
  const [openId, setOpenId] = useState<string | null>(null);

  const cls = classes.find((c) => c.id === pkg.classId);
  const recipientLabel =
    pkg.recipientType === "class"
      ? `Cả lớp${cls ? ` — ${cls.name}` : ""}`
      : `${pkg.studentIds.length} học viên: ${pkg.studentIds
          .map((id) => students.find((s) => s.id === id)?.name ?? "?")
          .join(", ")}`;

  return (
    <Modal title={pkg.title} onClose={onClose} maxWidth="max-w-2xl" footer={<button className="btn-primary" onClick={onClose}>Đóng</button>}>
      <div className="space-y-4">
        <div className="text-sm text-ink/60 space-y-1">
          <p>
            <span className="font-medium text-ink">Giao cho:</span> {recipientLabel}
          </p>
          <p>
            <span className="font-medium text-ink">Ngày giao:</span> {new Date(pkg.assignedDate).toLocaleDateString("vi-VN")}
            {pkg.dueDate && (
              <>
                {" "}
                · <span className="font-medium text-ink">Hạn nộp:</span> {new Date(pkg.dueDate).toLocaleDateString("vi-VN")}
              </>
            )}
          </p>
        </div>

        <div className="rounded-md bg-navy-50 text-navy text-xs px-3 py-2">
          Nội dung bên dưới là bản snapshot tại thời điểm giao — dù bài gốc trong kho có được sửa sau đó, BTVN này vẫn giữ nguyên.
        </div>

        <div className="space-y-1.5">
          {pkg.items
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((item, i) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="border border-line rounded-md overflow-hidden">
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-paper"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    {isOpen ? <ChevronDown size={15} className="text-ink/40" /> : <ChevronRight size={15} className="text-ink/40" />}
                    <span className="text-ink/40 font-medium">{i + 1}.</span>
                    <span className="font-medium flex-1">{item.title}</span>
                    <span className="text-xs font-medium text-navy bg-navy-50 px-1.5 py-0.5 rounded-full">
                      {HOMEWORK_CONTENT_KIND_LABELS[item.sourceKind]}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-line">
                      <ContentPreviewBody data={getSnapshotPreview(item)} />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
