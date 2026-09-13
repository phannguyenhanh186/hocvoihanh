import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Question } from "../../types";
import QuestionListEditor from "../../components/content/QuestionListEditor";
import AudioPicker from "../../components/library/AudioPicker";

// Listening exercises are always multiple choice ("dạng trắc nghiệm").
const ALLOWED = ["multiple_choice"] as const;

export default function ListeningExerciseEditorPage() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const exercise = useAppStore((s) => s.listeningExercises.find((e) => e.id === exerciseId));
  const material = useAppStore((s) => s.listeningMaterials.find((m) => m.id === exercise?.materialId));
  const saveListeningExercise = useAppStore((s) => s.saveListeningExercise);
  const updateListeningMaterial = useAppStore((s) => s.updateListeningMaterial);
  const pushToast = useAppStore((s) => s.pushToast);

  const [title, setTitle] = useState(exercise?.title ?? "");
  const [audioId, setAudioId] = useState(material?.audioId);
  const [questions, setQuestions] = useState<Question[]>(exercise?.questions ?? []);
  const [showValidation, setShowValidation] = useState(false);

  if (!exercise) {
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
    if (!audioId) {
      pushToast("Tải file MP3 lên trước khi lưu.");
      return;
    }
    saveListeningExercise(exercise!.id, questions, title.trim() || "Listening Exercise chưa đặt tên");
    updateListeningMaterial(exercise!.materialId, { audioId, title: title.trim() || "Audio bài nghe" });
    pushToast("Đã lưu Listening Exercise.");
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

      <input
        className="text-2xl font-bold font-display bg-transparent border-none outline-none w-full mb-4 px-0"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tên bài (Listening Exercise)"
      />

      <div className="card p-5 mb-6">
        <label className="field-label">File MP3</label>
        <p className="text-xs text-ink/45 mb-2">
          Tải lên file nghe cho bài này. Học viên sẽ nghe file này rồi trả lời các câu trắc nghiệm bên dưới.
        </p>
        <AudioPicker audioId={audioId} onChange={setAudioId} />
        {showValidation && !audioId && <p className="text-xs text-red-600 mt-2">Cần có file MP3.</p>}
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
