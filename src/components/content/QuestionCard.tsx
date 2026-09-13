import { Trash2 } from "lucide-react";
import { Question, QuestionType } from "../../types";
import { makeDefaultOptions } from "../../store/useAppStore";
import ImageUploader, { fileToDataUrl } from "./ImageUploader";
import QuestionTypeSelector from "./QuestionTypeSelector";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import ShortAnswerEditor from "./ShortAnswerEditor";
import EssayEditor from "./EssayEditor";
import ExplanationEditor from "./ExplanationEditor";

interface Props {
  question: Question;
  displayNumber: number;
  onChange: (patch: Partial<Question>) => void;
  onDelete: () => void;
  canDelete: boolean;
  showValidation: boolean;
  allowedTypes?: QuestionType[];
}

export default function QuestionCard({
  question,
  displayNumber,
  onChange,
  onDelete,
  canDelete,
  showValidation,
  allowedTypes,
}: Props) {
  function handleTypeChange(type: QuestionType) {
    // Preserve common fields (content, image, explanation); reset type-specific fields.
    if (type === "multiple_choice") {
      onChange({ type, options: makeDefaultOptions(), correctOptionId: undefined });
    } else {
      onChange({ type, options: undefined, correctOptionId: undefined });
    }
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/")
    );
    if (!item) return;
    const file = item.getAsFile();
    if (!file) return;
    e.preventDefault();
    const dataUrl = await fileToDataUrl(file);
    onChange({ image: dataUrl });
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-display font-semibold text-base">
          Câu {displayNumber}
        </h3>
        <div className="flex items-center gap-3">
          <QuestionTypeSelector value={question.type} onChange={handleTypeChange} allowedTypes={allowedTypes} />
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete}
            className="text-ink/30 hover:text-red-600 disabled:opacity-25 disabled:hover:text-ink/30 transition-colors p-1.5"
            aria-label={`Xóa câu ${displayNumber}`}
            title={canDelete ? "Xóa câu hỏi" : "Đề phải có ít nhất 1 câu hỏi"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          className="field-textarea min-h-[90px] text-[15px]"
          placeholder={`Đề bài câu ${displayNumber}...`}
          value={question.content}
          onChange={(e) => onChange({ content: e.target.value })}
          onPaste={handlePaste}
        />

        <ImageUploader
          image={question.image}
          onChange={(dataUrl) => onChange({ image: dataUrl })}
        />

        {question.type === "multiple_choice" && (
          <MultipleChoiceEditor
            question={question}
            onChange={onChange}
            showValidation={showValidation}
          />
        )}
        {question.type === "short_answer" && (
          <ShortAnswerEditor
            question={question}
            onChange={onChange}
            showValidation={showValidation}
          />
        )}
        {question.type === "essay" && <EssayEditor />}

        <ExplanationEditor
          value={question.explanation}
          onChange={(explanation) => onChange({ explanation })}
        />
      </div>
    </div>
  );
}
