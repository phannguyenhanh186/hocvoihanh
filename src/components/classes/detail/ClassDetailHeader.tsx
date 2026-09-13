import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { ClassRecord, PRODUCT_LABELS, LEVEL_LABELS } from "../../../types";
import { useAppStore } from "../../../store/useAppStore";

export default function ClassDetailHeader({ classRecord }: { classRecord: ClassRecord }) {
  const updateClassMeetingLink = useAppStore((s) => s.updateClassMeetingLink);
  const pushToast = useAppStore((s) => s.pushToast);
  const [link, setLink] = useState(classRecord.meetingLink ?? "");
  const [saved, setSaved] = useState(true);

  function handleSave() {
    updateClassMeetingLink(classRecord.id, link.trim());
    pushToast("Đã lưu link lớp học.");
    setSaved(true);
  }

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold">{classRecord.name}</h1>
      <div className="flex items-center gap-2 mt-2">
        <span className="inline-flex items-center rounded-full bg-navy-50 text-navy text-xs font-medium px-2.5 py-1">
          {PRODUCT_LABELS[classRecord.product]}
        </span>
        <span className="text-sm text-ink/60">{LEVEL_LABELS[classRecord.level]}</span>
      </div>

      <div className="card p-4 mt-5 max-w-xl">
        <label className="field-label flex items-center gap-1.5">
          <Link2 size={14} /> Link lớp học
        </label>
        <p className="text-xs text-ink/50 mb-2.5">
          Dán link Zoom/Meet vào đây và lưu — học viên sẽ thấy nút "Vào lớp học" trong mục Lớp của tôi.
        </p>
        <div className="flex items-center gap-2">
          <input
            className="field-input"
            placeholder="https://meet.google.com/..."
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setSaved(false);
            }}
          />
          <button className="btn-primary shrink-0" onClick={handleSave} disabled={saved}>
            {saved ? <Check size={16} /> : null}
            {saved ? "Đã lưu" : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
