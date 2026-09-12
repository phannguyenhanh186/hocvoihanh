import { Question } from "../../types";

interface Props {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
  showValidation: boolean;
}

export default function ShortAnswerEditor({ question, onChange, showValidation }: Props) {
  const missing = showValidation && !question.expectedAnswer?.trim();
  return (
    <div>
      <label className="field-label">Đáp án mong đợi</label>
      <input
        className="field-input"
        placeholder="Nhập đáp án mong đợi..."
        value={question.expectedAnswer ?? ""}
        onChange={(e) => onChange({ expectedAnswer: e.target.value })}
      />
      {missing && (
        <p className="text-xs text-amber-700 mt-1.5">
          Cần nhập đáp án mong đợi để chấm tự động.
        </p>
      )}
    </div>
  );
}
