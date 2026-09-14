import { useEffect, useState } from "react";

const DURATION = 3500; // keep in sync with the cm-splash keyframes in index.css

export function Splash({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      setGone(true);
      onDone();
    }, reduced ? 900 : DURATION);
    return () => clearTimeout(t);
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-label="Cookmarks"
      className="cm-splash fixed inset-0 z-50 flex items-center justify-center bg-paper"
    >
      <div className="cm-splash-glow absolute h-[340px] w-[340px] rounded-full" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="cm-splash-shadow absolute top-0 left-[62px] h-[190px] w-[13px] blur-[6px]" />
        <div className="cm-splash-ribbon absolute top-0 left-[62px] h-[186px] w-[42px]" />
      </div>
      <div className="cm-splash-mark relative flex flex-col items-center gap-[22px] px-9">
        <div className="font-serif text-[52px] leading-none font-normal tracking-[-0.02em] text-ink">
          Cookmarks
        </div>
        <div className="cm-splash-rule h-[1.5px] w-[128px] origin-center" />
      </div>
    </div>
  );
}
