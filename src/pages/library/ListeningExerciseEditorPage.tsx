import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Question } from "../../types";
import QuestionListEditor from "../../components/content/QuestionListEditor";
import AudioPicker from "../../components/library/AudioPicker";

const ALLOWED = ["multiple_choice", "short_answer"] as const;

export default function ListeningExerciseEditorPage() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const exercise = useAppStore((s) => s.listeningExercises.find((e) => e.id === exerciseId));
  const listeningMaterials = useAppStore((s) => s.listeningMaterials);
  const saveListeningExercise = useAppStore((s) => s.saveListeningExercise);
  const updateListeningMaterial = useAppStore((s) => s.updateListeningMaterial);
  const pushToast = useAppStore((s) => s.pushToast);

  const [title, setTitle] = useState(exercise?.title ?? "");
  const [materialId, setMaterialId] = useState(exercise?.materialId ?? "");
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

  const material = listeningMaterials.find((m) => m.id === materialId);

  function handleSave() {
    setShowValidation(true);
    if (!materialId) {
      pushToast("Chọn Listening Material trước khi lưu.");
      return;
    }
    saveListeningExercise(exercise!.id, questions, title.trim() || "Listening Exercise chưa đặt tên");
    useAppStore.setState((state) => ({
      listeningExercises: state.listeningExercises.map((e) =>
        e.id === exercise!.id ? { ...e, materialId } : e
      ),
    }));
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
        <label className="field-label">Listening Material</label>
        <select
          className="field-input mb-3"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
        >
          <option value="">— Chọn bài nghe —</option>
          {listeningMaterials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        {material?.audioId && (
          <AudioPicker
            audioId={material.audioId}
            onChange={(id) => updateListeningMaterial(material.id, { audioId: id })}
          />
        )}
        {listeningMaterials.length === 0 && (
          <p className="text-xs text-ink/45">
            Chưa có Listening Material nào — tạo trong Learning Materials trước.
          </p>
        )}
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
