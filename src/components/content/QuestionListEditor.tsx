import { v4 as uuid } from "uuid";
import { Plus } from "lucide-react";
import { Question, QuestionType } from "../../types";
import { makeDefaultOptions } from "../../store/useAppStore";
import QuestionCard from "./QuestionCard";

interface Props {
  questions: Question[];
  onChange: (questions: Question[]) => void;
  showValidation: boolean;
  allowedTypes?: QuestionType[];
}

export default function QuestionListEditor({ questions, onChange, showValidation, allowedTypes }: Props) {
  function updateQuestion(id: string, patch: Partial<Question>) {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function addQuestion() {
    const defaultType = allowedTypes?.[0] ?? "multiple_choice";
    const newQuestion: Question = {
      id: uuid(),
      type: defaultType,
      content: "",
      options: defaultType === "multiple_choice" ? makeDefaultOptions() : undefined,
      order: questions.length,
    };
    onChange([...questions, newQuestion]);
  }

  function deleteQuestion(id: string) {
    onChange(questions.filter((q) => q.id !== id).map((q, idx) => ({ ...q, order: idx })));
  }

  return (
    <div>
      <div className="space-y-5">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            displayNumber={idx + 1}
            onChange={(patch) => updateQuestion(q.id, patch)}
            onDelete={() => deleteQuestion(q.id)}
            canDelete={questions.length > 1}
            showValidation={showValidation}
            allowedTypes={allowedTypes}
          />
        ))}
      </div>

      <button
        type="button"
        className="btn-secondary mt-5 w-full justify-center py-3"
        onClick={addQuestion}
      >
        <Plus size={16} /> Thêm câu hỏi
      </button>
    </div>
  );
}
