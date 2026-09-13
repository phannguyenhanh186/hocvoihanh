import { useMemo, useState } from "react";
import { Plus, Upload, Download } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { ATTENDANCE_LABELS, AttendanceStatus, Session } from "../../../types";
import AddSessionModal from "./AddSessionModal";

function exportCsv(sessions: Session[], studentNameById: Map<string, string>) {
  const rows = [["Ngày", "Chủ đề", "Thời lượng (h)", "Học viên", "Điểm danh", "Ghi chú"]];
  for (const s of sessions) {
    for (const a of s.attendance) {
      rows.push([
        s.date,
        s.topic,
        String(s.durationHours),
        studentNameById.get(a.studentId) ?? a.studentId,
        ATTENDANCE_LABELS[a.status],
        a.note ?? "",
      ]);
    }
  }
  const csv = rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "diem-danh.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AttendanceTab({ classId }: { classId: string }) {
  const sessions = useAppStore((s) => s.sessions.filter((sess) => sess.classId === classId));
  const students = useAppStore((s) => s.students.filter((st) => st.classId === classId));
  const setAttendance = useAppStore((s) => s.setAttendance);
  const setAttendanceNote = useAppStore((s) => s.setAttendanceNote);
  const deleteSession = useAppStore((s) => s.deleteSession);
  const pushToast = useAppStore((s) => s.pushToast);

  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const studentNameById = useMemo(
    () => new Map(students.map((s) => [s.id, s.name])),
    [students]
  );

  const thisMonthHours = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return sessions
      .filter((s) => s.date.startsWith(currentMonth))
      .reduce((sum, s) => sum + s.durationHours, 0);
  }, [sessions]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink/60">
          {sessions.length} buổi đã ghi · tháng này <span className="font-medium text-ink">{thisMonthHours}h</span> dạy
        </p>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            onClick={() => pushToast("Tính năng nhập từ sheet cần kết nối thêm — chưa khả dụng trong bản này.")}
          >
            <Upload size={15} /> Nhập từ sheet
          </button>
          <button className="btn-secondary" onClick={() => exportCsv(sessions, studentNameById)}>
            <Download size={15} /> Xuất CSV
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Buổi dạy mới
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="card p-10 text-center text-ink/50 text-sm">
          Chưa có buổi dạy nào được ghi lại.
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const presentCount = session.attendance.filter((a) => a.status === "present").length;
            return (
              <div key={session.id} className="card p-5">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-display font-semibold">
                      Buổi {new Date(session.date).toLocaleDateString("vi-VN")} ·{" "}
                      <span className="font-normal text-ink/60">{session.durationHours}h</span>
                    </h3>
                    <p className="text-sm text-ink/50 mt-0.5">{session.topic}</p>
                  </div>
                  <span className="text-sm text-ink/50 shrink-0">
                    {presentCount}/{session.attendance.length} có mặt
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {session.attendance.map((a) => (
                    <div key={a.studentId} className="flex items-center gap-2.5">
                      <span className="w-40 shrink-0 text-sm font-medium truncate">
                        {studentNameById.get(a.studentId) ?? "—"}
                      </span>
                      <input
                        className="field-input flex-1 text-sm"
                        placeholder="Ghi chú riêng cho HV này"
                        defaultValue={a.note ?? ""}
                        onBlur={(e) => setAttendanceNote(session.id, a.studentId, e.target.value)}
                      />
                      <div className="flex gap-1.5 shrink-0">
                        {(["present", "late", "absent"] as AttendanceStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => setAttendance(session.id, a.studentId, status)}
                            className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${
                              a.status === status
                                ? status === "present"
                                  ? "border-accent-green bg-accent-green-soft text-accent-green"
                                  : status === "absent"
                                  ? "border-red-300 bg-red-50 text-red-600"
                                  : "border-amber-300 bg-amber-50 text-amber-700"
                                : "border-line text-ink/60 hover:bg-paper"
                            }`}
                          >
                            {ATTENDANCE_LABELS[status]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-line">
                  <button
                    className="btn-secondary text-sm"
                    onClick={() => setEditingSession(session)}
                  >
                    Sửa buổi
                  </button>
                  <button
                    className="btn-secondary text-sm text-red-600"
                    onClick={() => {
                      deleteSession(session.id);
                      pushToast("Đã xoá buổi dạy.");
                    }}
                  >
                    Xoá buổi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && <AddSessionModal classId={classId} onClose={() => setShowModal(false)} />}
      {editingSession && (
        <AddSessionModal
          classId={classId}
          session={editingSession}
          onClose={() => setEditingSession(null)}
        />
      )}
    </div>
  );
}
