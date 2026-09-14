import { useState } from "react";
import Modal from "../ui/Modal";
import { useAppStore } from "../../store/useAppStore";

export default function AddStudentModal({ onClose }: { onClose: () => void }) {
  const classes = useAppStore((s) => s.classes);
  const addStudent = useAppStore((s) => s.addStudent);
  const pushToast = useAppStore((s) => s.pushToast);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [classId, setClassId] = useState<string>("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) {
      setError("Nhập tên học viên.");
      return;
    }
    addStudent(name.trim(), contact.trim(), classId || null);
    pushToast("Đã thêm học viên.");
    onClose();
  }

  return (
    <Modal
      title="Thêm học viên"
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Thêm học viên
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="field-label">Tên học viên</label>
          <input
            className="field-input"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
        </div>
        <div>
          <label className="field-label">Email hoặc số điện thoại</label>
          <input
            className="field-input"
            placeholder="email@example.com hoặc 09xx xxx xxx"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Xếp vào lớp (không bắt buộc)</label>
          <select
            className="field-input"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Chưa xếp lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
