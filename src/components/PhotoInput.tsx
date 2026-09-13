import { useRef } from "react";

interface PhotoInputProps {
  onSelect: (file: File) => void;
  className?: string;
}

export function PhotoInput({ onSelect, className = "" }: PhotoInputProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onSelect(file);
    event.target.value = "";
  }

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      <button
        type="button"
        onClick={() => cameraInputRef.current?.click()}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-medium text-paper shadow-soft transition active:scale-[0.98]"
      >
        <CameraIcon />
        Take a photo
      </button>
      <button
        type="button"
        onClick={() => uploadInputRef.current?.click()}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-paper px-5 py-4 text-sm font-medium text-ink transition active:scale-[0.98]"
      >
        <UploadIcon />
        Upload a photo
      </button>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 16V4M12 4 8 8M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round" />
    </svg>
  );
}
