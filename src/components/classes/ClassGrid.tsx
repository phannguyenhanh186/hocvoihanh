import { ClassRecord } from "../../types";
import ClassCard from "./ClassCard";

export default function ClassGrid({ classes }: { classes: ClassRecord[] }) {
  if (classes.length === 0) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Chưa có lớp học nào. Bấm "+ Lớp mới" để tạo lớp đầu tiên.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((c) => (
        <ClassCard key={c.id} classRecord={c} />
      ))}
    </div>
  );
}
