import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ClassRecord, PRODUCT_LABELS, LEVEL_LABELS } from "../../types";
import { useAppStore } from "../../store/useAppStore";

export default function ClassCard({ classRecord }: { classRecord: ClassRecord }) {
  const stats = useAppStore((s) => s.classStats(classRecord.id));
  const deleteClass = useAppStore((s) => s.deleteClass);
  const pushToast = useAppStore((s) => s.pushToast);
  const navigate = useNavigate();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Xoá lớp "${classRecord.name}"? Buổi dạy, bài tập/bài thi, trao đổi và BTVN đã giao của lớp này sẽ bị xoá. Học viên vẫn được giữ lại trong danh sách chung.`)) {
      return;
    }
    deleteClass(classRecord.id);
    pushToast("Đã xoá lớp.");
    navigate("/teacher/classes");
  }

  const scheduleText = classRecord.schedule?.days.length
    ? `${classRecord.schedule.startTime ?? "?"}–${classRecord.schedule.endTime ?? "?"} · ${classRecord.schedule.days.join("-").replace(/Thứ /g, "T")}`
    : "chưa xếp lịch";

  return (
    <Link
      to={`/teacher/classes/${classRecord.id}`}
      className="card p-5 flex flex-col gap-3 text-left hover:border-navy transition-colors relative group"
    >
      <button
        className="absolute top-3 right-3 text-ink/25 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        onClick={handleDelete}
        title="Xoá lớp"
        aria-label="Xoá lớp"
      >
        <Trash2 size={15} />
      </button>

      <h3 className="font-display font-semibold text-base leading-snug pr-6">
        {classRecord.name}
      </h3>

      <span className="inline-flex w-fit items-center rounded-full bg-navy-50 text-navy text-xs font-medium px-2.5 py-1">
        {PRODUCT_LABELS[classRecord.product]}
      </span>

      <p className="text-sm text-ink/70">{LEVEL_LABELS[classRecord.level]}</p>

      <div className="border-t border-line pt-3 mt-1 space-y-1.5">
        <p className={`text-sm ${classRecord.schedule?.days.length ? "text-ink/70" : "text-ink/40 italic"}`}>
          {scheduleText}
        </p>
        <div className="flex items-center gap-2 text-sm text-ink/70">
          <span>Sĩ số {stats.studentCount}</span>
          {stats.pendingCount > 0 && (
            <span className="text-xs font-medium text-accent-orange bg-accent-orange-soft px-2 py-0.5 rounded-full">
              {stats.pendingCount} chờ duyệt
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
