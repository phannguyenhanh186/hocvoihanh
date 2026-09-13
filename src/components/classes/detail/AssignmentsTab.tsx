import { useMemo, useState } from "react";
import { List, CalendarDays, Plus } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { Assignment, AssignmentKind } from "../../../types";
import AssignmentModal from "./AssignmentModal";
import SubmissionsModal from "./SubmissionsModal";

type SubTab = "list" | "weekly";

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay() === 0 ? 7 : date.getDay(); // Mon=1..Sun=7
  date.setDate(date.getDate() - (day - 1));
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function AssignmentsTab({ classId }: { classId: string }) {
  const assignments = useAppStore((s) => s.assignments.filter((a) => a.classId === classId));
  const students = useAppStore((s) => s.students.filter((st) => st.classId === classId));
  const deleteAssignment = useAppStore((s) => s.deleteAssignment);
  const pushToast = useAppStore((s) => s.pushToast);

  const [subTab, setSubTab] = useState<SubTab>("list");
  const [modalKind, setModalKind] = useState<AssignmentKind | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);
  const [viewingSubmissions, setViewingSubmissions] = useState<Assignment | null>(null);

  const homeworkCount = assignments.filter((a) => a.kind === "homework").length;
  const testCount = assignments.filter((a) => a.kind === "test").length;

  const weekDays = useMemo(() => {
    const monday = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  function openModal(kind: AssignmentKind, defaultDate?: string) {
    setModalDefaultDate(defaultDate);
    setModalKind(kind);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink/60">
          {homeworkCount} bài tập · {testCount} bài thi
        </p>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" onClick={() => openModal("homework")}>
            <Plus size={15} /> Giao bài tập
          </button>
          <button
            className="btn-secondary"
            onClick={() => openModal("homework", new Date().toISOString().slice(0, 10))}
          >
            <Plus size={15} /> Bài về nhà theo ngày
          </button>
          <button className="btn-primary" onClick={() => openModal("test")}>
            <Plus size={16} /> Tạo bài thi
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 mb-5">
        <button
          onClick={() => setSubTab("list")}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
            subTab === "list" ? "bg-navy text-white" : "text-ink/60 hover:bg-black/5"
          }`}
        >
          <List size={14} /> Danh sách
        </button>
        <button
          onClick={() => setSubTab("weekly")}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
            subTab === "weekly" ? "bg-navy text-white" : "text-ink/60 hover:bg-black/5"
          }`}
        >
          <CalendarDays size={14} /> Bảng tuần bài về nhà
        </button>
      </div>

      {subTab === "list" ? (
        assignments.length === 0 ? (
          <div className="card p-10 text-center text-ink/50 text-sm">
            Chưa có bài tập hay bài thi nào được giao.
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => {
              const submittedCount = a.submissions.length;
              const total = students.length || 1;
              const pct = Math.round((submittedCount / total) * 100);
              return (
                <div key={a.id} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold">{a.title}</h3>
                        {a.kind === "test" && (
                          <span className="text-[11px] font-semibold tracking-wide text-accent-orange bg-accent-orange-soft px-2 py-0.5 rounded-full">
                            BÀI THI
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink/50 mt-1">
                        {a.dueDate
                          ? `Hạn ${new Date(a.dueDate).toLocaleDateString("vi-VN")}`
                          : "Không giới hạn hạn nộp"}{" "}
                        · {a.testIds.length} đề
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium">
                        {submittedCount}/{students.length} nộp
                      </p>
                      <div className="w-24 h-1.5 bg-line rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-navy" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-line">
                    <button
                      className="btn-secondary text-sm"
                      onClick={() => setViewingSubmissions(a)}
                    >
                      Xem bài nộp · chấm · nhận xét
                    </button>
                    <button
                      className="btn-secondary text-sm text-red-600"
                      onClick={() => {
                        deleteAssignment(a.id);
                        pushToast("Đã xoá.");
                      }}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const dayAssignments = assignments.filter(
              (a) => a.kind === "homework" && a.dueDate === iso
            );
            return (
              <div key={iso} className="card p-3 min-h-[140px]">
                <p className="text-xs font-semibold text-ink/45 mb-2">
                  {d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
                </p>
                <div className="space-y-1.5">
                  {dayAssignments.map((a) => (
                    <div key={a.id} className="text-xs bg-navy-50 text-navy rounded px-2 py-1.5 font-medium">
                      {a.title}
                    </div>
                  ))}
                  {dayAssignments.length === 0 && (
                    <p className="text-xs text-ink/30 italic">Không có bài</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalKind && (
        <AssignmentModal
          classId={classId}
          kind={modalKind}
          title={modalKind === "test" ? "Tạo bài thi" : "Giao bài tập"}
          defaultDate={modalDefaultDate}
          onClose={() => setModalKind(null)}
        />
      )}
      {viewingSubmissions && (
        <SubmissionsModal
          assignment={viewingSubmissions}
          onClose={() => setViewingSubmissions(null)}
        />
      )}
    </div>
  );
}
