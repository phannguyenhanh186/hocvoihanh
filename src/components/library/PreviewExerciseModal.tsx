import Modal from "../ui/Modal";
import { useAppStore } from "../../store/useAppStore";
import { ExerciseSummary, VOCAB_QUESTION_TYPE_LABELS } from "../../types";

export default function PreviewExerciseModal({ item, onClose }: { item: ExerciseSummary; onClose: () => void }) {
  const grammarTests = useAppStore((s) => s.grammarTests);
  const listeningExercises = useAppStore((s) => s.listeningExercises);
  const readingExercises = useAppStore((s) => s.readingExercises);
  const vocabularyTests = useAppStore((s) => s.vocabularyTests);

  let body: React.ReactNode = null;

  if (item.kind === "grammar") {
    const t = grammarTests.find((x) => x.id === item.id);
    body = t?.questions.map((q, i) => (
      <div key={q.id} className="text-sm py-2 border-b border-line last:border-0">
        <span className="font-medium">Câu {i + 1}.</span> {q.content || <em className="text-ink/40">(chưa có nội dung)</em>}
      </div>
    ));
  } else if (item.kind === "listening" || item.kind === "reading") {
    const list = item.kind === "listening" ? listeningExercises : readingExercises;
    const t = list.find((x) => x.id === item.id);
    body = t?.questions.map((q, i) => (
      <div key={q.id} className="text-sm py-2 border-b border-line last:border-0">
        <span className="font-medium">Câu {i + 1}.</span> {q.content || <em className="text-ink/40">(chưa có nội dung)</em>}
      </div>
    ));
  } else if (item.kind === "vocabulary") {
    const t = vocabularyTests.find((x) => x.id === item.id);
    body = t?.questions.map((q, i) => (
      <div key={q.id} className="text-sm py-2 border-b border-line last:border-0">
        <span className="font-medium">
          Câu {i + 1} ({VOCAB_QUESTION_TYPE_LABELS[q.type]}).
        </span>{" "}
        {q.prompt}
        {q.choices && (
          <span className="text-ink/50"> — {q.choices.join(" / ")}</span>
        )}
      </div>
    ));
  }

  return (
    <Modal title={`Xem trước — ${item.title}`} onClose={onClose} maxWidth="max-w-lg" footer={
      <button className="btn-primary" onClick={onClose}>Đóng</button>
    }>
      {item.questionCount === 0 ? (
        <p className="text-sm text-ink/45">Chưa có câu hỏi nào.</p>
      ) : (
        <div>{body}</div>
      )}
    </Modal>
  );
}
