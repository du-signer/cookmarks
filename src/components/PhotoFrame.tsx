import { useRef } from "react";

interface PhotoFrameProps {
  src: string;
  alt: string;
  onReplace: (file: File) => void;
  onDelete: () => void;
  deleteLabel?: string;
}

export function PhotoFrame({ src, alt, onReplace, onDelete, deleteLabel = "Delete photo" }: PhotoFrameProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-paper-dim">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onReplace(file);
          event.target.value = "";
        }}
      />
      <div className="absolute right-2.5 top-2.5 flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Replace photo"
          title="Replace photo"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow-soft backdrop-blur transition active:scale-90"
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={deleteLabel}
          title={deleteLabel}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-coral shadow-soft backdrop-blur transition active:scale-90"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m16.5 3.5 4 4L8 20l-4.5 1L4.5 16.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
