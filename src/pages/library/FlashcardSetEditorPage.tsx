import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import AudioPicker from "../../components/library/AudioPicker";

export default function FlashcardSetEditorPage() {
  const { setId } = useParams();
  const navigate = useNavigate();

  const set_ = useAppStore((s) => s.flashcardSets.find((fs) => fs.id === setId));
  const updateFlashcardSet = useAppStore((s) => s.updateFlashcardSet);
  const addFlashcard = useAppStore((s) => s.addFlashcard);
  const updateFlashcard = useAppStore((s) => s.updateFlashcard);
  const deleteFlashcard = useAppStore((s) => s.deleteFlashcard);
  const pushToast = useAppStore((s) => s.pushToast);

  if (!set_) {
    return (
      <div className="card p-10 text-center text-ink/50 text-sm">
        Không tìm thấy bộ flashcard. Quay lại{" "}
        <button className="text-navy underline" onClick={() => navigate("/teacher/library/materials")}>
          Learning Materials
        </button>
        .
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button
        className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors mb-6"
        onClick={() => navigate("/teacher/library/materials")}
      >
        <ArrowLeft size={16} /> Learning Materials
      </button>

      <input
        className="text-2xl font-bold font-display bg-transparent border-none outline-none w-full mb-1 focus:ring-0 px-0"
        value={set_.title}
        onChange={(e) => updateFlashcardSet(set_.id, e.target.value)}
        placeholder="Tên bộ flashcard"
      />
      <p className="text-sm text-ink/50 mb-6">{set_.cards.length} flashcard</p>

      <div className="space-y-4">
        {set_.cards.map((card, idx) => (
          <div key={card.id} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-ink/60">Flashcard {idx + 1}</h3>
              <button
                className="text-ink/30 hover:text-red-600 p-1"
                onClick={() => {
                  deleteFlashcard(set_.id, card.id);
                  pushToast("Đã xoá flashcard.");
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="field-label">Word / Phrase</label>
                <input
                  className="field-input"
                  placeholder="apple"
                  value={card.word}
                  onChange={(e) => updateFlashcard(set_.id, card.id, { word: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Meaning</label>
                <input
                  className="field-input"
                  placeholder="quả táo"
                  value={card.meaning}
                  onChange={(e) => updateFlashcard(set_.id, card.id, { meaning: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="field-label">Word Audio (MP3)</label>
              <AudioPicker
                audioId={card.wordAudioId}
                onChange={(id) => updateFlashcard(set_.id, card.id, { wordAudioId: id })}
              />
            </div>

            <div className="mb-4">
              <label className="field-label">Example</label>
              <input
                className="field-input"
                placeholder="I eat an apple every morning."
                value={card.example ?? ""}
                onChange={(e) => updateFlashcard(set_.id, card.id, { example: e.target.value })}
              />
            </div>

            <div>
              <label className="field-label">Example Audio (MP3)</label>
              <AudioPicker
                audioId={card.exampleAudioId}
                onChange={(id) => updateFlashcard(set_.id, card.id, { exampleAudioId: id })}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn-secondary mt-5 w-full justify-center py-3"
        onClick={() => addFlashcard(set_.id)}
      >
        <Plus size={16} /> Thêm flashcard
      </button>
    </div>
  );
}
