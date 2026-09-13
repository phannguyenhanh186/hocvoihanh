import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import AudioPicker from "../../components/library/AudioPicker";

export default function ReadingMaterialEditorPage() {
  const { materialId } = useParams();
  const navigate = useNavigate();

  const material = useAppStore((s) => s.readingMaterials.find((m) => m.id === materialId));
  const updateReadingMaterial = useAppStore((s) => s.updateReadingMaterial);

  if (!material) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy bài đọc. Quay lại{" "}
        <button className="text-navy underline" onClick={() => navigate("/teacher/library/materials")}>
          Learning Materials
        </button>
        .
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors mb-6"
        onClick={() => navigate("/teacher/library/materials")}
      >
        <ArrowLeft size={16} /> Learning Materials
      </button>

      <div className="card p-6 space-y-5">
        <div>
          <label className="field-label">Title</label>
          <input
            className="field-input"
            value={material.title}
            onChange={(e) => updateReadingMaterial(material.id, { title: e.target.value })}
            placeholder="Ví dụ: My Daily Routine"
          />
        </div>

        <div>
          <label className="field-label">Text</label>
          <textarea
            className="field-textarea min-h-[200px]"
            placeholder="Nội dung bài đọc..."
            value={material.text}
            onChange={(e) => updateReadingMaterial(material.id, { text: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label">
            Audio <span className="font-normal text-ink/40">(không bắt buộc)</span>
          </label>
          <AudioPicker
            audioId={material.audioId}
            onChange={(id) => updateReadingMaterial(material.id, { audioId: id })}
          />
        </div>
      </div>
    </div>
  );
}
