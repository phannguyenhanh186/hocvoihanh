import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export default function StudentClassListPage() {
  const classes = useAppStore((s) => s.classes);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-xl font-display font-semibold mb-1">Chọn lớp của bạn</h1>
      <p className="text-sm text-ink/50 mb-5">Nếu giáo viên gửi link riêng cho lớp, bạn có thể vào thẳng link đó.</p>
      {classes.length === 0 ? (
        <div className="card p-8 text-center text-ink/45 text-sm">Chưa có lớp học nào.</div>
      ) : (
        <div className="space-y-2">
          {classes.map((c) => (
            <button
              key={c.id}
              className="card p-4 w-full text-left hover:border-navy transition-colors"
              onClick={() => navigate(`/student/${c.id}`)}
            >
              <span className="font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
