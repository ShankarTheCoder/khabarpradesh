/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12213B",
          light: "#1B3157",
          dark: "#0B1526",
        },
        paper: {
          DEFAULT: "#FAF7F0",
          dim: "#F1ECDF",
        },
        turmeric: {
          DEFAULT: "#E8A33D",
          dark: "#C9821F",
          light: "#F4C574",
        },
        sindoor: {
          DEFAULT: "#C22E2E",
          dark: "#9E2222",
          light: "#E85A5A",
        },
        charcoal: "#22262B",
        slate: {
          DEFAULT: "#5B6472",
        },
      },
      fontFamily: {
        display: ["'Tiro Devanagari Hindi'", "serif"],
        body: ["'Noto Sans Devanagari'", "sans-serif"],
        utility: ["'Rajdhani'", "sans-serif"],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 1px 1px, rgba(18,33,59,0.035) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "18px 18px",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
      },
      animation: {
        ticker: "ticker 32s linear infinite",
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
