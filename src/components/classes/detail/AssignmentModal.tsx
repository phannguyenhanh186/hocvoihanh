import { useState } from "react";
import Modal from "../../ui/Modal";
import { AssignmentKind } from "../../../types";
import { useAppStore } from "../../../store/useAppStore";

interface Props {
  classId: string;
  kind: AssignmentKind;
  title: string; // modal title
  defaultDate?: string;
  onClose: () => void;
}

export default function AssignmentModal({ classId, kind, title, defaultDate, onClose }: Props) {
  const tests = useAppStore((s) => s.tests);
  const addAssignment = useAppStore((s) => s.addAssignment);
  const pushToast = useAppStore((s) => s.pushToast);

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [dueDate, setDueDate] = useState(defaultDate ?? "");
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  function toggleTest(id: string) {
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function handleSubmit() {
    if (!assignmentTitle.trim()) {
      setError("Nhập tên bài.");
      return;
    }
    addAssignment(classId, assignmentTitle.trim(), kind, dueDate || undefined, selectedTestIds);
    pushToast(kind === "test" ? "Đã tạo bài thi." : "Đã giao bài tập.");
    onClose();
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {kind === "test" ? "Tạo bài thi" : "Giao bài"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="field-label">Tên bài</label>
          <input
            className="field-input"
            placeholder={kind === "test" ? "Ví dụ: Thi thử đầu vào (đề 05)" : "Ví dụ: Bài tập tuần 1"}
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
          {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
        </div>
        <div>
          <label className="field-label">Hạn nộp</label>
          <input
            type="date"
            className="field-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Chọn đề từ Kho bài của tôi (không bắt buộc)</label>
          {tests.length === 0 ? (
            <p className="text-xs text-ink/45">
              Chưa có đề nào trong kho bài. Bạn có thể tạo bài trước và soạn đề sau.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {tests.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 text-sm px-2.5 py-2 rounded-md border border-line cursor-pointer hover:bg-paper"
                >
                  <input
                    type="checkbox"
                    checked={selectedTestIds.includes(t.id)}
                    onChange={() => toggleTest(t.id)}
                  />
                  {t.title} <span className="text-ink/40">· {t.questions.length} câu</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
