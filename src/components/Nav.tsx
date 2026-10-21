"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Sun } from "./Icons";
import { getLenis, startScroll, stopScroll } from "@/lib/lenis";
import { NAV_LINKS } from "@/lib/nav";


export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        setHidden(y > 160 && y > last);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const el = menu.current;
    gsap.fromTo(
      el?.querySelectorAll("[data-menu-item]") ?? [],
      { yPercent: 100 },
      { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 },
    );
    el?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      startScroll();
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // Wait for the menu to release the scroll lock before travelling.
    requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(href, { duration: 1.4 });
      else document.querySelector(href)?.scrollIntoView();
    });
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-expo ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`relative z-10 transition-colors duration-300 ${
          scrolled && !open ? "border-b border-line bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8 md:h-20">
          <a href="#top" className="flex items-center gap-3" aria-label="Red Bull company profile — back to top">
            <Sun className="size-7" />
            <span className="font-display text-[1.65rem] leading-none tracking-wide">Red Bull</span>
            <span className="eyebrow hidden border-l border-line pl-3 text-fog sm:inline">Company profile</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative py-2 text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-snow/80 transition-colors duration-200 hover:text-snow"
                >
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-right scale-x-0 bg-accent transition-transform duration-300 ease-expo group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden h-11 items-center rounded-full bg-snow px-5 text-sm font-bold uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:bg-sun sm:inline-flex"
            >
              Contact
            </a>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-line lg:hidden"
            >
              <span className={`absolute h-[2px] w-5 bg-snow transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-[2px] w-5 bg-snow transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </nav>
      </div>
    </header>

      <div
        id="mobile-menu"
        ref={menu}
        hidden={!open}
        className="fixed inset-0 z-45 bg-ink px-4 pb-10 pt-24 sm:px-8 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {[...NAV_LINKS, { href: "#contact", label: "Contact" }].map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                data-menu-item
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
                className="flex items-baseline gap-4 py-1 font-display text-[clamp(3rem,13vw,5.5rem)] leading-[0.95]"
              >
                <span className="eyebrow text-fog">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
