import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import RevealAll from "@/components/RevealAll";
import Stage from "@/components/three/Stage";
import Hero from "@/components/sections/Hero";
import Company from "@/components/sections/Company";
import Numbers from "@/components/sections/Numbers";
import Marquee from "@/components/sections/Marquee";
import Products from "@/components/sections/Products";
import World from "@/components/sections/World";
import Timeline from "@/components/sections/Timeline";
import Purpose from "@/components/sections/Purpose";
import Outro from "@/components/sections/Outro";

export default function Home() {
  return (
    <>
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>
      <Preloader />
      <Nav />
      <Stage />
      {/* No z-index here: hero and outro type must stack below the fixed WebGL layer. */}
      <main className="overflow-x-clip">
        <Hero />
        <Company />
        <Numbers />
        <Marquee />
        <Products />
        {/* Opaque block; the 3D stage pauses while this covers the viewport. */}
        <div data-solid className="relative z-2">
          <World />
          <Timeline />
          <Purpose />
        </div>
        <Outro />
      </main>
      <RevealAll />
    </>
  );
}
