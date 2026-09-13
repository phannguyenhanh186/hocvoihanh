import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import AudioPicker from "../../components/library/AudioPicker";

export default function ListeningMaterialEditorPage() {
  const { materialId } = useParams();
  const navigate = useNavigate();

  const material = useAppStore((s) => s.listeningMaterials.find((m) => m.id === materialId));
  const updateListeningMaterial = useAppStore((s) => s.updateListeningMaterial);

  if (!material) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy bài nghe. Quay lại{" "}
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
            onChange={(e) => updateListeningMaterial(material.id, { title: e.target.value })}
            placeholder="Ví dụ: At the café"
          />
        </div>

        <div>
          <label className="field-label">MP3</label>
          <AudioPicker
            audioId={material.audioId}
            onChange={(id) => updateListeningMaterial(material.id, { audioId: id })}
          />
        </div>

        <div>
          <label className="field-label">
            Transcript <span className="font-normal text-ink/40">(không bắt buộc)</span>
          </label>
          <textarea
            className="field-textarea min-h-[140px]"
            placeholder="Nội dung transcript của bài nghe..."
            value={material.transcript ?? ""}
            onChange={(e) => updateListeningMaterial(material.id, { transcript: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
