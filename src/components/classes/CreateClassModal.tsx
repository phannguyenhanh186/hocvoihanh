import { useState } from "react";
import Modal from "../ui/Modal";
import {
  ProductType,
  Level,
  PRODUCT_LABELS,
  LEVEL_LABELS,
  WEEKDAYS,
} from "../../types";
import { useAppStore } from "../../store/useAppStore";

interface Props {
  onClose: () => void;
}

export default function CreateClassModal({ onClose }: Props) {
  const createClass = useAppStore((s) => s.createClass);
  const pushToast = useAppStore((s) => s.pushToast);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level | "">("");
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!product) nextErrors.product = "Chọn sản phẩm lớp.";
    if (!name.trim()) nextErrors.name = "Nhập tên lớp.";
    if (!level) nextErrors.level = "Chọn mục tiêu / trình độ.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    createClass({
      name: name.trim(),
      product,
      level: level as Level,
      schedule: days.length > 0 ? { days, startTime: startTime || undefined, endTime: endTime || undefined } : undefined,
    });
    pushToast("Đã tạo lớp thành công.");
    onClose();
  }

  return (
    <Modal
      title="Tạo lớp mới"
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Tạo lớp
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Sản phẩm lớp */}
        <div>
          <label className="field-label">Sản phẩm lớp</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PRODUCT_LABELS) as ProductType[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProduct(p)}
                className={`text-sm px-3 py-2.5 rounded-md border text-left transition-colors ${
                  product === p
                    ? "border-navy bg-navy-50 text-navy font-medium"
                    : "border-line hover:bg-paper"
                }`}
              >
                {PRODUCT_LABELS[p]}
              </button>
            ))}
          </div>
          {errors.product && (
            <p className="text-xs text-red-600 mt-1.5">{errors.product}</p>
          )}
        </div>

        {/* Tên lớp */}
        <div>
          <label className="field-label" htmlFor="class-name">
            Tên lớp
          </label>
          <input
            id="class-name"
            className="field-input"
            placeholder="Ví dụ: Giao tiếp Mầm — Tối 3-5"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Mục tiêu / trình độ */}
        <div>
          <label className="field-label" htmlFor="class-level">
            Mục tiêu / trình độ
          </label>
          <select
            id="class-level"
            className="field-input"
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
          >
            <option value="" disabled>
              Chọn trình độ
            </option>
            {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="text-xs text-red-600 mt-1.5">{errors.level}</p>
          )}
        </div>

        {/* Lịch học */}
        <div>
          <label className="field-label">Lịch học (không bắt buộc)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                  days.includes(day)
                    ? "border-navy bg-navy text-white font-medium"
                    : "border-line text-ink/70 hover:bg-paper"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              className="field-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span className="text-ink/40">—</span>
            <input
              type="time"
              className="field-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
