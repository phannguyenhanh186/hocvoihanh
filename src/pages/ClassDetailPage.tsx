import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Link2, Trash2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import ClassDetailHeader from "../components/classes/detail/ClassDetailHeader";
import StudentsTab from "../components/classes/detail/StudentsTab";
import AttendanceTab from "../components/classes/detail/AttendanceTab";
import AssignmentsTab from "../components/classes/detail/AssignmentsTab";
import DiscussionTab from "../components/classes/detail/DiscussionTab";

type TabId = "students" | "attendance" | "assignments" | "discussion";

const TABS: { id: TabId; label: string }[] = [
  { id: "students", label: "Học viên" },
  { id: "attendance", label: "Buổi dạy & điểm danh" },
  { id: "assignments", label: "Bài tập & Bài thi" },
  { id: "discussion", label: "Trao đổi" },
];

export default function ClassDetailPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const classRecord = useAppStore((s) => s.classes.find((c) => c.id === classId));
  const pushToast = useAppStore((s) => s.pushToast);
  const deleteClass = useAppStore((s) => s.deleteClass);
  const [tab, setTab] = useState<TabId>("students");

  function copyStudentLink() {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}student/${classId}`.replace(/([^:])\/\//g, "$1/");
    navigator.clipboard.writeText(url).then(
      () => pushToast("Đã copy link cho học viên."),
      () => pushToast("Không copy được — copy thủ công: " + url)
    );
  }

  function handleDeleteClass() {
    if (!classRecord) return;
    if (!window.confirm(`Xoá lớp "${classRecord.name}"? Buổi dạy, bài tập/bài thi, trao đổi và BTVN đã giao của lớp này sẽ bị xoá. Học viên vẫn được giữ lại trong danh sách chung.`)) {
      return;
    }
    deleteClass(classRecord.id);
    pushToast("Đã xoá lớp.");
    navigate("/teacher/classes");
  }

  if (!classRecord) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy lớp học. Quay lại{" "}
        <button className="text-navy underline" onClick={() => navigate("/teacher/classes")}>
          Lớp học của tôi
        </button>
        .
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button
          className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
          onClick={() => navigate("/teacher/classes")}
        >
          <ArrowLeft size={16} /> Lớp học của tôi
        </button>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm" onClick={copyStudentLink}>
            <Link2 size={14} /> Link cho học viên
          </button>
          <button className="btn-secondary text-sm text-red-600" onClick={handleDeleteClass}>
            <Trash2 size={14} /> Xoá lớp
          </button>
        </div>
      </div>

      <ClassDetailHeader classRecord={classRecord} />

      <div className="flex gap-1 border-b border-line mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-navy text-navy"
                : "border-transparent text-ink/55 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "students" && <StudentsTab classId={classRecord.id} />}
      {tab === "attendance" && <AttendanceTab classId={classRecord.id} />}
      {tab === "assignments" && <AssignmentsTab classId={classRecord.id} />}
      {tab === "discussion" && <DiscussionTab classId={classRecord.id} />}
    </div>
  );
}
