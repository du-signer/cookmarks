import { useEffect, useState } from "react";

const DURATION = 3500; // keep in sync with the cm-splash keyframes in index.css
const FONT_WAIT_TIMEOUT = 400; // don't stall the splash on a slow connection

export function Splash({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);
  // Waiting for Fraunces avoids a font-swap reflow partway through the
  // blur/scale animation — most noticeable on slower mobile connections,
  // where the fallback serif would otherwise render first and visibly
  // jump to Fraunces mid-animation.
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fallback = setTimeout(() => {
      if (!cancelled) setFontReady(true);
    }, FONT_WAIT_TIMEOUT);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts
        .load("52px Fraunces")
        .catch(() => {})
        .finally(() => {
          if (!cancelled) {
            clearTimeout(fallback);
            setFontReady(true);
          }
        });
    }

    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!fontReady) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      setGone(true);
      onDone();
    }, reduced ? 900 : DURATION);
    return () => clearTimeout(t);
  }, [fontReady, onDone]);

  if (gone) return null;

  // Plain paper cover while we wait — avoids a flash of the app underneath
  // and keeps this invisible on fast connections (font is ready in ~0ms).
  if (!fontReady) return <div className="fixed inset-0 z-50 bg-paper" />;

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
