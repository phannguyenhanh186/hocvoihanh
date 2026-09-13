import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Level, LEVEL_LABELS, Question } from "../../types";
import QuestionListEditor from "../../components/content/QuestionListEditor";

const ALLOWED = ["multiple_choice", "short_answer"] as const;

export default function GrammarTestEditorPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const test = useAppStore((s) => s.grammarTests.find((t) => t.id === testId));
  const saveGrammarTest = useAppStore((s) => s.saveGrammarTest);
  const pushToast = useAppStore((s) => s.pushToast);

  const [title, setTitle] = useState(test?.title ?? "");
  const [level, setLevel] = useState<Level | "">(test?.level ?? "");
  const [questions, setQuestions] = useState<Question[]>(test?.questions ?? []);
  const [showValidation, setShowValidation] = useState(false);

  if (!test) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy bài. Quay lại{" "}
        <button className="text-navy underline" onClick={() => navigate("/teacher/library/exercises")}>
          Exercise Bank
        </button>
        .
      </div>
    );
  }

  function handleSave() {
    setShowValidation(true);
    saveGrammarTest(test!.id, questions, title.trim() || "Grammar Test chưa đặt tên", level || undefined);
    pushToast("Đã lưu Grammar Test.");
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
          onClick={() => navigate("/teacher/library/exercises")}
        >
          <ArrowLeft size={16} /> Exercise Bank
        </button>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={16} /> Lưu
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          className="text-2xl font-bold font-display bg-transparent border-none outline-none flex-1 px-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên bài (Grammar Test)"
        />
        <select className="field-input w-auto" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
          <option value="">Trình độ (tùy chọn)</option>
          {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
            <option key={l} value={l}>
              {LEVEL_LABELS[l]}
            </option>
          ))}
        </select>
      </div>

      <QuestionListEditor
        questions={questions}
        onChange={setQuestions}
        showValidation={showValidation}
        allowedTypes={[...ALLOWED]}
      />
    </div>
  );
}
