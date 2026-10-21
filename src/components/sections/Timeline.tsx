"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MILESTONES = [
  { year: "1984", title: "A company is founded", text: "Dietrich Mateschitz and Chaleo Yoovidhya found Red Bull GmbH in Austria." },
  { year: "1987", title: "The first can", text: "On 1 April, Red Bull Energy Drink goes on sale in Austria." },
  { year: "1992", title: "Across the border", text: "Hungary becomes the first market outside Austria." },
  { year: "1997", title: "America", text: "Red Bull arrives in the United States." },
  { year: "2004", title: "Wings for Life & BC One", text: "The spinal cord research foundation is set up, and the first Red Bull BC One is held." },
  { year: "2005", title: "Formula 1", text: "Red Bull Racing lines up on the Formula 1 grid for the first time." },
  { year: "2007", title: "Red Bull Media House", text: "A media company of its own, telling stories from sport, culture and lifestyle." },
  { year: "2010", title: "First F1 double", text: "Drivers' and constructors' world championships in the same season." },
  { year: "2012", title: "The edge of space", text: "Red Bull Stratos: Felix Baumgartner jumps from 38,969 metres." },
  { year: "2022", title: "A founder's legacy", text: "Dietrich Mateschitz passes away. The company he built keeps flying." },
  { year: "2025", title: "13.97 billion cans", text: "A new record, sold in 178 countries by 21,924 people." },
];

export default function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-list]", start: "top 70%", end: "bottom 70%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          x: 40,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="milestones" ref={root} className="relative bg-paper py-28 text-ink md:py-40">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-4 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <p className="eyebrow text-slate">(06) Milestones</p>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,7.5rem)] uppercase leading-[0.86]">
              From Fuschl to the <span className="text-bull">stratosphere.</span>
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-slate">
              Four decades, one drink, and a habit of doing things nobody had tried before.
            </p>
          </div>
        </div>

        <ol data-list className="relative md:col-span-7">
          <span className="absolute bottom-0 left-[7px] top-0 w-[2px] bg-ink/10" aria-hidden />
          <span data-line className="absolute bottom-0 left-[7px] top-0 w-[2px] origin-top bg-bull" aria-hidden />
          {MILESTONES.map((m) => (
            <li key={m.year} data-milestone className="relative grid grid-cols-[auto_1fr] gap-x-6 pb-12 pl-10 last:pb-0 sm:grid-cols-[9rem_1fr]">
              <span className="absolute left-0 top-3 size-4 rounded-full border-2 border-bull bg-paper" aria-hidden />
              <span className="font-display text-5xl leading-none tabular-nums sm:text-6xl">{m.year}</span>
              <div className="col-span-2 mt-2 sm:col-span-1 sm:mt-0">
                <h3 className="text-xl font-bold">{m.title}</h3>
                <p className="mt-1 max-w-md text-base leading-relaxed text-slate">{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
