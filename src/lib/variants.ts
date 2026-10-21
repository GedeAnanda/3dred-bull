export type Variant = {
  id: string;
  name: string;
  /** Main line printed under the wordmark on the can. */
  line: string;
  /** Optional flavour line printed below `line`. */
  flavor?: string;
  tagline: string;
  description: string;
  /** Ink colour of the coloured tiles on the can. */
  tile: string;
  tileDeep: string;
  /** Wordmark colour. */
  text: string;
  /** UI accent colour used across the page while this edition is selected. */
  accent: string;
};

export const VARIANTS: Variant[] = [
  {
    id: "energy",
    name: "Energy Drink",
    line: "ENERGY DRINK",
    tagline: "The original.",
    description:
      "The drink that started a category in 1987. A functional formula with caffeine, taurine and B-group vitamins — vitalizes body and mind.",
    tile: "#1d3d8f",
    tileDeep: "#0f2462",
    text: "#db0a40",
    accent: "#db0a40",
  },
  {
    id: "sugarfree",
    name: "Sugarfree",
    line: "SUGARFREE",
    tagline: "Wings without sugar.",
    description:
      "The same wings, without the sugar. Sweetened with sucralose and acesulfame K for a lighter take on the original taste.",
    tile: "#3a8fd8",
    tileDeep: "#1f66b0",
    text: "#db0a40",
    accent: "#4aa3ff",
  },
  {
    id: "zero",
    name: "Zero",
    line: "ZERO",
    tagline: "Zero sugar. Closer to the original.",
    description:
      "A different blend of sweeteners for a taste that sits closer to the original Red Bull Energy Drink — with zero sugar.",
    tile: "#0b1a3d",
    tileDeep: "#050d24",
    text: "#5fc4f0",
    accent: "#5fc4f0",
  },
  {
    id: "red",
    name: "The Red Edition",
    line: "THE RED EDITION",
    flavor: "WATERMELON",
    tagline: "Watermelon.",
    description:
      "Red Bull Energy Drink with the taste of watermelon. Same functional formula, a summer-bright flavour profile.",
    tile: "#c8102e",
    tileDeep: "#8e0a20",
    text: "#ffffff",
    accent: "#ff3b5c",
  },
  {
    id: "yellow",
    name: "The Yellow Edition",
    line: "THE YELLOW EDITION",
    flavor: "TROPICAL FRUITS",
    tagline: "Tropical fruits.",
    description:
      "Red Bull Energy Drink with the taste of tropical fruits. Same wings, sunshine in a can.",
    tile: "#f2b705",
    tileDeep: "#c98f00",
    text: "#db0a40",
    accent: "#ffc906",
  },
];
