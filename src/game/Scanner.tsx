import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import jsQR from "jsqr";
import { Button } from "../components/Button";

interface ScannerProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

type CamState = "starting" | "scanning" | "denied" | "error";

// Camera-based QR scanning in-browser. getUserMedia + a per-frame jsQR decode.
// No external scanner UI library — keeps the tree lean (CLAUDE.md).
export function Scanner({ onResult, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const firedRef = useRef(false);
  const [state, setState] = useState<CamState>("starting");

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-ink/95"
    >
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            {state === "starting" && (
              <p className="font-display text-2xl text-paper">Opening camera…</p>
            )}
            {state === "denied" && (
              <>
                <p className="font-display text-2xl text-paper">
                  Camera permission needed
                </p>
                <p className="max-w-xs font-body text-sm text-paper/80">
                  Allow camera access in your browser settings, then tap Scan
                  again to collect this stamp.
                </p>
              </>
            )}
            {state === "error" && (
              <p className="max-w-xs font-display text-xl text-paper">
                Couldn’t start the camera on this device.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="pb-safe flex items-center justify-center gap-3 bg-ink px-5 py-4">
        <p className="flex-1 font-body text-sm text-paper/80">
          Point at an Illuspeak stamp QR code.
        </p>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </motion.div>
  );
}
