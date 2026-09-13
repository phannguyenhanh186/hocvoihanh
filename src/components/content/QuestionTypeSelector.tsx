import { QuestionType, QUESTION_TYPE_LABELS } from "../../types";

interface Props {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
  allowedTypes?: QuestionType[];
}

const ORDER: QuestionType[] = ["multiple_choice", "short_answer", "essay"];

export default function QuestionTypeSelector({ value, onChange, allowedTypes }: Props) {
  const options = allowedTypes ?? ORDER;
  return (
    <select
      className="field-input w-auto text-sm font-medium"
      value={value}
      onChange={(e) => onChange(e.target.value as QuestionType)}
    >
      {options.map((type) => (
        <option key={type} value={type}>
          {QUESTION_TYPE_LABELS[type]}
        </option>
      ))}
    </select>
  );
}
