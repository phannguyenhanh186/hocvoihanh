import { Trash2 } from "lucide-react";
import { Student } from "../../types";
import { useAppStore } from "../../store/useAppStore";

export default function StudentTable({ students }: { students: Student[] }) {
  const classes = useAppStore((s) => s.classes);
  const approveStudent = useAppStore((s) => s.approveStudent);
  const assignStudentToClass = useAppStore((s) => s.assignStudentToClass);
  const removeStudent = useAppStore((s) => s.removeStudent);
  const pushToast = useAppStore((s) => s.pushToast);

  const classNameById = new Map(classes.map((c) => [c.id, c.name]));

  if (students.length === 0) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không có học viên nào phù hợp.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-paper/60 text-left text-xs font-semibold text-ink/45">
            <th className="px-4 py-3 font-semibold">Tên học viên</th>
            <th className="px-4 py-3 font-semibold">Liên hệ</th>
            <th className="px-4 py-3 font-semibold">Lớp</th>
            <th className="px-4 py-3 font-semibold">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3 font-medium">{s.name}</td>
              <td className="px-4 py-3 text-ink/60">{s.contact}</td>
              <td className="px-4 py-3">
                <select
                  className="field-input py-1.5 text-xs w-auto"
                  value={s.classId ?? ""}
                  onChange={(e) => {
                    assignStudentToClass(s.id, e.target.value || null);
                    pushToast("Đã cập nhật lớp học.");
                  }}
                >
                  <option value="">Chưa xếp lớp</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {!s.classId && (
                  <span className="hidden">{classNameById.size}</span>
                )}
              </td>
              <td className="px-4 py-3">
                {s.status === "active" ? (
                  <span className="text-xs font-medium text-accent-green bg-accent-green-soft px-2 py-1 rounded-full">
                    Đang học
                  </span>
                ) : (
                  <span className="text-xs font-medium text-accent-orange bg-accent-orange-soft px-2 py-1 rounded-full">
                    Chờ duyệt
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {s.status === "pending" && (
                    <button
                      className="btn-secondary text-xs py-1.5 px-2.5"
                      onClick={() => {
                        approveStudent(s.id);
                        pushToast("Đã duyệt học viên.");
                      }}
                    >
                      Duyệt
                    </button>
                  )}
                  <button
                    className="text-ink/30 hover:text-red-600 transition-colors p-1.5"
                    onClick={() => removeStudent(s.id)}
                    aria-label={`Xóa ${s.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
