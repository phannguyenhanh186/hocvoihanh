import { useAppStore } from "../../store/useAppStore";

export default function ClassSummary() {
  const classes = useAppStore((s) => s.classes);
  const students = useAppStore((s) => s.students);

  const runningCount = classes.filter((c) => c.status === "active").length;
  const totalStudents = students.filter((s) => s.status === "active").length;
  const pendingStudents = students.filter((s) => s.status === "pending").length;

  return (
    <div className="grid grid-cols-2 gap-4 mb-8 max-w-xl">
      <div className="card p-5">
        <p className="text-xs font-semibold tracking-wide text-ink/45 mb-2">
          LỚP ĐANG CHẠY
        </p>
        <p className="text-3xl font-display font-bold text-navy">{runningCount}</p>
      </div>
      <div className="card p-5">
        <p className="text-xs font-semibold tracking-wide text-ink/45 mb-2">
          HỌC VIÊN
        </p>
        <p className="text-3xl font-display font-bold text-navy">{totalStudents}</p>
        {pendingStudents > 0 && (
          <p className="text-xs text-accent-orange mt-1.5 font-medium">
            {pendingStudents} người đang chờ duyệt
          </p>
        )}
      </div>
    </div>
  );
}
