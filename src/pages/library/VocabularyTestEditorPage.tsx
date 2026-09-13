import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import {
  Level,
  LEVEL_LABELS,
  VocabQuestion,
  VocabQuestionType,
  VOCAB_QUESTION_TYPE_LABELS,
} from "../../types";

const ALL_VOCAB_TYPES = Object.keys(VOCAB_QUESTION_TYPE_LABELS) as VocabQuestionType[];

export default function VocabularyTestEditorPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const test = useAppStore((s) => s.vocabularyTests.find((t) => t.id === testId));
  const flashcardSets = useAppStore((s) => s.flashcardSets);
  const generateVocabQuestions = useAppStore((s) => s.generateVocabQuestions);
  const saveVocabularyTest = useAppStore((s) => s.saveVocabularyTest);
  const pushToast = useAppStore((s) => s.pushToast);

  const [title, setTitle] = useState(test?.title ?? "");
  const [level, setLevel] = useState<Level | "">(test?.level ?? "");
  const [selectedSetIds, setSelectedSetIds] = useState<string[]>(test?.flashcardSetIds ?? []);
  const [selectedTypes, setSelectedTypes] = useState<VocabQuestionType[]>(["see_word_choose_meaning"]);
  const [questions, setQuestions] = useState<VocabQuestion[]>(test?.questions ?? []);

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

  function toggleSet(id: string) {
    setSelectedSetIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function toggleType(type: VocabQuestionType) {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }

  function handleGenerate() {
    if (selectedSetIds.length === 0) {
      pushToast("Chọn ít nhất một Flashcard Set trước khi tạo câu hỏi.");
      return;
    }
    if (selectedTypes.length === 0) {
      pushToast("Chọn ít nhất một dạng câu hỏi.");
      return;
    }
    // persist set selection first so the store can read the right cards
    saveVocabularyTest(test!.id, questions, title.trim() || undefined);
    useAppStore.setState((state) => ({
      vocabularyTests: state.vocabularyTests.map((t) =>
        t.id === test!.id ? { ...t, flashcardSetIds: selectedSetIds } : t
      ),
    }));
    generateVocabQuestions(test!.id, selectedTypes);
    const updated = useAppStore.getState().vocabularyTests.find((t) => t.id === test!.id);
    setQuestions(updated?.questions ?? []);
    pushToast("Đã tạo câu hỏi từ flashcard.");
  }

  function updateQuestion(id: string, patch: Partial<VocabQuestion>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id).map((q, idx) => ({ ...q, order: idx })));
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    setQuestions((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((q, idx) => ({ ...q, order: idx }));
    });
  }

  function handleSave() {
    saveVocabularyTest(test!.id, questions, title.trim() || "Vocabulary Test chưa đặt tên");
    useAppStore.setState((state) => ({
      vocabularyTests: state.vocabularyTests.map((t) =>
        t.id === test!.id ? { ...t, flashcardSetIds: selectedSetIds, level: level || undefined } : t
      ),
    }));
    pushToast("Đã lưu Vocabulary Test.");
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
          placeholder="Tên bài (Vocabulary Test)"
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

      <div className="card p-5 mb-6 space-y-4">
        <div>
          <label className="field-label">Chọn Flashcard Set</label>
          {flashcardSets.length === 0 ? (
            <p className="text-xs text-ink/45">Chưa có bộ flashcard nào — tạo trong Learning Materials trước.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {flashcardSets.map((set_) => (
                <button
                  key={set_.id}
                  type="button"
                  onClick={() => toggleSet(set_.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                    selectedSetIds.includes(set_.id)
                      ? "border-navy bg-navy text-white font-medium"
                      : "border-line text-ink/70 hover:bg-paper"
                  }`}
                >
                  {set_.title} ({set_.cards.length})
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="field-label">Dạng câu hỏi (V1)</label>
          <div className="flex flex-wrap gap-2">
            {ALL_VOCAB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                  selectedTypes.includes(type)
                    ? "border-navy bg-navy text-white font-medium"
                    : "border-line text-ink/70 hover:bg-paper"
                }`}
              >
                {VOCAB_QUESTION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-secondary" onClick={handleGenerate}>
          <Sparkles size={15} /> Generate questions
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="card p-8 text-center text-ink/45 text-sm">
          Chưa có câu hỏi nào. Chọn flashcard set + dạng câu hỏi rồi bấm "Generate questions".
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-navy bg-navy-50 px-2 py-1 rounded-full">
                  Câu {idx + 1} · {VOCAB_QUESTION_TYPE_LABELS[q.type]}
                </span>
                <div className="flex items-center gap-1">
                  <button className="text-ink/30 hover:text-ink p-1" onClick={() => moveQuestion(idx, -1)}>
                    <ArrowUp size={14} />
                  </button>
                  <button className="text-ink/30 hover:text-ink p-1" onClick={() => moveQuestion(idx, 1)}>
                    <ArrowDown size={14} />
                  </button>
                  <button className="text-ink/30 hover:text-red-600 p-1" onClick={() => deleteQuestion(q.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <label className="field-label">Prompt</label>
              <input
                className="field-input mb-2"
                value={q.prompt}
                onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
              />

              {q.choices && (
                <>
                  <label className="field-label">Lựa chọn (cách nhau bởi dấu phẩy)</label>
                  <input
                    className="field-input mb-2"
                    value={q.choices.join(", ")}
                    onChange={(e) =>
                      updateQuestion(q.id, { choices: e.target.value.split(",").map((c) => c.trim()) })
                    }
                  />
                </>
              )}

              <label className="field-label">Đáp án đúng</label>
              <input
                className="field-input"
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
