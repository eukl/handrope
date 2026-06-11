import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-soft": "rgb(var(--surface-soft) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-dark": "rgb(var(--muted-dark) / <alpha-value>)",
        "accent-purple": "rgb(var(--accent-purple) / <alpha-value>)",
        "accent-purple-soft": "rgb(var(--accent-purple-soft) / <alpha-value>)",
        "accent-warm": "rgb(var(--accent-warm) / <alpha-value>)",
        "accent-orange": "rgb(var(--accent-orange) / <alpha-value>)",
        "accent-red": "rgb(var(--accent-red) / <alpha-value>)",
        sand: "rgb(var(--sand) / <alpha-value>)",
        rope: "rgb(var(--rope) / <alpha-value>)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        display: [
          "Playfair Display",
          "Cormorant Garamond",
          "Georgia",
          "Cambria",
          "serif"
        ]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(150, 105, 255, 0.22)",
        warm: "0 20px 70px rgba(150, 105, 255, 0.14)"
      },
      backgroundImage: {
        "warm-gradient":
          "linear-gradient(135deg, #9669ff 0%, #deaa5c 48%, #dc6431 100%)",
        "surface-grain":
          "radial-gradient(circle at top left, rgba(150, 105, 255, 0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(220, 100, 49, 0.06), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
