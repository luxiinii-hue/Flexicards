import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Sleek dark neutral palette */
        ink: {
          900: "#171717",
          800: "#262626",
          700: "#404040",
          600: "#525252",
          500: "#737373",
          400: "#a3a3a3",
          300: "#d4d4d4",
          200: "#e5e7eb",
          100: "#f3f4f6",
          50:  "#fafafa",
        },
        /* Mythic Orange palette replacing brass */
        brass: {
          50:  "#fffedd",
          100: "#ffedb3",
          200: "#ffd27a",
          300: "#ffb443",
          400: "#ff9114",
          500: "#ea580c",
          600: "#c2410c",
          700: "#9a3412",
          800: "#7c2d12",
          900: "#431407",
        },
        patina: {
          400: "#6ee7b7",
          500: "#34d399",
          600: "#10b981",
        },
        ember: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        parchment: {
          50:  "#fdfbf7",
          100: "#f7f1e5",
          200: "#ebe0ca",
          300: "#d6c7a6",
        },
        mtg: {
          white: "#f8f6d8",
          blue: "#aae0fa",
          black: "#1f1c1a",
          red: "#f9aa8f",
          green: "#9bd3ae",
          gold: "#e3c87a",
          colorless: "#cccac4",
          land: "#a78867",
        },
      },
      fontFamily: {
        ui: ['"Inter"', "system-ui", "sans-serif"],
        title: ['"Beleren"', '"Cinzel"', '"Trajan Pro"', "Georgia", "serif"],
        body: ['"MPlantin"', '"Source Serif 4"', "Georgia", "serif"],
        stats: ['"Beleren"', '"Source Sans 3"', "system-ui", "sans-serif"],
        fell: ['"MPlantin"', '"IM Fell DW Pica"', "Georgia", "serif"],
        fellEng: ['"MPlantin"', '"IM Fell English"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        wider: "0.06em",
        widest: "0.16em",
        engraved: "0.1em",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        deep: "0 16px 40px -10px rgba(0,0,0,0.8)",
        brass: "0 1px 2px rgba(0,0,0,0.5)",
        plate: "0 4px 12px rgba(0,0,0,0.5)",
        engraved: "none",
      },
      backgroundImage: {
        "brass-plate": "linear-gradient(180deg, #333333 0%, #1a1a1a 100%)",
        "brass-dim": "linear-gradient(180deg, #262626 0%, #171717 100%)",
        "walnut": "linear-gradient(180deg, #171717, #0a0a0a)",
        "walnut-dim": "linear-gradient(180deg, #0a0a0a, #000000)",
      },
    },
  },
  plugins: [],
} satisfies Config;