/**
 * Verdict presentation — lightness/saturation of the forest scale only.
 * No red/amber. "Malicious" reads as a dense, high-contrast near-black-green
 * block; "Safe" reads as the lighter forest-300 tone.
 */
export const verdictStyle = {
  malicious: {
    label: "Malicious",
    text: "text-forest-100",
    dot: "bg-forest-500",
    chip: "bg-forest-950 border-forest-700 text-forest-100",
    accent: "text-forest-200",
    bar: "bg-forest-700",
    ring: "ring-forest-700/60",
  },
  suspicious: {
    label: "Suspicious",
    text: "text-forest-200",
    dot: "bg-forest-400",
    chip: "bg-forest-900/60 border-forest-700/70 text-forest-200",
    accent: "text-forest-300",
    bar: "bg-forest-500",
    ring: "ring-forest-600/40",
  },
  safe: {
    label: "Safe",
    text: "text-forest-300",
    dot: "bg-forest-300",
    chip: "bg-forest-900/40 border-forest-600/60 text-forest-300",
    accent: "text-forest-300",
    bar: "bg-forest-300",
    ring: "ring-forest-500/40",
  },
};
