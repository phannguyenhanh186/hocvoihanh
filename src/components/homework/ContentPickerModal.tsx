import { useMemo, useState } from "react";
import { Search, Eye, Check } from "lucide-react";
import Modal from "../ui/Modal";
import { useAppStore } from "../../store/useAppStore";
import {
  HOMEWORK_CONTENT_KIND_LABELS,
  HomeworkContentKind,
  LEVEL_LABELS,
  Level,
} from "../../types";
import { getBankItemPreview } from "../../lib/contentPreview";
import ContentPreviewBody from "./ContentPreviewBody";

interface Props {
  existingKeys: Set<string>; // `${kind}:${id}` already in the homework draft
  onAdd: (items: { kind: HomeworkContentKind; sourceId: string }[]) => void;
  onClose: () => void;
}

const KIND_ORDER: HomeworkContentKind[] = ["flashcard", "vocabulary", "grammar", "listening", "reading"];

export default function ContentPickerModal({ existingKeys, onAdd, onClose }: Props) {
  const rows = useAppStore((s) => s.bankPickerRows());
  const flashcardSets = useAppStore((s) => s.flashcardSets);
  const grammarTests = useAppStore((s) => s.grammarTests);
  const vocabularyTests = useAppStore((s) => s.vocabularyTests);
  const listeningExercises = useAppStore((s) => s.listeningExercises);
  const readingExercises = useAppStore((s) => s.readingExercises);
  const listeningMaterials = useAppStore((s) => s.listeningMaterials);
  const readingMaterials = useAppStore((s) => s.readingMaterials);

  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<HomeworkContentKind | "all">("all");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewKey, setPreviewKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (kindFilter !== "all" && r.kind !== kindFilter) return false;
      if (levelFilter !== "all" && r.level !== levelFilter) return false;
      if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [rows, kindFilter, levelFilter, query]);

  function keyOf(kind: HomeworkContentKind, id: string) {
    return `${kind}:${id}`;
  }

  function toggle(kind: HomeworkContentKind, id: string) {
    const key = keyOf(kind, id);
    if (existingKeys.has(key)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const previewRow = previewKey ? rows.find((r) => keyOf(r.kind, r.id) === previewKey) : null;
  const previewData = previewRow
    ? getBankItemPreview(
        { flashcardSets, grammarTests, vocabularyTests, listeningExercises, readingExercises, listeningMaterials, readingMaterials },
        previewRow.kind,
        previewRow.id
      )
    : null;

  function handleAdd() {
    const items = Array.from(selected).map((key) => {
      const [kind, id] = key.split(":") as [HomeworkContentKind, string];
      return { kind, sourceId: id };
    });
    onAdd(items);
    onClose();
  }

  return (
    <Modal
      title="Chọn nội dung"
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-primary" onClick={handleAdd} disabled={selected.size === 0}>
            Thêm {selected.size > 0 ? `${selected.size} ` : ""}nội dung
          </button>
        </>
      }
    >
      {previewRow && previewData ? (
        <div>
          <button className="text-sm text-navy font-medium mb-3" onClick={() => setPreviewKey(null)}>
            ← Quay lại danh sách
          </button>
          <p className="font-display font-semibold mb-2">{previewRow.title}</p>
          <ContentPreviewBody data={previewData} />
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
              <input
                className="field-input pl-8"
                placeholder="Tìm theo tên..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="field-input w-auto"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as HomeworkContentKind | "all")}
            >
              <option value="all">Tất cả loại</option>
              {KIND_ORDER.map((k) => (
                <option key={k} value={k}>
                  {HOMEWORK_CONTENT_KIND_LABELS[k]}
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
            <div className="text-center text-ink/50 text-sm py-8">Không có nội dung nào phù hợp.</div>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {filtered.map((r) => {
                const key = keyOf(r.kind, r.id);
                const already = existingKeys.has(key);
                const isSelected = selected.has(key);
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 text-sm px-3 py-2.5 rounded-md border transition-colors ${
                      already
                        ? "border-line bg-paper/60 opacity-60"
                        : isSelected
                        ? "border-navy bg-navy-50"
                        : "border-line hover:bg-paper"
                    }`}
                  >
                    <button
                      className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
                        isSelected || already ? "bg-navy border-navy text-white" : "border-line"
                      }`}
                      disabled={already}
                      onClick={() => toggle(r.kind, r.id)}
                      aria-label={already ? "Đã thêm" : isSelected ? "Bỏ chọn" : "Chọn"}
                    >
                      {(isSelected || already) && <Check size={13} />}
                    </button>
                    <button className="flex-1 text-left" onClick={() => toggle(r.kind, r.id)} disabled={already}>
                      <span className="font-medium">{r.title}</span>{" "}
                      <span className="text-xs font-medium text-navy bg-navy-50 px-1.5 py-0.5 rounded-full ml-1">
                        {HOMEWORK_CONTENT_KIND_LABELS[r.kind]}
                      </span>{" "}
                      <span className="text-ink/45 text-xs">
                        {r.level ? `· ${LEVEL_LABELS[r.level]}` : ""} · {r.count} {r.kind === "flashcard" ? "thẻ" : "câu"}
                        {already ? " · Đã thêm" : ""}
                      </span>
                    </button>
                    <button
                      className="shrink-0 text-ink/40 hover:text-navy p-1"
                      title="Xem trước"
                      onClick={() => setPreviewKey(key)}
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
