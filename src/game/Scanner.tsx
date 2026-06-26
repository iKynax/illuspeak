import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import jsQR from "jsqr";
import { useUI } from "../i18n/lang";

interface ScannerProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

type CamState = "starting" | "scanning" | "denied" | "error";

// Camera-based QR scanning in-browser. getUserMedia + a per-frame jsQR decode.
// No external scanner UI library — keeps the tree lean (CLAUDE.md).
// Rendered via portal so it escapes the `isolate` stacking context in App.tsx
// and always layers above the BottomTabBar + PlayButton.
export function Scanner({ onResult, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const firedRef = useRef(false);
  const [state, setState] = useState<CamState>("starting");
  const ui = useUI();

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setState("scanning");
        tick();
      } catch (err) {
        if (cancelled) return;
        const denied =
          err instanceof DOMException &&
          (err.name === "NotAllowedError" || err.name === "SecurityError");
        setState(denied ? "denied" : "error");
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || firedRef.current) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const w = video.videoWidth;
        const h = video.videoHeight;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const img = ctx.getImageData(0, 0, w, h);
          const code = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
          if (code && code.data) {
            firedRef.current = true;
            onResult(code.data);
            return;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col bg-ink/95"
    >
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Close button — top-right, same spot as the game PlayButton.
            z-20 keeps it tappable ABOVE the status overlay (which is now
            pointer-events-none) so the user can always exit, even when camera
            permission was denied. */}
        <motion.button
          type="button"
          onClick={onClose}
          aria-label="Close camera"
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-paper/30 bg-ink/60 text-paper backdrop-blur-sm"
          style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>

        {/* Reticle */}
        {state === "scanning" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-56 w-56 rounded-3xl border-4 border-cyan"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}

        {(state === "starting" || state === "denied" || state === "error") && (
          // pointer-events-none so this full-screen status layer never swallows
          // taps meant for the close button (was the "can't exit when denied" bug).
          // The Go-back button re-enables pointer events on itself.
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            {state === "starting" && (
              <p className="font-display text-2xl text-paper">{ui.scanner.opening}</p>
            )}
            {state === "denied" && (
              <>
                <p className="font-display text-2xl text-paper">
                  {ui.scanner.deniedTitle}
                </p>
                <p className="max-w-xs font-body text-sm text-paper/80">
                  {ui.scanner.deniedBody}
                </p>
              </>
            )}
            {state === "error" && (
              <p className="max-w-xs font-display text-xl text-paper">
                {ui.scanner.error}
              </p>
            )}
            {(state === "denied" || state === "error") && (
              <button
                type="button"
                onClick={onClose}
                className="pointer-events-auto ink-outline mt-2 rounded-full bg-paper px-6 py-2.5 font-display text-lg text-ink"
              >
                {ui.scanner.goBack}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom helper text */}
      <div className="pb-safe flex items-center justify-center bg-ink px-5 py-4">
        <p className="font-body text-sm text-paper/80">{ui.scanner.aim}</p>
      </div>
    </motion.div>,
    document.body,
  );
}
