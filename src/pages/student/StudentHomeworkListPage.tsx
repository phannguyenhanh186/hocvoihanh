import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function StudentHomeworkListPage() {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const classRecord = useAppStore((s) => s.classes.find((c) => c.id === classId));
  const student = useAppStore((s) => s.students.find((st) => st.id === studentId));
  const homeworkPackages = useAppStore((s) => s.homeworkPackages);

  const relevant = homeworkPackages
    .filter((h) => h.classId === classId && (h.recipientType === "class" || h.studentIds.includes(studentId ?? "")))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (!classRecord || !student) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy học viên. Kiểm tra lại link giáo viên đã gửi.
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors mb-4"
        onClick={() => navigate(`/student/${classId}`)}
      >
        <ArrowLeft size={16} /> Đổi tên khác
      </button>
      <h1 className="text-xl font-display font-semibold mb-1">Chào {student.name}!</h1>
      <p className="text-sm text-ink/50 mb-5">Bài tập về nhà của lớp {classRecord.name}.</p>

      {relevant.length === 0 ? (
        <div className="card p-8 text-center text-ink/45 text-sm">Chưa có bài tập nào được giao.</div>
      ) : (
        <div className="space-y-2">
          {relevant.map((h) => (
            <button
              key={h.id}
              className="card p-4 w-full text-left hover:border-navy transition-colors flex items-center justify-between"
              onClick={() => navigate(`/student/${classId}/${studentId}/${h.id}`)}
            >
              <div>
                <p className="font-medium">{h.title}</p>
                <p className="text-xs text-ink/45 mt-0.5">
                  {h.items.length} nội dung · Giao {new Date(h.assignedDate).toLocaleDateString("vi-VN")}
                  {h.dueDate && ` · Hạn ${new Date(h.dueDate).toLocaleDateString("vi-VN")}`}
                </p>
              </div>
              <ChevronRight size={16} className="text-ink/30 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
