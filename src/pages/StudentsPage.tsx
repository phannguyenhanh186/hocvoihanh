import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import StudentTable from "../components/students/StudentTable";
import AddStudentModal from "../components/students/AddStudentModal";

type FilterTab = "all" | "active" | "pending";

export default function StudentsPage() {
  const students = useAppStore((s) => s.students);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [showModal, setShowModal] = useState(false);

  const pendingCount = students.filter((s) => s.status === "pending").length;

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (tab === "active" && s.status !== "active") return false;
      if (tab === "pending" && s.status !== "pending") return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.contact.includes(query)) {
        return false;
      }
      return true;
    });
  }, [students, tab, query]);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Đang học" },
    { id: "pending", label: `Chờ duyệt${pendingCount ? ` (${pendingCount})` : ""}` },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý học viên</h1>
          <p className="text-sm text-ink/55 mt-1.5">
            Xem danh sách, duyệt học viên chờ và xếp lớp.
          </p>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Thêm học viên
        </button>
      </div>

      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                tab === t.id ? "bg-navy text-white" : "text-ink/60 hover:bg-black/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            className="field-input pl-8"
            placeholder="Tìm theo tên hoặc liên hệ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <StudentTable students={filtered} />

      {showModal && <AddStudentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
