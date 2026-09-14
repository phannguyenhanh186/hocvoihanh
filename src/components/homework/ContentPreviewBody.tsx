import { useAppStore } from "../../store/useAppStore";
import { ContentPreviewData } from "../../lib/contentPreview";
import { VOCAB_QUESTION_TYPE_LABELS } from "../../types";

function AudioBlock({ audioId }: { audioId?: string }) {
  const asset = useAppStore((s) => (audioId ? s.audioAssets.find((a) => a.id === audioId) : undefined));
  if (!asset) return null;
  return (
    <div className="mb-3 flex items-center gap-2 text-sm bg-paper rounded-md px-3 py-2">
      <span className="text-ink/60 shrink-0">🔊 {asset.name}</span>
      <audio controls src={asset.dataUrl} className="h-8 flex-1" />
    </div>
  );
}

export default function ContentPreviewBody({ data }: { data: ContentPreviewData }) {
  if (data.kind === "flashcard") {
    if (!data.cards || data.cards.length === 0) {
      return <p className="text-sm text-ink/45">Chưa có thẻ từ nào.</p>;
    }
    return (
      <div>
        {data.cards.map((c, i) => (
          <div key={c.id} className="text-sm py-2 border-b border-line last:border-0 flex items-baseline gap-2">
            <span className="font-medium">{i + 1}.</span>
            <span className="font-medium">{c.word || <em className="text-ink/40">(chưa có từ)</em>}</span>
            <span className="text-ink/50">— {c.meaning || <em className="text-ink/40">(chưa có nghĩa)</em>}</span>
          </div>
        ))}
      </div>
    );
  }

  if (data.kind === "vocabulary") {
    if (!data.vocabQuestions || data.vocabQuestions.length === 0) {
      return (
        <div>
          <AudioBlock audioId={data.audioId} />
          <p className="text-sm text-ink/45">Chưa có câu hỏi nào.</p>
        </div>
      );
    }
    return (
      <div>
        <AudioBlock audioId={data.audioId} />
        {data.vocabQuestions.map((q, i) => (
          <div key={q.id} className="text-sm py-2 border-b border-line last:border-0">
            <span className="font-medium">
              Câu {i + 1} ({VOCAB_QUESTION_TYPE_LABELS[q.type]}).
            </span>{" "}
            {q.prompt}
            {q.choices && <span className="text-ink/50"> — {q.choices.join(" / ")}</span>}
          </div>
        ))}
      </div>
    );
  }

  // grammar / listening / reading — all share the Question[] shape
  return (
    <div>
      {(data.kind === "listening" || data.kind === "reading") && (data.materialTitle || data.transcript || data.materialText || data.audioId) && (
        <div className="mb-3 pb-3 border-b border-line">
          {data.materialTitle && <p className="text-sm font-medium mb-2">{data.materialTitle}</p>}
          <AudioBlock audioId={data.audioId} />
          {data.transcript && <p className="text-xs text-ink/50 mt-1 whitespace-pre-wrap">{data.transcript}</p>}
          {data.materialText && <p className="text-xs text-ink/50 mt-1 whitespace-pre-wrap">{data.materialText}</p>}
        </div>
      )}
      {!data.questions || data.questions.length === 0 ? (
        <p className="text-sm text-ink/45">Chưa có câu hỏi nào.</p>
      ) : (
        data.questions.map((q, i) => (
          <div key={q.id} className="text-sm py-2 border-b border-line last:border-0">
            <span className="font-medium">Câu {i + 1}.</span>{" "}
            {q.content || <em className="text-ink/40">(chưa có nội dung)</em>}
          </div>
        ))
      )}
    </div>
  );
}
