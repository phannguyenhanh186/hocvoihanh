import { Link } from "react-router-dom";
import { ClassRecord, PRODUCT_LABELS, LEVEL_LABELS } from "../../types";
import { useAppStore } from "../../store/useAppStore";

export default function ClassCard({ classRecord }: { classRecord: ClassRecord }) {
  const stats = useAppStore((s) => s.classStats(classRecord.id));

  const scheduleText = classRecord.schedule?.days.length
    ? `${classRecord.schedule.startTime ?? "?"}–${classRecord.schedule.endTime ?? "?"} · ${classRecord.schedule.days.join("-").replace(/Thứ /g, "T")}`
    : "chưa xếp lịch";

  return (
    <Link
      to={`/teacher/classes/${classRecord.id}`}
      className="card p-5 flex flex-col gap-3 text-left hover:border-navy transition-colors"
    >
      <h3 className="font-display font-semibold text-base leading-snug">
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
