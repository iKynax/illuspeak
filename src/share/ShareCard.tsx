import { forwardRef } from "react";
import { gameTargets } from "../data/booths";
import { stampVisual } from "../game/stamps";
import { formatDuration } from "../lib/format";
import { eventInfo } from "../data/booths";

export interface ShareCardData {
  username: string;
  durationSeconds: number;
  rank?: number | null;
}

// The 1080x1920 Instagram-story card. Rendered off-screen at full size and
// captured to PNG via html-to-image. Composites the real key-visual identity:
// wordmark + bear + the 6 collected stamps.
export const ShareCard = forwardRef<HTMLDivElement, ShareCardData>(
  function ShareCard({ username, durationSeconds, rank }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
          background: "linear-gradient(160deg, #FFD6E8 0%, #BFE6FF 55%, #E4D6FF 100%)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: "#2A2140",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "120px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* halftone field */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(42,33,64,0.14) 3px, transparent 3.4px)",
            backgroundSize: "26px 26px",
            opacity: 0.5,
          }}
        />

        <img src="/assets/wordmark.webp" alt="" style={{ width: 720, zIndex: 1 }} />

        <p
          style={{
            zIndex: 1,
            marginTop: 8,
            fontFamily: "'Lilita One', sans-serif",
            fontSize: 46,
            transform: "rotate(-2deg)",
            background: "#FFE53D",
            border: "5px solid #2A2140",
            borderRadius: 24,
            padding: "8px 28px",
            boxShadow: "8px 8px 0 #2A2140",
          }}
        >
          RALLY COMPLETE!
        </p>

        <img
          src="/assets/mascot-bear.webp"
          alt=""
          style={{ width: 560, zIndex: 1, marginTop: 20 }}
        />

        <p
          style={{
            zIndex: 1,
            fontFamily: "'Lilita One', sans-serif",
            fontSize: 78,
            lineHeight: 1.05,
            margin: "8px 0 0",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {username}
        </p>

        {/* stamps row */}
        <div
          style={{
            zIndex: 1,
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 18,
            width: "100%",
          }}
        >
          {gameTargets.map((b) => {
            const v = stampVisual(b.id);
            return (
              <div
                key={b.id}
                style={{
                  aspectRatio: "1 / 1",
                  background: v.color,
                  border: "5px solid #2A2140",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                }}
              >
                {v.emoji}
              </div>
            );
          })}
        </div>

        {/* stats */}
        <div
          style={{
            zIndex: 1,
            marginTop: 48,
            display: "flex",
            gap: 28,
          }}
        >
          <Stat label="TIME" value={formatDuration(durationSeconds)} bg="#2BE3F2" />
          {rank != null && <Stat label="FINISHER" value={`#${rank}`} bg="#8CFF3D" />}
        </div>

        <p
          style={{
            zIndex: 1,
            marginTop: "auto",
            fontSize: 34,
            fontWeight: 700,
            opacity: 0.85,
          }}
        >
          {eventInfo.dates} · {eventInfo.venue}
        </p>
      </div>
    );
  },
);

function Stat({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div
      style={{
        background: bg,
        border: "5px solid #2A2140",
        borderRadius: 24,
        boxShadow: "8px 8px 0 #2A2140",
        padding: "18px 38px",
        textAlign: "center",
        minWidth: 220,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 2 }}>{label}</div>
      <div style={{ fontFamily: "'Lilita One', sans-serif", fontSize: 72, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
