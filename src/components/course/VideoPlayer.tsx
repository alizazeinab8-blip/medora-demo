"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Maximize, Pause, Play, Settings, Volume2 } from "lucide-react";
import { cn, fa } from "@/lib/format";

function parseDuration(d: string): number {
  // "۱۲:۴۰" or "12:40" → seconds
  const latin = d.replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)));
  const [m, s] = latin.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return fa(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
}

/**
 * Video player placeholder.
 * PRODUCTION: HLS/DASH stream from a video platform with signed, expiring URLs,
 * per-user watermarking and DRM where required. Nothing is streamed in the demo.
 */
export function VideoPlayer({
  title,
  duration,
  locked = false,
  buyHref,
  onEnded,
  className,
}: {
  title: string;
  duration: string;
  locked?: boolean;
  buyHref?: string;
  onEnded?: () => void;
  className?: string;
}) {
  const total = parseDuration(duration) || 600;
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    setPlaying(false);
    setPos(0);
  }, [title]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      // Simulated playback runs 20x speed so the demo progresses visibly.
      setPos((p) => Math.min(total, p + 20));
    }, 1000);
    return () => clearInterval(t);
  }, [playing, total]);

  useEffect(() => {
    if (playing && pos >= total) {
      setPlaying(false);
      onEnded?.();
    }
  }, [playing, pos, total, onEnded]);

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-2xl bg-navy-950 text-white", className)}>
      {/* Faux frame */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="vp-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#1f57e0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0a1324" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="640" height="360" fill="url(#vp-glow)" />
        <path d="M0 200 H200 L225 160 L250 240 L280 90 L310 280 L335 200 H640" fill="none" stroke="#46b9ac" strokeWidth="3" />
      </svg>

      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-3 pl-24 sm:p-4 sm:pl-28">
        <p className="line-clamp-1 text-xs font-medium sm:text-sm">{title}</p>
      </div>

      {locked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-950/70 px-6 text-center backdrop-blur-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Lock className="h-6 w-6" aria-hidden />
          </span>
          <p className="text-sm font-semibold leading-7">برای دسترسی به این جلسه، ابتدا دوره را تهیه کنید.</p>
          {buyHref && (
            <Link href={buyHref} className="btn bg-white text-navy-900 hover:bg-brand-50">
              تهیه دوره
            </Link>
          )}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => (pos >= total ? (setPos(0), setPlaying(true)) : setPlaying((p) => !p))}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={playing ? "توقف" : "پخش (نمایشی)"}
          >
            {!playing && (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow-lift transition-transform hover:scale-105">
                <Play className="h-7 w-7 -scale-x-100 translate-x-[-2px] fill-current" aria-hidden />
              </span>
            )}
          </button>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 sm:px-4">
            <div className="ltr flex items-center gap-3 text-[11px]">
              <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "توقف" : "پخش"} className="shrink-0">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <span className="shrink-0 tabular-nums">{fmt(pos)}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                <div className="h-full bg-teal-400 transition-all" style={{ width: `${(pos / total) * 100}%` }} />
              </div>
              <span className="shrink-0 tabular-nums">{fmt(total)}</span>
              <Volume2 className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden />
              <Settings className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden />
              <Maximize className="h-4 w-4 shrink-0" aria-hidden />
            </div>
          </div>
          <span className="absolute left-3 top-3 rounded bg-white/10 px-2 py-0.5 text-[10px] sm:left-4 sm:top-4">پخش نمایشی</span>
        </>
      )}
    </div>
  );
}
