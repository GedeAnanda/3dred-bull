import type { Variant } from "@/lib/variants";

/** Label artwork is authored in this coordinate space and scaled to the canvas. */
export const LABEL_W = 2048;
export const LABEL_H = 1472;

const TOP_BAND = 92;
const ROW_SPLIT = 760;
const BOTTOM_BAND = 1300;
const COL = LABEL_W / 4;
const FRONT_X = LABEL_W / 2;

export type Fonts = { display: string; sans: string };

type Mode = "color" | "orm";

/**
 * Roughness/metalness encoded the way three.js reads them from one texture:
 * green = roughness, blue = metalness.
 */
function orm(roughness: number, metalness: number) {
  return `rgb(0, ${Math.round(roughness * 255)}, ${Math.round(metalness * 255)})`;
}

const SURFACE = {
  silver: orm(0.26, 1),
  ink: orm(0.34, 0.55),
  wordmark: orm(0.4, 0.3),
  stroke: orm(0.38, 0.35),
  paper: orm(0.55, 0.1),
};

export function readFonts(): Fonts {
  const css = getComputedStyle(document.documentElement);
  return {
    display: css.getPropertyValue("--font-bebas").trim() || "Impact, sans-serif",
    sans: css.getPropertyValue("--font-source").trim() || "Arial, sans-serif",
  };
}

export async function loadFonts(fonts: Fonts) {
  try {
    await Promise.all([
      document.fonts.load(`400 120px ${fonts.display}`),
      document.fonts.load(`900 120px ${fonts.sans}`),
      document.fonts.load(`700 40px ${fonts.sans}`),
    ]);
  } catch {
    // Fall back to whatever is available; the label still renders.
  }
}

function setSpacing(ctx: CanvasRenderingContext2D, px: number) {
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
  }
}

export function paintLabel(
  canvas: HTMLCanvasElement,
  v: Variant,
  mode: Mode,
  fonts: Fonts,
) {
  const ctx = canvas.getContext("2d")!;
  const color = mode === "color";
  ctx.setTransform(canvas.width / LABEL_W, 0, 0, canvas.height / LABEL_H, 0, 0);
  setSpacing(ctx, 0);

  // Bare aluminium base.
  if (color) {
    const g = ctx.createLinearGradient(0, 0, 0, LABEL_H);
    g.addColorStop(0, "#eef1f5");
    g.addColorStop(0.45, "#c3c9d3");
    g.addColorStop(1, "#e3e7ed");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = SURFACE.silver;
  }
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);

  // Checkerboard tiles: two rows, four columns around the circumference.
  // Front of the can sits on the vertical seam at FRONT_X.
  const rows: [number, number][] = [
    [TOP_BAND, ROW_SPLIT],
    [ROW_SPLIT, BOTTOM_BAND],
  ];
  rows.forEach(([y0, y1], row) => {
    for (let col = 0; col < 4; col++) {
      if ((col + row) % 2 !== 1) continue;
      if (color) {
        const g = ctx.createLinearGradient(0, y0, 0, y1);
        g.addColorStop(0, v.tile);
        g.addColorStop(1, v.tileDeep);
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = SURFACE.ink;
      }
      ctx.fillRect(col * COL, y0, COL, y1 - y0);
    }
  });

  // Brushed aluminium grain (colour map only).
  if (color) {
    for (let i = 0; i < 900; i++) {
      const y = Math.random() * LABEL_H;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
      ctx.fillRect(0, y, LABEL_W, 1 + Math.random() * 1.5);
    }
  }

  // Thin rims at the top and bottom of the printed area.
  ctx.fillStyle = color ? v.tileDeep : SURFACE.ink;
  ctx.fillRect(0, TOP_BAND - 10, LABEL_W, 6);
  ctx.fillRect(0, BOTTOM_BAND + 4, LABEL_W, 6);

  // Sun disc.
  const sunY = 618;
  if (color) {
    const g = ctx.createRadialGradient(FRONT_X - 34, sunY - 42, 16, FRONT_X, sunY, 140);
    g.addColorStop(0, "#ffe27a");
    g.addColorStop(0.6, "#ffc906");
    g.addColorStop(1, "#f2a900");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = SURFACE.wordmark;
  }
  ctx.beginPath();
  ctx.arc(FRONT_X, sunY, 138, 0, Math.PI * 2);
  ctx.fill();

  // Wordmark. White ink gets a dark outline, coloured ink a white one.
  const lightInk = v.text.toLowerCase() === "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.font = `900 172px ${fonts.sans}`;
  setSpacing(ctx, -4);
  ctx.lineWidth = 16;
  ctx.strokeStyle = color ? (lightInk ? v.tileDeep : "#ffffff") : SURFACE.stroke;
  ctx.strokeText("Red Bull", FRONT_X, 935);
  ctx.fillStyle = color ? v.text : SURFACE.wordmark;
  ctx.fillText("Red Bull", FRONT_X, 935);

  // Edition line.
  ctx.font = `400 ${v.line.length > 12 ? 90 : 108}px ${fonts.display}`;
  setSpacing(ctx, 10);
  ctx.lineWidth = 14;
  ctx.strokeStyle = color ? v.tileDeep : SURFACE.stroke;
  ctx.strokeText(v.line, FRONT_X, 1110);
  ctx.fillStyle = color ? "#ffffff" : SURFACE.stroke;
  ctx.fillText(v.line, FRONT_X, 1110);

  if (v.flavor) {
    ctx.font = `800 46px ${fonts.sans}`;
    setSpacing(ctx, 12);
    ctx.lineWidth = 10;
    ctx.strokeStyle = color ? v.tileDeep : SURFACE.stroke;
    ctx.strokeText(v.flavor, FRONT_X, 1200);
    ctx.fillStyle = color ? "#ffffff" : SURFACE.stroke;
    ctx.fillText(v.flavor, FRONT_X, 1200);
  }

  // Volume, bottom band.
  ctx.font = `700 40px ${fonts.sans}`;
  setSpacing(ctx, 8);
  ctx.fillStyle = color ? "#1b2a55" : SURFACE.ink;
  ctx.fillText("250 ML  ·  8.4 FL OZ", FRONT_X, 1392);

  // Back of the can: copy block (column 0, top row is bare aluminium).
  const backX = COL / 2;
  ctx.textAlign = "center";
  ctx.font = `400 64px ${fonts.display}`;
  setSpacing(ctx, 6);
  ctx.fillStyle = color ? "#132250" : SURFACE.ink;
  ctx.fillText("VITALIZES BODY AND MIND.", backX, 260);
  ctx.font = `700 28px ${fonts.sans}`;
  setSpacing(ctx, 2);
  [
    "ENERGY DRINK WITH TAURINE.",
    "CAFFEINE 32 MG / 100 ML.",
    "HIGH CAFFEINE CONTENT.",
    "NOT RECOMMENDED FOR CHILDREN",
    "OR PREGNANT OR BREAST-FEEDING",
    "WOMEN. RED BULL GMBH,",
    "5330 FUSCHL AM SEE, AUSTRIA.",
  ].forEach((t, i) => ctx.fillText(t, backX, 340 + i * 44));

  // Barcode (column 3, bottom row is bare aluminium).
  const bx = COL * 3 + COL / 2 - 150;
  const by = 900;
  ctx.fillStyle = color ? "#ffffff" : SURFACE.paper;
  ctx.fillRect(bx - 24, by - 24, 348, 230);
  ctx.fillStyle = color ? "#0b1230" : SURFACE.ink;
  let x = bx;
  let seed = 7;
  while (x < bx + 300) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 3 + (seed % 4) * 3;
    ctx.fillRect(x, by, w, 150);
    x += w + 4 + (seed % 3) * 3;
  }
  ctx.font = `700 26px ${fonts.sans}`;
  setSpacing(ctx, 6);
  ctx.fillText("9 001234 567890", bx + 150, by + 190);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Condensation: a height map of droplets converted to a tangent-space normal map.
 * Tiles horizontally so the seam on the can is invisible.
 */
export function makeDropletNormals(w = 1024, h = 736, count = 1700) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";

  const drop = (x: number, y: number, rx: number, ry: number) => {
    for (const ox of [-w, 0, w]) {
      ctx.save();
      ctx.translate(x + ox, y);
      ctx.scale(rx, ry);
      const g = ctx.createRadialGradient(-0.2, -0.25, 0, 0, 0, 1);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.55, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  for (let i = 0; i < count; i++) {
    const r = 1.2 + Math.pow(Math.random(), 3) * 7;
    drop(Math.random() * w, Math.random() * h, r, r * (0.9 + Math.random() * 0.25));
  }
  // A few running drops.
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h * 0.8;
    drop(x, y, 2.2 + Math.random() * 1.5, 14 + Math.random() * 30);
  }

  const src = ctx.getImageData(0, 0, w, h).data;
  const out = ctx.createImageData(w, h);
  const height = (x: number, y: number) =>
    src[(Math.min(h - 1, Math.max(0, y)) * w + ((x + w) % w)) * 4] / 255;
  const strength = 3.2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (height(x - 1, y) - height(x + 1, y)) * strength;
      const dy = (height(x, y + 1) - height(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const o = (y * w + x) * 4;
      out.data[o] = ((dx / len) * 0.5 + 0.5) * 255;
      out.data[o + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      out.data[o + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      out.data[o + 3] = 255;
    }
  }
  ctx.globalCompositeOperation = "copy";
  ctx.putImageData(out, 0, 0);
  return canvas;
}
