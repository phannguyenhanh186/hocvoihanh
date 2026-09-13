import { useNavigate } from "react-router-dom";
import { Plus, Layers, Headphones, BookOpen } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function LibraryMaterialsPage() {
  const flashcardSets = useAppStore((s) => s.flashcardSets);
  const listeningMaterials = useAppStore((s) => s.listeningMaterials);
  const readingMaterials = useAppStore((s) => s.readingMaterials);
  const createFlashcardSet = useAppStore((s) => s.createFlashcardSet);
  const createListeningMaterial = useAppStore((s) => s.createListeningMaterial);
  const createReadingMaterial = useAppStore((s) => s.createReadingMaterial);
  const navigate = useNavigate();

  function newFlashcardSet() {
    const set_ = createFlashcardSet("Bộ flashcard chưa đặt tên");
    navigate(`/teacher/library/materials/flashcards/${set_.id}`);
  }
  function newListening() {
    const m = createListeningMaterial("Bài nghe chưa đặt tên");
    navigate(`/teacher/library/materials/listening/${m.id}`);
  }
  function newReading() {
    const m = createReadingMaterial("Bài đọc chưa đặt tên");
    navigate(`/teacher/library/materials/reading/${m.id}`);
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Layers size={18} className="text-navy" /> Flashcard Sets
          </h2>
          <button className="btn-secondary" onClick={newFlashcardSet}>
            <Plus size={15} /> Tạo Flashcard Set
          </button>
        </div>
        {flashcardSets.length === 0 ? (
          <div className="card p-6 text-center text-ink/45 text-sm">Chưa có bộ flashcard nào.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {flashcardSets.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/teacher/library/materials/flashcards/${s.id}`)}
                className="card p-4 text-left hover:border-navy transition-colors"
              >
                <h3 className="font-medium text-sm">{s.title}</h3>
                <p className="text-xs text-ink/45 mt-1">{s.cards.length} flashcard</p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Headphones size={18} className="text-navy" /> Listening Materials
          </h2>
          <button className="btn-secondary" onClick={newListening}>
            <Plus size={15} /> Tạo Listening Material
          </button>
        </div>
        {listeningMaterials.length === 0 ? (
          <div className="card p-6 text-center text-ink/45 text-sm">Chưa có bài nghe nào.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {listeningMaterials.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/teacher/library/materials/listening/${m.id}`)}
                className="card p-4 text-left hover:border-navy transition-colors"
              >
                <h3 className="font-medium text-sm">{m.title}</h3>
                <p className="text-xs text-ink/45 mt-1">{m.audioId ? "Có audio" : "Chưa có audio"}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <BookOpen size={18} className="text-navy" /> Reading Materials
          </h2>
          <button className="btn-secondary" onClick={newReading}>
            <Plus size={15} /> Tạo Reading Material
          </button>
        </div>
        {readingMaterials.length === 0 ? (
          <div className="card p-6 text-center text-ink/45 text-sm">Chưa có bài đọc nào.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {readingMaterials.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/teacher/library/materials/reading/${m.id}`)}
                className="card p-4 text-left hover:border-navy transition-colors"
              >
                <h3 className="font-medium text-sm">{m.title}</h3>
                <p className="text-xs text-ink/45 mt-1 truncate">{m.text ? m.text.slice(0, 40) : "Chưa có nội dung"}</p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
