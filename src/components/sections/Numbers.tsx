"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: 13.97, decimals: 2, prefix: "", unit: "bn", label: "Cans sold worldwide", note: "+10.2% vs. 2024" },
  { value: 12.2, decimals: 1, prefix: "€", unit: "bn", label: "Group turnover", note: "+8.6% vs. 2024" },
  { value: 21924, decimals: 0, prefix: "", unit: "", label: "Employees", note: "Up from 19,973 in 2024" },
  { value: 178, decimals: 0, prefix: "", unit: "", label: "Countries", note: "Where Red Bull is sold" },
];

const format = (v: number, decimals: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export default function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals);
        const counter = { v: 0 };
        el.textContent = format(0, decimals);
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = format(counter.v, decimals);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      gsap.from("[data-stat]", {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-stat-grid]", start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="numbers" data-can="numbers" ref={root} className="relative z-2 flex min-h-[100svh] items-center py-28 md:py-36">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-8">
        <div className="md:w-[62%]">
          <p className="eyebrow text-fog">(03) By the numbers — fiscal year 2025</p>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,6.4rem)] uppercase leading-[0.92]">
            A record year. <span className="text-accent">Again.</span>
          </h2>

          <dl data-stat-grid className="mt-12 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 md:mt-16">
            {STATS.map((s) => (
              <div
                key={s.label}
                data-stat
                className="group relative flex flex-col justify-between gap-10 overflow-hidden border-b border-r border-line bg-ink/40 p-6 backdrop-blur-sm md:p-8"
              >
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                <dt className="eyebrow text-fog">{s.label}</dt>
                <dd>
                  <p className="font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.82] tabular-nums">
                    {s.prefix}
                    <span data-count={s.value} data-decimals={s.decimals}>
                      {format(s.value, s.decimals)}
                    </span>
                    {s.unit && <span className="text-accent">{s.unit}</span>}
                  </p>
                  <p className="mt-3 text-sm text-snow/70">{s.note}</p>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-fog">
            Source:{" "}
            <a
              href="https://www.redbull.com/int-en/energydrink/company-profile"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-snow hover:decoration-snow"
            >
              Red Bull company profile
            </a>
            , company-published figures for 2025.
          </p>
        </div>
      </div>
    </section>
  );
}
