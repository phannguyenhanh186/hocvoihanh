import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Copy, Eye, Trash2, Pencil } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { ExerciseKind, EXERCISE_KIND_LABELS, Level, LEVEL_LABELS } from "../../types";
import PreviewExerciseModal from "../../components/library/PreviewExerciseModal";
import type { ExerciseSummary } from "../../types";

const EDIT_PATH: Record<ExerciseKind, string> = {
  vocabulary: "/teacher/library/exercises/vocabulary",
  grammar: "/teacher/library/exercises/grammar",
  listening: "/teacher/library/exercises/listening",
  reading: "/teacher/library/exercises/reading",
};

export default function LibraryExercisesPage() {
  const navigate = useNavigate();
  const exerciseBank = useAppStore((s) => s.exerciseBank());
  const flashcardSets = useAppStore((s) => s.flashcardSets);
  const listeningMaterials = useAppStore((s) => s.listeningMaterials);
  const readingMaterials = useAppStore((s) => s.readingMaterials);

  const createVocabularyTest = useAppStore((s) => s.createVocabularyTest);
  const createGrammarTest = useAppStore((s) => s.createGrammarTest);
  const createListeningExercise = useAppStore((s) => s.createListeningExercise);
  const createReadingExercise = useAppStore((s) => s.createReadingExercise);

  const duplicateVocabularyTest = useAppStore((s) => s.duplicateVocabularyTest);
  const duplicateGrammarTest = useAppStore((s) => s.duplicateGrammarTest);
  const duplicateListeningExercise = useAppStore((s) => s.duplicateListeningExercise);
  const duplicateReadingExercise = useAppStore((s) => s.duplicateReadingExercise);

  const deleteVocabularyTest = useAppStore((s) => s.deleteVocabularyTest);
  const deleteGrammarTest = useAppStore((s) => s.deleteGrammarTest);
  const deleteListeningExercise = useAppStore((s) => s.deleteListeningExercise);
  const deleteReadingExercise = useAppStore((s) => s.deleteReadingExercise);

  const pushToast = useAppStore((s) => s.pushToast);

  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<ExerciseKind | "all">("all");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [previewing, setPreviewing] = useState<ExerciseSummary | null>(null);

  const filtered = useMemo(() => {
    return exerciseBank.filter((e) => {
      if (kindFilter !== "all" && e.kind !== kindFilter) return false;
      if (levelFilter !== "all" && e.level !== levelFilter) return false;
      if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [exerciseBank, kindFilter, levelFilter, query]);

  function handleCreate(kind: ExerciseKind) {
    if (kind === "vocabulary") {
      const t = createVocabularyTest("Vocabulary Test chưa đặt tên", []);
      navigate(`/teacher/library/exercises/vocabulary/${t.id}`);
    } else if (kind === "grammar") {
      const t = createGrammarTest("Grammar Test chưa đặt tên");
      navigate(`/teacher/library/exercises/grammar/${t.id}`);
    } else if (kind === "listening") {
      if (listeningMaterials.length === 0) {
        pushToast("Chưa có Listening Material nào — tạo một cái trong Learning Materials trước.");
        return;
      }
      const e = createListeningExercise("Listening Exercise chưa đặt tên", listeningMaterials[0].id);
      navigate(`/teacher/library/exercises/listening/${e.id}`);
    } else if (kind === "reading") {
      if (readingMaterials.length === 0) {
        pushToast("Chưa có Reading Material nào — tạo một cái trong Learning Materials trước.");
        return;
      }
      const e = createReadingExercise("Reading Exercise chưa đặt tên", readingMaterials[0].id);
      navigate(`/teacher/library/exercises/reading/${e.id}`);
    }
  }

  function handleDuplicate(item: ExerciseSummary) {
    if (item.kind === "vocabulary") duplicateVocabularyTest(item.id);
    if (item.kind === "grammar") duplicateGrammarTest(item.id);
    if (item.kind === "listening") duplicateListeningExercise(item.id);
    if (item.kind === "reading") duplicateReadingExercise(item.id);
    pushToast("Đã nhân bản.");
  }

  function handleDelete(item: ExerciseSummary) {
    if (item.kind === "vocabulary") deleteVocabularyTest(item.id);
    if (item.kind === "grammar") deleteGrammarTest(item.id);
    if (item.kind === "listening") deleteListeningExercise(item.id);
    if (item.kind === "reading") deleteReadingExercise(item.id);
    pushToast("Đã xoá.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-end gap-2 mb-5">
        <button className="btn-secondary" onClick={() => handleCreate("vocabulary")}>
          <Plus size={15} /> Vocabulary Test
        </button>
        <button className="btn-secondary" onClick={() => handleCreate("grammar")}>
          <Plus size={15} /> Grammar Test
        </button>
        <button className="btn-secondary" onClick={() => handleCreate("listening")}>
          <Plus size={15} /> Listening Exercise
        </button>
        <button className="btn-secondary" onClick={() => handleCreate("reading")}>
          <Plus size={15} /> Reading Exercise
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            className="field-input pl-8"
            placeholder="Tìm theo tên bài..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="field-input w-auto"
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as ExerciseKind | "all")}
        >
          <option value="all">Tất cả loại</option>
          {(Object.keys(EXERCISE_KIND_LABELS) as ExerciseKind[]).map((k) => (
            <option key={k} value={k}>
              {EXERCISE_KIND_LABELS[k]}
            </option>
          ))}
        </select>
        <select
          className="field-input w-auto"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as Level | "all")}
        >
          <option value="all">Tất cả trình độ</option>
          {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
            <option key={l} value={l}>
              {LEVEL_LABELS[l]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-ink/50 text-sm">Không có bài tập nào phù hợp.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left text-xs font-semibold text-ink/45">
                <th className="px-4 py-3">TÊN BÀI</th>
                <th className="px-4 py-3">LOẠI</th>
                <th className="px-4 py-3">TRÌNH ĐỘ</th>
                <th className="px-4 py-3">SỐ CÂU</th>
                <th className="px-4 py-3 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={`${item.kind}-${item.id}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-navy bg-navy-50 px-2 py-1 rounded-full">
                      {EXERCISE_KIND_LABELS[item.kind]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{item.level ? LEVEL_LABELS[item.level] : "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{item.questionCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        className="text-ink/40 hover:text-navy p-1.5"
                        title="Xem trước"
                        onClick={() => setPreviewing(item)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="text-ink/40 hover:text-navy p-1.5"
                        title="Sửa"
                        onClick={() => navigate(`${EDIT_PATH[item.kind]}/${item.id}`)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="text-ink/40 hover:text-navy p-1.5"
                        title="Nhân bản"
                        onClick={() => handleDuplicate(item)}
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        className="text-ink/40 hover:text-red-600 p-1.5"
                        title="Xoá"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {previewing && <PreviewExerciseModal item={previewing} onClose={() => setPreviewing(null)} />}
    </div>
  );
}
