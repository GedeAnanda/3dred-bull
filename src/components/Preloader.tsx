"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setState, useStore } from "@/lib/store";
import { prefersReducedMotion, startScroll, stopScroll } from "@/lib/lenis";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef({ v: 0 });
  const warmed = useRef<gsap.core.Tween | null>(null);
  const finishing = useRef(false);
  const ready = useStore((s) => s.ready);
  const [gone, setGone] = useState(false);

  const render = () => {
    const v = Math.round(counter.current.v);
    if (count.current) count.current.textContent = String(v).padStart(3, "0");
    if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
  };

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    stopScroll();
    warmed.current = gsap.to(counter.current, { v: 86, duration: 1.4, ease: "power2.out", onUpdate: render });
    // Never trap visitors if WebGL is unavailable or slow.
    const fallback = window.setTimeout(() => setState({ ready: true }), 5000);
    return () => {
      window.clearTimeout(fallback);
      warmed.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!ready || finishing.current) return;
    finishing.current = true;
    const reduced = prefersReducedMotion();
    const done = () => {
      startScroll();
      setGone(true);
      ScrollTrigger.refresh();
    };
    const wait = warmed.current?.isActive() ? (1 - warmed.current.progress()) * 1.4 : 0;

    const tl = gsap.timeline({ delay: reduced ? 0 : wait });
    tl.to(counter.current, { v: 100, duration: reduced ? 0 : 0.35, ease: "power1.out", onUpdate: render });
    if (reduced) {
      tl.add(() => setState({ entered: true }));
      tl.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: done });
    } else {
      tl.to("[data-pre-fade]", { autoAlpha: 0, y: -16, duration: 0.4, ease: "power2.in", stagger: 0.05 });
      tl.add(() => setState({ entered: true }), "-=0.05");
      tl.to(root.current, { yPercent: -100, duration: 1.05, ease: "expo.inOut", onComplete: done }, "<");
    }
    return () => {
      tl.kill();
    };
  }, [ready]);

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading"
      className="preloader fixed inset-0 z-80 flex flex-col justify-between bg-ink px-4 py-6 sm:px-8 sm:py-8"
    >
      <div data-pre-fade className="eyebrow flex justify-between text-fog">
        <span>Red Bull GmbH</span>
        <span>Est. 1987</span>
      </div>
      <div data-pre-fade className="flex flex-col items-center gap-6">
        <span className="font-display text-[clamp(4rem,14vw,12rem)] leading-[0.8] tracking-tight">
          WIIINGS<span className="text-bull">.</span>
        </span>
        <div className="h-[2px] w-[min(320px,60vw)] overflow-hidden bg-white/10">
          <div ref={bar} className="h-full origin-left bg-sun" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
      <div data-pre-fade className="flex items-end justify-between">
        <span className="eyebrow text-fog">Loading the can</span>
        <span ref={count} className="font-display text-6xl leading-none tabular-nums sm:text-7xl">
          000
        </span>
      </div>
    </div>
  );
}
