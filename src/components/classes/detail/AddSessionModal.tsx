import { useState } from "react";
import Modal from "../../ui/Modal";
import { Session } from "../../../types";
import { useAppStore } from "../../../store/useAppStore";

interface Props {
  classId: string;
  session?: Session;
  onClose: () => void;
}

export default function AddSessionModal({ classId, session, onClose }: Props) {
  const addSession = useAppStore((s) => s.addSession);
  const updateSession = useAppStore((s) => s.updateSession);
  const pushToast = useAppStore((s) => s.pushToast);

  const [date, setDate] = useState(session?.date ?? new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState(String(session?.durationHours ?? 1.5));
  const [topic, setTopic] = useState(session?.topic ?? "");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!topic.trim()) {
      setError("Nhập chủ đề buổi dạy.");
      return;
    }
    const durationHours = Number(duration) || 1.5;
    if (session) {
      updateSession(session.id, { date, durationHours, topic: topic.trim() });
      pushToast("Đã cập nhật buổi dạy.");
    } else {
      addSession(classId, date, durationHours, topic.trim());
      pushToast("Đã tạo buổi dạy mới.");
    }
    onClose();
  }

  return (
    <Modal
      title={session ? "Sửa buổi dạy" : "Buổi dạy mới"}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {session ? "Lưu" : "Tạo buổi"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Ngày</label>
            <input
              type="date"
              className="field-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Thời lượng (giờ)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              className="field-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="field-label">Chủ đề buổi dạy</label>
          <input
            className="field-input"
            placeholder="Ví dụ: Advanced Math — hàm bậc hai"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
        </div>
      </div>
    </Modal>
  );
}
