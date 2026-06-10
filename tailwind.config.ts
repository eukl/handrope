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
        background: "#09080d",
        surface: "#12101a",
        "surface-soft": "#1a1724",
        border: "#2a2435",
        foreground: "#f5f1ea",
        muted: "#aaa3b5",
        "muted-dark": "#746d7e",
        "accent-purple": "#8b5cf6",
        "accent-purple-soft": "#a78bfa",
        "accent-warm": "#f59e0b",
        "accent-orange": "#f97316",
        "accent-red": "#ef4444",
        sand: "#d6b982",
        rope: "#b5965a"
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
        glow: "0 24px 80px rgba(139, 92, 246, 0.18)",
        warm: "0 20px 70px rgba(249, 115, 22, 0.12)"
      },
      backgroundImage: {
        "warm-gradient":
          "linear-gradient(135deg, #8b5cf6 0%, #f59e0b 48%, #ef4444 100%)",
        "surface-grain":
          "radial-gradient(circle at top left, rgba(139, 92, 246, 0.14), transparent 32%), radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.12), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
