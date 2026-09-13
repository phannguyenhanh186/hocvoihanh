import { useState } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { HomeworkPackage } from "../types";
import CreateHomeworkModal from "../components/homework/CreateHomeworkModal";
import HomeworkDetailModal from "../components/homework/HomeworkDetailModal";

export default function HomeworkPage() {
  const homeworkPackages = useAppStore((s) => s.homeworkPackages);
  const classes = useAppStore((s) => s.classes);
  const students = useAppStore((s) => s.students);
  const deleteHomework = useAppStore((s) => s.deleteHomework);
  const pushToast = useAppStore((s) => s.pushToast);

  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<HomeworkPackage | null>(null);

  function recipientSummary(pkg: HomeworkPackage) {
    if (pkg.recipientType === "class") return "Cả lớp";
    const names = pkg.studentIds.map((id) => students.find((s) => s.id === id)?.name ?? "?");
    return names.length <= 2 ? names.join(", ") : `${names[0]} +${names.length - 1} học viên khác`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink/60">{homeworkPackages.length} BTVN đã giao</p>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={16} /> Giao BTVN
        </button>
      </div>

      {homeworkPackages.length === 0 ? (
        <div className="card p-10 text-center text-ink/50 text-sm">
          Chưa có BTVN nào được giao. Bấm "Giao BTVN" để ghép nội dung từ Kho nội dung & Bài tập thành một bài giao cho học viên.
        </div>
      ) : (
        <div className="space-y-3">
          {homeworkPackages.map((pkg) => {
            const cls = classes.find((c) => c.id === pkg.classId);
            return (
              <div key={pkg.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-semibold">{pkg.title}</h3>
                    <p className="text-sm text-ink/50 mt-1">
                      {cls?.name ?? "—"} · {recipientSummary(pkg)} · {pkg.items.length} nội dung
                    </p>
                    <p className="text-xs text-ink/40 mt-1">
                      Giao {new Date(pkg.assignedDate).toLocaleDateString("vi-VN")}
                      {pkg.dueDate && ` · Hạn ${new Date(pkg.dueDate).toLocaleDateString("vi-VN")}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-line">
                  <button className="btn-secondary text-sm" onClick={() => setViewing(pkg)}>
                    <Eye size={14} /> Xem nội dung
                  </button>
                  <button
                    className="btn-secondary text-sm text-red-600"
                    onClick={() => {
                      deleteHomework(pkg.id);
                      pushToast("Đã xoá BTVN.");
                    }}
                  >
                    <Trash2 size={14} /> Xoá
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {creating && <CreateHomeworkModal onClose={() => setCreating(false)} />}
      {viewing && <HomeworkDetailModal pkg={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
