"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight } from "../Icons";
import { motion, useStore } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const entered = useStore((s) => s.entered);

  // Hidden starting state, applied before the preloader lifts.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set("[data-hero-char]", { yPercent: 105 });
      gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 28 });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!entered) return;
      if (prefersReducedMotion()) {
        motion.intro = 1;
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(motion, { intro: 1, duration: 2.2, ease: "expo.out" }, 0.1)
        .to("[data-hero-char]", { yPercent: 0, duration: 1.4, stagger: 0.06 }, 0.25)
        .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.6);

      // Giant type drifts and dims as the hero scrolls away.
      gsap.to("[data-hero-type]", {
        yPercent: 18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [entered] },
  );

  return (
    <section id="top" data-can="hero" ref={root} className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* Sits below the WebGL layer so the can stands in front of the type. */}
      <div data-hero-type className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center pb-[16svh] md:pb-0">
        <h1 className="flex select-none flex-col items-start font-display uppercase leading-[0.78]">
          <span className="sr-only">Red Bull — </span>
          <span data-hero-fade className="pl-[0.4vw] text-[clamp(2rem,6.4vw,7rem)] tracking-[0.02em] text-snow">
            Gives you
          </span>
          <span className="flex overflow-hidden pt-[0.06em] text-[38vw] tracking-[-0.01em] text-accent md:text-[min(31vw,48vh)]">
            {"WINGS".split("").map((c, i) => (
              <span key={i} data-hero-char aria-hidden className="inline-block will-change-transform">
                {c}
              </span>
            ))}
            <span className="sr-only">wings</span>
          </span>
        </h1>
      </div>

      <div className="relative z-2 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-4 pb-6 pt-24 sm:px-8 md:pb-8 md:pt-28">
        <div data-hero-fade className="eyebrow flex justify-between gap-4 text-fog">
          <span>(01) Company profile — FY 2025</span>
          <span className="hidden text-right sm:inline">Fuschl am See, Austria · 47.80° N 13.30° E</span>
        </div>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
            <p data-hero-fade className="max-w-sm text-base leading-relaxed text-snow/85 md:text-lg">
              The Austrian company behind the world&apos;s best-known energy drink — and a platform for sport,
              culture and media in 178 countries.
            </p>
            <div data-hero-fade className="mt-5 flex flex-wrap gap-3">
              <a
                href="#company"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm sm:px-6 font-bold uppercase tracking-[0.08em] text-white transition-transform duration-300 ease-expo hover:-translate-y-0.5"
              >
                <span className="sm:hidden">Explore</span>
                <span className="hidden sm:inline">Discover the company</span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
              <a
                href="#range"
                className="inline-flex h-12 items-center rounded-full border border-white/25 px-5 text-sm sm:px-6 font-bold uppercase tracking-[0.08em] transition-colors duration-200 hover:border-snow hover:bg-snow hover:text-ink"
              >
                The range
              </a>
            </div>
          </div>

          <div data-hero-fade className="hidden justify-center md:col-span-2 md:col-start-6 md:flex lg:col-start-6">
            <a href="#company" className="eyebrow flex flex-col items-center gap-2 text-fog transition-colors hover:text-snow">
              Scroll
              <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/25 pt-1.5">
                <ArrowDown className="motion-loop size-3 animate-bounce" />
              </span>
            </a>
          </div>

          <div data-hero-fade className="hidden text-right md:col-span-4 md:col-start-9 md:block lg:col-span-3 lg:col-start-10">
            <p className="font-display text-[clamp(3rem,5vw,5.5rem)] leading-[0.85]">
              13.97<span className="text-accent">bn</span>
            </p>
            <p className="eyebrow mt-2 text-fog">Cans sold worldwide in 2025</p>
          </div>
        </div>
      </div>
    </section>
  );
}
