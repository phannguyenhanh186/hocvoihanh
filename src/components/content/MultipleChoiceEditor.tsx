import { v4 as uuid } from "uuid";
import { AlertTriangle, X } from "lucide-react";
import { Question } from "../../types";
import { nextOptionLabel } from "../../store/useAppStore";

interface Props {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
  showValidation: boolean;
}

const MIN_OPTIONS = 2;

export default function MultipleChoiceEditor({ question, onChange, showValidation }: Props) {
  const options = question.options ?? [];
  const hasCorrectAnswer = Boolean(question.correctOptionId);

  function updateOptionText(id: string, text: string) {
    onChange({
      options: options.map((o) => (o.id === id ? { ...o, text } : o)),
    });
  }

  function removeOption(id: string) {
    if (options.length <= MIN_OPTIONS) return;
    const remaining = options.filter((o) => o.id !== id);
    onChange({
      options: remaining,
      correctOptionId:
        question.correctOptionId === id ? undefined : question.correctOptionId,
    });
  }

  function addOption() {
    const label = nextOptionLabel(options);
    onChange({ options: [...options, { id: uuid(), label, text: "" }] });
  }

  return (
    <div>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2.5">
            <button
              type="button"
              role="radio"
              aria-checked={question.correctOptionId === option.id}
              onClick={() => onChange({ correctOptionId: option.id })}
              className={`shrink-0 w-5 h-5 rounded-full border-2 transition-colors ${
                question.correctOptionId === option.id
                  ? "border-navy bg-navy"
                  : "border-line hover:border-navy/50"
              }`}
              aria-label={`Đáp án đúng: phương án ${option.label}`}
            />
            <span className="w-5 shrink-0 text-sm font-medium text-ink/60">
              {option.label}
            </span>
            <input
              className="field-input flex-1"
              placeholder={`Phương án ${option.label}`}
              value={option.text}
              onChange={(e) => updateOptionText(option.id, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeOption(option.id)}
              disabled={options.length <= MIN_OPTIONS}
              className="shrink-0 text-ink/30 hover:text-red-600 disabled:opacity-25 disabled:hover:text-ink/30 transition-colors p-1"
              aria-label={`Xóa phương án ${option.label}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn-ghost text-sm mt-2.5 -ml-1" onClick={addOption}>
        + Phương án
      </button>

      {showValidation && !hasCorrectAnswer && (
        <div className="flex items-start gap-2 mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2.5 rounded-md">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>Chưa chọn đáp án đúng — bấm nút tròn bên trái phương án đúng.</span>
        </div>
      )}
    </div>
  );
}
