import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { EnrollmentStatus } from "../../../types";
import AddClassStudentModal from "./AddClassStudentModal";

export default function StudentsTab({ classId }: { classId: string }) {
  const students = useAppStore((s) => s.students.filter((st) => st.classId === classId));
  const setEnrollmentStatus = useAppStore((s) => s.setEnrollmentStatus);
  const removeStudent = useAppStore((s) => s.removeStudent);
  const pushToast = useAppStore((s) => s.pushToast);
  const [showModal, setShowModal] = useState(false);

  const activeCount = students.filter((s) => (s.enrollmentStatus ?? "current") === "current").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-ink/60">{activeCount} học viên đang học</p>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Thêm học viên thủ công
        </button>
      </div>

      <p className="text-xs text-ink/50 mb-4 max-w-3xl">
        Hết khoá thì đổi ô trạng thái sang <span className="font-medium text-ink/70">Học viên cũ</span> — không cần xoá:
        bạn ấy không còn vào lớp và không tính vào trần gói, điểm/bài/điểm danh giữ nguyên; đổi lại{" "}
        <span className="font-medium text-ink/70">Đang học</span> là học tiếp.
      </p>

      {students.length === 0 ? (
        <div className="card p-10 text-center text-ink/50 text-sm">
          Chưa có học viên nào trong lớp này.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left text-xs font-semibold text-ink/45">
                <th className="px-4 py-3">HỌC VIÊN</th>
                <th className="px-4 py-3">SĐT</th>
                <th className="px-4 py-3">EMAIL</th>
                <th className="px-4 py-3">NĂM SINH</th>
                <th className="px-4 py-3">CHUYÊN CẦN</th>
                <th className="px-4 py-3">ĐÃ NỘP BÀI</th>
                <th className="px-4 py-3">% ĐÚNG</th>
                <th className="px-4 py-3">ĐIỂM (TRÊN TỔNG ĐIỂM)</th>
                <th className="px-4 py-3">TRẠNG THÁI</th>
                <th className="px-4 py-3 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-ink/60">{s.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{s.email ?? "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{s.birthYear ?? "—"}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {s.attendanceRate != null ? `${s.attendanceRate}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-ink/60">
                    {s.submittedRate != null ? `${s.submittedRate}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-ink/60">
                    {s.correctRate != null ? `${s.correctRate}%` : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {s.score != null
                      ? `${s.score}${s.totalScore ? ` / ${s.totalScore}` : ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="field-input py-1.5 text-xs w-auto"
                      value={s.enrollmentStatus ?? "current"}
                      onChange={(e) => {
                        setEnrollmentStatus(s.id, e.target.value as EnrollmentStatus);
                        pushToast(
                          e.target.value === "former"
                            ? "Đã chuyển sang Học viên cũ."
                            : "Đã chuyển sang Đang học."
                        );
                      }}
                    >
                      <option value="current">● Đang học</option>
                      <option value="former">Học viên cũ</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="btn-secondary text-xs py-1.5 px-2.5"
                      onClick={() => removeStudent(s.id)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddClassStudentModal classId={classId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
