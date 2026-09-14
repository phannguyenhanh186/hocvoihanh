import { useRef, useState } from "react";
import { Megaphone, ImagePlus, X } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import { fileToDataUrl } from "../../content/ImageUploader";

export default function DiscussionTab({ classId }: { classId: string }) {
  const messages = useAppStore((s) => s.messages.filter((m) => m.classId === classId));
  const addMessage = useAppStore((s) => s.addMessage);
  const deleteMessage = useAppStore((s) => s.deleteMessage);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleAttach(file: File | null | undefined) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setImage(dataUrl);
  }

  function handleSend() {
    if (!content.trim() && !image) return;
    addMessage(classId, content.trim(), "teacher", "Giáo viên", image);
    setContent("");
    setImage(undefined);
  }

  return (
    <div>
      <p className="text-sm text-ink/50 mb-4">
        Tin bạn gửi hiện thành <span className="font-medium text-ink/70">thông báo</span> nổi bật với cả lớp; học viên
        hỏi đáp ngay bên dưới. Đính được ảnh — ảnh tự nén nhỏ trước khi gửi.
      </p>

      <div className="space-y-3 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-md border text-sm ${
              m.authorType === "teacher"
                ? "border-navy/30 bg-navy-50"
                : "border-line bg-white"
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-ink/50 mb-1.5">
              {m.authorType === "teacher" && <Megaphone size={13} className="text-navy" />}
              <span className={m.authorType === "teacher" ? "font-medium text-navy" : "font-medium text-ink/80"}>
                {m.authorName}
              </span>
              <span>
                ·{" "}
                {new Date(m.createdAt).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </span>
              <button
                className="text-ink/40 hover:text-red-600 ml-auto"
                onClick={() => deleteMessage(m.id)}
              >
                xoá
              </button>
            </div>
            <p className="text-ink/90 whitespace-pre-wrap">{m.content}</p>
            {m.image && (
              <img src={m.image} alt="" className="mt-2 max-h-48 rounded-md border border-line" />
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-ink/40 text-center py-8">Chưa có trao đổi nào trong lớp này.</p>
        )}
      </div>

      {image && (
        <div className="relative w-fit mb-2">
          <img src={image} alt="" className="max-h-24 rounded-md border border-line" />
          <button
            className="absolute -top-2 -right-2 bg-white border border-line rounded-full p-0.5 text-ink/50 hover:text-red-600"
            onClick={() => setImage(undefined)}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          className="field-input flex-1"
          placeholder="Viết thông báo hoặc trả lời học viên..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn-secondary shrink-0" onClick={() => inputRef.current?.click()}>
          <ImagePlus size={15} /> Ảnh
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleAttach(e.target.files?.[0])}
        />
        <button className="btn-primary shrink-0" onClick={handleSend}>
          Gửi
        </button>
      </div>
    </div>
  );
}
