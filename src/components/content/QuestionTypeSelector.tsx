import { QuestionType, QUESTION_TYPE_LABELS } from "../../types";

interface Props {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
}

const ORDER: QuestionType[] = ["multiple_choice", "short_answer", "essay"];

export default function QuestionTypeSelector({ value, onChange }: Props) {
  return (
    <select
      className="field-input w-auto text-sm font-medium"
      value={value}
      onChange={(e) => onChange(e.target.value as QuestionType)}
    >
      {ORDER.map((type) => (
        <option key={type} value={type}>
          {QUESTION_TYPE_LABELS[type]}
        </option>
      ))}
    </select>
  );
}
