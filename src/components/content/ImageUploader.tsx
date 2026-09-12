import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

interface Props {
  image?: string;
  onChange: (dataUrl: string | undefined) => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ image, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | null | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await fileToDataUrl(file);
    onChange(dataUrl);
  }

  if (image) {
    return (
      <div className="relative w-fit">
        <img
          src={image}
          alt="Ảnh câu hỏi"
          className="max-h-40 rounded-md border border-line"
        />
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="btn-secondary text-xs py-1.5 px-2.5"
            onClick={() => inputRef.current?.click()}
          >
            Thay ảnh
          </button>
          <button
            type="button"
            className="btn-ghost text-xs py-1.5 px-2.5 text-red-600"
            onClick={() => onChange(undefined)}
          >
            <X size={14} /> Xóa ảnh
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="btn-secondary text-sm"
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlus size={16} /> Thêm ảnh
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

export { fileToDataUrl };
