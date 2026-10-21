"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Panel = {
  id: string;
  kicker: string;
  title: string;
  stat: string;
  statLabel: string;
  body: string;
  className: string;
  muted: string;
  visual: ReactNode;
};

function Stripes() {
  return (
    <div
      className="motion-loop absolute inset-0 hidden opacity-25 md:block"
      style={{
        backgroundImage: "repeating-linear-gradient(-55deg, transparent 0 28px, rgb(255 255 255 / 0.9) 28px 40px)",
        backgroundSize: "160px 100%",
        animation: "stripes 1.6s linear infinite",
        maskImage: "linear-gradient(90deg, transparent, black 40%)",
      }}
    />
  );
}

function Altimeter() {
  const ticks = Array.from({ length: 14 }, (_, i) => 39 - i * 3);
  return (
    <div className="absolute bottom-14 right-14 top-40 hidden w-40 md:flex">
      <div className="relative flex flex-1 flex-col justify-between border-r border-white/25 pr-3 text-right">
        {ticks.map((t) => (
          <span key={t} className="eyebrow text-[0.7rem] text-white/45">
            {t} km
          </span>
        ))}
        <span
          className="motion-loop absolute -right-[7px] top-0 size-3 rounded-full bg-sun shadow-[0_0_24px_6px_rgb(255_201_6/0.6)]"
          style={{ ["--fall" as string]: "calc(100svh - 14rem)", animation: "fall 4.2s cubic-bezier(.55,0,.8,.6) infinite" }}
        />
      </div>
    </div>
  );
}

function Ripples() {
  return (
    <div className="absolute bottom-14 right-14 hidden size-72 md:block">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="motion-loop absolute inset-0 rounded-[50%] border-2 border-ink/50"
          style={{ animation: `ripple 3s ease-out ${i}s infinite`, transform: "scaleY(0.35)" }}
        />
      ))}
      <span className="absolute bottom-1/2 left-1/2 h-[60vh] w-[2px] -translate-x-1/2 bg-gradient-to-t from-ink/60 to-transparent" />
    </div>
  );
}

function Cypher() {
  return (
    <div className="absolute bottom-14 right-14 hidden size-64 md:block">
      <div className="motion-loop absolute inset-0 rounded-full border border-dashed border-ink/40" style={{ animation: "orbit 18s linear infinite" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 size-3 rounded-full bg-ink"
            style={{ transform: `rotate(${i * 36}deg) translateY(-8rem) translate(-50%, -50%)` }}
          />
        ))}
      </div>
      <span className="absolute inset-[35%] rounded-full bg-bull" />
    </div>
  );
}

function Clubs() {
  return (
    <ul className="mt-8 max-w-md divide-y divide-white/15 border-y border-white/15">
      {[
        ["RB Leipzig", "Germany"],
        ["FC Red Bull Salzburg", "Austria"],
        ["New York Red Bulls", "USA"],
        ["Red Bull Bragantino", "Brazil"],
      ].map(([c, n]) => (
        <li key={c} className="flex items-baseline justify-between gap-4 py-3">
          <span className="text-lg font-semibold">{c}</span>
          <span className="eyebrow text-white/60">{n}</span>
        </li>
      ))}
    </ul>
  );
}

const PANELS: Panel[] = [
  {
    id: "f1",
    kicker: "Motorsport — Formula 1",
    title: "Oracle Red Bull Racing",
    stat: "8",
    statLabel: "Drivers' world titles · 6 constructors'",
    body: "On the grid since 2005. Championships with Sebastian Vettel (2010–2013) and Max Verstappen (2021–2024).",
    className: "bg-bull text-white",
    muted: "text-white/75",
    visual: <Stripes />,
  },
  {
    id: "stratos",
    kicker: "Space dive — 14 October 2012",
    title: "Red Bull Stratos",
    stat: "38,969 m",
    statLabel: "Jump altitude · 1,357.6 km/h top speed",
    body: "Felix Baumgartner stepped off a capsule at the edge of space and became the first person to break the speed of sound in free fall.",
    className: "bg-ink-2 text-white",
    muted: "text-white/70",
    visual: <Altimeter />,
  },
  {
    id: "cliff",
    kicker: "Cliff Diving World Series",
    title: "Since 2009",
    stat: "27 m",
    statLabel: "Men's platform height",
    body: "The world's best high divers launch from cliffs, bridges and towers — around three seconds of free fall at up to 85 km/h.",
    className: "bg-sun text-ink",
    muted: "text-ink/75",
    visual: <Ripples />,
  },
  {
    id: "bcone",
    kicker: "Breaking",
    title: "Red Bull BC One",
    stat: "1 vs 1",
    statLabel: "Since 2004",
    body: "The world's biggest one-on-one breaking competition — from local cyphers to a World Final.",
    className: "bg-silver text-ink",
    muted: "text-ink/75",
    visual: <Cypher />,
  },
  {
    id: "football",
    kicker: "Football",
    title: "Four clubs, three continents",
    stat: "4",
    statLabel: "Clubs in Europe & the Americas",
    body: "",
    className: "bg-navy text-white",
    muted: "text-white/75",
    visual: null,
  },
];

export default function World() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-world-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-par]").forEach((p) => {
          gsap.fromTo(
            p,
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="world" ref={root} className="relative overflow-hidden bg-ink">
      <div ref={track} className="flex flex-col lg:h-[100svh] lg:w-max lg:flex-row">
        <div className="flex flex-col justify-between gap-10 px-4 pb-16 pt-28 sm:px-8 lg:h-full lg:w-[44vw] lg:pb-12">
          <p className="eyebrow text-fog">(05) World of Red Bull</p>
          <div>
            <h2 className="font-display text-[clamp(3.2rem,8vw,9rem)] uppercase leading-[0.85]">
              Beyond
              <br />
              the <span className="text-accent">can.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-snow/80">
              Red Bull doesn&apos;t only sponsor sport and culture. It builds teams, invents formats and tells the
              stories itself.
            </p>
          </div>
          <p className="eyebrow hidden text-fog lg:block">Keep scrolling →</p>
        </div>

        {PANELS.map((p, i) => (
          <article
            key={p.id}
            className={`relative flex min-h-[72svh] flex-col justify-between overflow-hidden px-4 pb-10 pt-24 sm:px-8 lg:h-full lg:min-h-0 lg:w-[min(78vw,1080px)] lg:px-14 lg:pb-14 ${p.className}`}
          >
            {p.visual}
            <div className="relative flex justify-between">
              <p className="eyebrow">{p.kicker}</p>
              <p className="eyebrow">
                {String(i + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
              </p>
            </div>
            <div className="relative">
              <p data-par className="font-display text-[clamp(5.5rem,17vw,16rem)] leading-[0.8] tracking-tight">
                {p.stat}
              </p>
              <p className={`eyebrow mt-4 ${p.muted}`}>{p.statLabel}</p>
              <h3 className="mt-8 font-display text-[clamp(2.4rem,4.5vw,4.5rem)] uppercase leading-[0.9]">{p.title}</h3>
              {p.body && <p className={`mt-4 max-w-md text-lg leading-relaxed ${p.muted}`}>{p.body}</p>}
              {p.id === "football" && <Clubs />}
            </div>
          </article>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 hidden h-[3px] bg-white/10 lg:block">
        <div data-world-progress className="h-full origin-left bg-sun" style={{ transform: "scaleX(0)" }} />
      </div>
    </section>
  );
}
