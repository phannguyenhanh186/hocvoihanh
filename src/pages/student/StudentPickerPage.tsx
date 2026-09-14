import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function StudentPickerPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const classRecord = useAppStore((s) => s.classes.find((c) => c.id === classId));
  const students = useAppStore((s) => s.students.filter((st) => st.classId === classId && st.enrollmentStatus !== "former"));

  if (!classRecord) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy lớp học. Kiểm tra lại link giáo viên đã gửi.
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors mb-4"
        onClick={() => navigate("/student")}
      >
        <ArrowLeft size={16} /> Chọn lớp khác
      </button>
      <h1 className="text-xl font-display font-semibold mb-1">{classRecord.name}</h1>
      <p className="text-sm text-ink/50 mb-5">Chọn tên của bạn để xem bài tập được giao.</p>
      {students.length === 0 ? (
        <div className="card p-8 text-center text-ink/45 text-sm">Lớp này chưa có học viên.</div>
      ) : (
        <div className="space-y-2">
          {students.map((st) => (
            <button
              key={st.id}
              className="card p-4 w-full text-left hover:border-navy transition-colors"
              onClick={() => navigate(`/student/${classId}/${st.id}`)}
            >
              <span className="font-medium">{st.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
