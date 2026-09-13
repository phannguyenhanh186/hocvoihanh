interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function ExplanationEditor({ value, onChange }: Props) {
  return (
    <div>
      <label className="field-label">
        Giải thích{" "}
        <span className="font-normal text-ink/40">
          (học viên xem sau khi nộp — không bắt buộc)
        </span>
      </label>
      <textarea
        className="field-textarea min-h-[80px]"
        placeholder="Giải thích đáp án..."
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
