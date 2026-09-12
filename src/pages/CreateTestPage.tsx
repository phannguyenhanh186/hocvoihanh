import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { useAppStore, makeDefaultOptions } from "../store/useAppStore";
import { Question } from "../types";
import QuestionCard from "../components/content/QuestionCard";

function isQuestionValid(q: Question): boolean {
  if (!q.content.trim()) return false;
  if (q.type === "multiple_choice") {
    return Boolean(q.options && q.options.length >= 2 && q.correctOptionId);
  }
  if (q.type === "short_answer") {
    return Boolean(q.expectedAnswer?.trim());
  }
  return true; // essay
}

export default function CreateTestPage() {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
  const navigate = useNavigate();

  const tests = useAppStore((s) => s.tests);
  const saveTest = useAppStore((s) => s.saveTest);
  const pushToast = useAppStore((s) => s.pushToast);

  const test = tests.find((t) => t.id === testId);

  const [questions, setQuestions] = useState<Question[]>(test?.questions ?? []);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (test) setQuestions(test.questions);
  }, [testId]);

  if (!test) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy đề. Quay lại{" "}
        <button className="text-navy underline" onClick={() => navigate("/teacher/content")}>
          Kho bài của tôi
        </button>
        .
      </div>
    );
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  }

  function addQuestion() {
    const newQuestion: Question = {
      id: uuid(),
      type: "multiple_choice",
      content: "",
      options: makeDefaultOptions(),
      order: questions.length,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) =>
      prev.filter((q) => q.id !== id).map((q, idx) => ({ ...q, order: idx }))
    );
  }

  function handleSave() {
    setShowValidation(true);
    const allValid = questions.every(isQuestionValid);
    if (!allValid) {
      pushToast("Còn câu hỏi chưa hoàn chỉnh — kiểm tra lại trước khi lưu.");
      return;
    }
    saveTest(testId as string, questions);
    pushToast("Đã lưu đề.");
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
          onClick={() => navigate("/teacher/content")}
        >
          <ArrowLeft size={16} /> Kho bài của tôi
        </button>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={16} /> Lưu đề
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">{test.title}</h1>

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
