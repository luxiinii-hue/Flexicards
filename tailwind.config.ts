import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#fafaf7",
          100: "#f3f1ea",
          200: "#e6e2d6",
          300: "#cfc8b3",
          400: "#a8a085",
          500: "#7f7960",
          600: "#5a5544",
          700: "#3e3a2d",
          800: "#26241c",
          900: "#16140f",
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
        title: ['"Cinzel"', "Georgia", "serif"],
        body: ['"Source Serif 4"', "Georgia", "serif"],
        stats: ['"Source Sans 3"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 6px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
        deep: "0 16px 40px -10px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
