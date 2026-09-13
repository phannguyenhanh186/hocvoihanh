import { useRef, useState } from "react";
import { Play, Pause, Upload, X, Library } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface Props {
  audioId?: string;
  onChange: (audioId: string | undefined) => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AudioPicker({ audioId, onChange }: Props) {
  const audioAssets = useAppStore((s) => s.audioAssets);
  const addAudioAsset = useAppStore((s) => s.addAudioAsset);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioElRef = useRef<HTMLAudioElement>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [playing, setPlaying] = useState(false);

  const selected = audioAssets.find((a) => a.id === audioId);

  async function handleUpload(file: File | null | undefined) {
    if (!file || !file.type.startsWith("audio/")) return;
    const dataUrl = await fileToDataUrl(file);
    const asset = addAudioAsset(file.name, dataUrl);
    onChange(asset.id);
  }

  function togglePlay() {
    if (!audioElRef.current) return;
    if (playing) {
      audioElRef.current.pause();
    } else {
      audioElRef.current.play();
    }
  }

  if (selected) {
    return (
      <div className="flex items-center gap-2 border border-line rounded-md px-3 py-2 bg-white">
        <button type="button" onClick={togglePlay} className="text-navy shrink-0">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <span className="text-sm text-ink/70 truncate flex-1">{selected.name}</span>
        <audio
          ref={audioElRef}
          src={selected.dataUrl}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="text-ink/30 hover:text-red-600 shrink-0"
          aria-label="Xóa audio"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <button type="button" className="btn-secondary text-sm" onClick={() => inputRef.current?.click()}>
          <Upload size={14} /> Tải MP3 lên
        </button>
        {audioAssets.length > 0 && (
          <button
            type="button"
            className="btn-ghost text-sm"
            onClick={() => setShowLibrary((v) => !v)}
          >
            <Library size={14} /> Chọn từ thư viện ({audioAssets.length})
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp3,audio/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files?.[0])}
      />
      {showLibrary && (
        <div className="mt-2 border border-line rounded-md max-h-40 overflow-y-auto">
          {audioAssets.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                onChange(a.id);
                setShowLibrary(false);
              }}
              className="w-full text-left text-sm px-3 py-2 hover:bg-paper border-b border-line last:border-0 truncate"
            >
              {a.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
