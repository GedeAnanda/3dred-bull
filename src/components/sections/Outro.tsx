import { ArrowUpRight } from "../Icons";
import { NAV_LINKS } from "@/lib/nav";

export default function Outro() {
  return (
    <footer id="contact" className="relative overflow-hidden">
      <div data-can="outro" className="relative flex h-[100svh] min-h-[620px] items-center justify-center">
        {/* Below the WebGL layer: the can floats in front of this word. */}
        <p aria-hidden className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center pb-[18svh] font-display text-[34vw] leading-none text-accent md:pb-0 md:text-[min(27vw,52vh)]">
          WIIINGS
        </p>
        <div className="relative z-2 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between px-4 pb-10 pt-28 sm:px-8">
          <p className="eyebrow text-fog">(08) Contact</p>
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
            <h2 className="font-display text-[clamp(2.6rem,5vw,5rem)] uppercase leading-[0.9] md:col-span-5">
              Ready when <br className="hidden md:block" />
              you are.
            </h2>
            <div className="md:col-span-4 md:col-start-9 md:text-right">
              <address className="not-italic leading-relaxed text-snow/80">
                Red Bull GmbH
                <br />
                Am Brunnen 1, 5330 Fuschl am See
                <br />
                Austria
              </address>
              <a
                href="https://www.redbull.com"
                target="_blank"
                rel="noreferrer"
                className="group mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-snow px-6 text-sm font-bold uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:bg-sun"
              >
                Visit redbull.com
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-2 border-t border-line bg-ink">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm font-semibold uppercase tracking-[0.08em] text-snow/75 transition-colors hover:text-snow">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className="text-sm font-semibold uppercase tracking-[0.08em] text-accent">
                  Back to top ↑
                </a>
              </li>
            </ul>
          </nav>
          <p className="max-w-xl text-sm leading-relaxed text-fog md:text-right">
            Unofficial concept company profile made for design and portfolio purposes. Not affiliated with or endorsed by
            Red Bull GmbH. Red Bull and related marks are trademarks of Red Bull GmbH. Figures from the{" "}
            <a
              href="https://www.redbull.com/int-en/energydrink/company-profile"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-snow"
            >
              Red Bull company profile
            </a>{" "}
            (2025).
          </p>
        </div>
      </div>
    </footer>
  );
}
