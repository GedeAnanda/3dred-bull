"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setState } from "@/lib/store";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/** Fixed full-screen WebGL layer that sits between the hero type and the page content. */
export default function Stage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const solid = document.querySelector("[data-solid]");
    if (!solid) return;
    // Stop rendering while opaque sections fully cover the canvas.
    const st = ScrollTrigger.create({
      trigger: solid,
      start: "top top",
      end: "bottom bottom",
      onToggle: (self) => setState({ paused: self.isActive }),
    });
    return () => st.kill();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-1">
      <Scene />
    </div>
  );
}
