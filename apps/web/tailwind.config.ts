import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
      },
      colors: {
        base:    "#0c0d0f",
        surface: "#131416",
        raised:  "#1a1b1e",
        hover:   "#202226",
        active:  "#252830",
        accent:  "#5b8ef0",
        green:   "#3ecf8e",
        amber:   "#f0a946",
        red:     "#f06565",
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          mid:     "rgba(255,255,255,0.12)",
        },
        text: {
          primary:   "#eeeef0",
          secondary: "#888994",
          muted:     "#4a4b57",
        },
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "10px",
      },
      animation: {
        pulse2: "pulse2 1.2s ease-in-out infinite",
        blink:  "blink 1.2s ease-in-out infinite",
        progress: "progress 2s ease-in-out infinite",
      },
      keyframes: {
        pulse2: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.3" },
        },
        blink: {
          "0%,100%": { opacity: "0.3" },
          "50%":     { opacity: "1" },
        },
        progress: {
          "0%":   { width: "20%" },
          "70%":  { width: "80%" },
          "100%": { width: "85%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
