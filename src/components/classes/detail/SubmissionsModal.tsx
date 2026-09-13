import Modal from "../../ui/Modal";
import { Assignment } from "../../../types";
import { useAppStore } from "../../../store/useAppStore";

interface Props {
  assignment: Assignment;
  onClose: () => void;
}

export default function SubmissionsModal({ assignment, onClose }: Props) {
  const students = useAppStore((s) => s.students.filter((st) => st.classId === assignment.classId));
  const toggleSubmission = useAppStore((s) => s.toggleSubmission);

  const submittedIds = new Set(assignment.submissions.map((sub) => sub.studentId));

  return (
    <Modal
      title={`Bài nộp — ${assignment.title}`}
      onClose={onClose}
      maxWidth="max-w-lg"
      footer={
        <button className="btn-primary" onClick={onClose}>
          Xong
        </button>
      }
    >
      <p className="text-xs text-ink/50 mb-3">
        Đánh dấu thủ công học viên đã nộp bài. Chấm điểm/nhận xét chi tiết theo bài sẽ có ở bản sau.
      </p>
      <div className="space-y-2">
        {students.map((s) => (
          <label
            key={s.id}
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border border-line text-sm"
          >
            <span className="font-medium">{s.name}</span>
            <span className="flex items-center gap-2">
              <span className={submittedIds.has(s.id) ? "text-accent-green" : "text-ink/40"}>
                {submittedIds.has(s.id) ? "Đã nộp" : "Chưa nộp"}
              </span>
              <input
                type="checkbox"
                checked={submittedIds.has(s.id)}
                onChange={() => toggleSubmission(assignment.id, s.id)}
              />
            </span>
          </label>
        ))}
        {students.length === 0 && (
          <p className="text-sm text-ink/45">Lớp chưa có học viên nào.</p>
        )}
      </div>
    </Modal>
  );
}
