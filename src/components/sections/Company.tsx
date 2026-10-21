"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FACTS = [
  { k: "Founded", v: "1984" },
  { k: "First can sold", v: "1 April 1987, Austria" },
  { k: "Founders", v: "Dietrich Mateschitz & Chaleo Yoovidhya" },
  { k: "Headquarters", v: "Fuschl am See, Austria" },
];

export default function Company() {
  const root = useRef<HTMLElement>(null);
  const statement = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !statement.current) return;
      // Words light up as the statement scrolls through the viewport.
      SplitText.create(statement.current, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: statement.current, start: "top 80%", end: "bottom 45%", scrub: true },
            },
          ),
      });
    },
    { scope: root },
  );

  return (
    <section id="company" data-can="company" ref={root} className="relative z-2 flex min-h-[100svh] items-center py-28 md:py-36">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 px-4 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-7 md:col-start-6">
          <p className="eyebrow text-fog">(02) The company</p>
          <h2
            ref={statement}
            className="mt-6 font-display text-[clamp(2.6rem,6vw,6.4rem)] uppercase leading-[0.92] tracking-[0.005em] text-balance"
          >
            In 1987, a small Austrian company launched one drink — and created a whole new category.
          </h2>

          <div data-reveal className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2">
            <p className="max-w-prose text-lg leading-relaxed text-snow/80">
              Inspired by the functional tonics he discovered in Thailand, Dietrich Mateschitz founded Red Bull GmbH
              in 1984 together with Chaleo Yoovidhya. Three years of developing the formula, the brand and the
              marketing concept later, Red Bull Energy Drink went on sale in Austria — and a new kind of drink was
              born.
            </p>
            <dl className="grid grid-cols-1 border-t border-line">
              {FACTS.map((f) => (
                <div key={f.k} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                  <dt className="eyebrow shrink-0 text-fog">{f.k}</dt>
                  <dd className="text-right text-base font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
