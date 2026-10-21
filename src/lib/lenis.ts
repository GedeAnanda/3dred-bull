import type Lenis from "lenis";

let instance: Lenis | null = null;
let stopped = false;

export function setLenis(l: Lenis | null) {
  instance = l;
  if (l && stopped) l.stop();
}

export function getLenis() {
  return instance;
}

export function stopScroll() {
  stopped = true;
  instance?.stop();
}

export function startScroll() {
  stopped = false;
  instance?.start();
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
