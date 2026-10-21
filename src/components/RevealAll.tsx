"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fades up every [data-reveal] element as it enters the viewport. */
export default function RevealAll() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.set("[data-reveal]", { autoAlpha: 0, y: 48 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }),
    });
  });
  return null;
}
