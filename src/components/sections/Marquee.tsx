import { Spark } from "../Icons";
import { VARIANTS } from "@/lib/variants";

const WORDS = ["Gives you wings", ...VARIANTS.map((v) => v.name), "Since 1987"];

export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 font-display text-[clamp(3rem,8vw,7.5rem)] uppercase leading-none md:px-10">{w}</span>
          <Spark className="size-6 text-accent md:size-9" />
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden className="relative z-2 overflow-x-clip py-10">
      <div className="-mx-[5vw] -rotate-2 overflow-hidden border-y border-line bg-ink/60 py-6 backdrop-blur-sm md:py-8">
        <div className="marquee-track flex w-max">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
