import { useMemo, useState } from "react";
import { GripVertical, Plus, X } from "lucide-react";
import { v4 as uuid } from "uuid";
import Modal from "../ui/Modal";
import { useAppStore } from "../../store/useAppStore";
import { HOMEWORK_CONTENT_KIND_LABELS, HomeworkDraftItem, HomeworkRecipientType } from "../../types";
import ContentPickerModal from "./ContentPickerModal";

interface Props {
  defaultClassId?: string;
  onClose: () => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function CreateHomeworkModal({ defaultClassId, onClose }: Props) {
  const classes = useAppStore((s) => s.classes);
  const students = useAppStore((s) => s.students);
  const bankPickerRows = useAppStore((s) => s.bankPickerRows());
  const createHomework = useAppStore((s) => s.createHomework);
  const pushToast = useAppStore((s) => s.pushToast);

  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState(defaultClassId ?? classes[0]?.id ?? "");
  const [recipientType, setRecipientType] = useState<HomeworkRecipientType>("class");
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [items, setItems] = useState<HomeworkDraftItem[]>([]);
  const [assignedDate, setAssignedDate] = useState(todayIso());
  const [dueDate, setDueDate] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const classStudents = useMemo(
    () => students.filter((st) => st.classId === classId && st.enrollmentStatus !== "former"),
    [students, classId]
  );

  const existingKeys = useMemo(() => new Set(items.map((it) => `${it.kind}:${it.sourceId}`)), [items]);

  const itemTitle = (it: HomeworkDraftItem) => bankPickerRows.find((r) => r.kind === it.kind && r.id === it.sourceId)?.title ?? "(đã bị xoá khỏi kho)";

  function toggleStudent(id: string) {
    setStudentIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function handleAddContent(added: { kind: HomeworkDraftItem["kind"]; sourceId: string }[]) {
    setItems((prev) => [...prev, ...added.map((a) => ({ draftId: uuid(), ...a }))]);
  }

  function removeItem(draftId: string) {
    setItems((prev) => prev.filter((it) => it.draftId !== draftId));
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
  }

  function handleSubmit() {
    if (!title.trim()) {
      setError("Nhập tên BTVN.");
      return;
    }
    if (!classId) {
      setError("Chọn lớp.");
      return;
    }
    if (recipientType === "students" && studentIds.length === 0) {
      setError("Chọn ít nhất một học viên.");
      return;
    }
    if (items.length === 0) {
      setError("Thêm ít nhất một nội dung.");
      return;
    }
    createHomework({
      title: title.trim(),
      classId,
      recipientType,
      studentIds,
      items: items.map((it) => ({ kind: it.kind, sourceId: it.sourceId })),
      assignedDate,
      dueDate: dueDate || undefined,
    });
    pushToast("Đã giao BTVN.");
    onClose();
  }

  return (
    <>
      <Modal
        title="Giao BTVN"
        onClose={onClose}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              Giao BTVN
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Tên BTVN</label>
            <input
              className="field-input"
              placeholder="Ví dụ: Ôn tập tuần này"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Lớp</label>
            <select
              className="field-input"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setStudentIds([]);
              }}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Người nhận</label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={recipientType === "class"}
                  onChange={() => setRecipientType("class")}
                />
                Cả lớp
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={recipientType === "students"}
                  onChange={() => setRecipientType("students")}
                />
                Học viên cụ thể
              </label>
            </div>
            {recipientType === "students" && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto border border-line rounded-md p-2">
                {classStudents.length === 0 ? (
                  <p className="text-xs text-ink/45 px-1">Lớp này chưa có học viên.</p>
                ) : (
                  classStudents.map((st) => (
                    <label key={st.id} className="flex items-center gap-2 text-sm px-1.5 py-1 rounded hover:bg-paper cursor-pointer">
                      <input type="checkbox" checked={studentIds.includes(st.id)} onChange={() => toggleStudent(st.id)} />
                      {st.name}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label mb-0">Nội dung</label>
              <button className="btn-secondary text-xs py-1.5" onClick={() => setPickerOpen(true)}>
                <Plus size={13} /> Thêm nội dung
              </button>
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-ink/45 border border-dashed border-line rounded-md p-4 text-center">
                Chưa có nội dung nào — bấm "Thêm nội dung" để chọn từ kho.
              </p>
            ) : (
              <div className="space-y-1.5">
                {items.map((it, index) => (
                  <div
                    key={it.draftId}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-line bg-white cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={15} className="text-ink/30 shrink-0" />
                    <span className="text-xs font-medium text-navy bg-navy-50 px-1.5 py-0.5 rounded-full shrink-0">
                      {HOMEWORK_CONTENT_KIND_LABELS[it.kind]}
                    </span>
                    <span className="flex-1 truncate">{itemTitle(it)}</span>
                    <button className="shrink-0 text-ink/35 hover:text-red-600 p-0.5" onClick={() => removeItem(it.draftId)}>
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Ngày giao</label>
              <input type="date" className="field-input" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Hạn nộp</label>
              <input type="date" className="field-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </Modal>

      {pickerOpen && (
        <ContentPickerModal existingKeys={existingKeys} onAdd={handleAddContent} onClose={() => setPickerOpen(false)} />
      )}
    </>
  );
}
