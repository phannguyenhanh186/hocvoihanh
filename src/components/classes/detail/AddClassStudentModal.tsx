import { useState } from "react";
import Modal from "../../ui/Modal";
import { useAppStore } from "../../../store/useAppStore";

interface Props {
  classId: string;
  onClose: () => void;
}

export default function AddClassStudentModal({ classId, onClose }: Props) {
  const addStudent = useAppStore((s) => s.addStudent);
  const pushToast = useAppStore((s) => s.pushToast);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) {
      setError("Nhập tên học viên.");
      return;
    }
    addStudent(name.trim(), phone.trim() || email.trim(), classId, {
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      birthYear: birthYear ? Number(birthYear) : undefined,
    });
    pushToast("Đã thêm học viên vào lớp.");
    onClose();
  }

  return (
    <Modal
      title="Thêm học viên thủ công"
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">SĐT</label>
            <input
              className="field-input"
              placeholder="09xx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Năm sinh</label>
            <input
              className="field-input"
              type="number"
              placeholder="2010"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="field-label">Email</label>
          <input
            className="field-input"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
