import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import ClassSummary from "../components/classes/ClassSummary";
import ClassGrid from "../components/classes/ClassGrid";
import CreateClassModal from "../components/classes/CreateClassModal";

export default function ClassesPage() {
  const classes = useAppStore((s) => s.classes);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold">Lớp học của tôi</h1>
          <p className="text-sm text-ink/55 mt-1.5 max-w-xl">
            Tạo lớp → mời học viên → duyệt học viên → giao bài và điểm danh.
          </p>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Lớp mới
        </button>
      </div>

      <div className="h-6" />

      <ClassSummary />
      <ClassGrid classes={classes} />

      {showModal && <CreateClassModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
