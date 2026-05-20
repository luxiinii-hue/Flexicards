import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * Walnut ink (the editor background). Inverted from the previous
         * cream palette: small numbers are darkest, large numbers brightest.
         */
        ink: {
          900: "#0c0805",
          800: "#100b07",
          700: "#171009",
          600: "#22180d",
          500: "#2e2010",
          400: "#3e2c17",
          300: "#604322",
          200: "#8e6932",
          100: "#cfb98a",
          50:  "#f3e6c0",
        },
        /** Brass alloy used on plates, rivets and primary buttons. */
        brass: {
          50:  "#fff3c8",
          100: "#f3d99a",
          200: "#e6c47a",
          300: "#d9b266",
          400: "#b0863e",
          500: "#8d6627",
          600: "#5e421a",
          700: "#3a2811",
          800: "#221608",
          900: "#110b04",
        },
        /** Patinated teal accent for chips, alerts and verdant flourishes. */
        patina: {
          400: "#8edec5",
          500: "#5cae9b",
          600: "#3d8676",
        },
        /** Ember accent for warnings, "press ready" cues. */
        ember: {
          400: "#ffb56a",
          500: "#ff7a3a",
          600: "#c2693a",
          700: "#7a3a14",
        },
        /** Parchment colors used on rules text fields and the text box. */
        parchment: {
          50:  "#fff8e2",
          100: "#f3e7bf",
          200: "#dec99a",
          300: "#b09866",
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
        title: ['"Cinzel"', '"Trajan Pro"', "Georgia", "serif"],
        body: ['"Source Serif 4"', "Georgia", "serif"],
        stats: ['"Source Sans 3"', "system-ui", "sans-serif"],
        fell: ['"IM Fell DW Pica"', '"IM Fell English"', "Georgia", "serif"],
        fellEng: ['"IM Fell English"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        wider: "0.06em",
        widest: "0.16em",
        engraved: "0.32em",
      },
      boxShadow: {
        card: "0 2px 6px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)",
        deep: "0 16px 40px -10px rgba(0,0,0,0.7)",
        brass:
          "inset 0 1px 0 rgba(255,231,170,0.6), inset 0 -1px 0 rgba(0,0,0,0.45), 0 1px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.25)",
        plate:
          "inset 0 0 0 1px rgba(217,178,102,0.06), inset 0 1px 0 rgba(255,220,160,0.05), 0 8px 24px rgba(0,0,0,0.55)",
        engraved: "0 1px 0 rgba(0,0,0,0.9), 0 -1px 0 rgba(255,220,160,0.18)",
      },
      backgroundImage: {
        "brass-plate":
          "linear-gradient(180deg, #e6c47a 0%, #c89a4d 30%, #8d6627 65%, #5c3f15 100%)",
        "brass-dim":
          "linear-gradient(180deg, #8a6a36 0%, #5e421a 60%, #3a2811 100%)",
        "walnut":
          "linear-gradient(180deg, #1d130a, #14100a 60%, #0e0a05)",
        "walnut-dim":
          "linear-gradient(180deg, #160e07 0%, #0c0805 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
