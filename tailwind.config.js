/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c2d4ff",
          300: "#96b3ff",
          400: "#6488ff",
          500: "#3d5eff",
          600: "#2440f5",
          700: "#1b2fe1",
          800: "#1c28b5",
          900: "#1c268e",
          950: "#141960",
        },
        surface: {
          0:   "#ffffff",
          50:  "#f8faff",
          100: "#f0f4ff",
          200: "#e4eaff",
          800: "#0f1629",
          900: "#080d1c",
          950: "#040812",
        },
      },
      animation: {
        "fade-up":    "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":    "fadeIn 0.3s ease both",
        "slide-in-left": "slideInLeft 0.35s cubic-bezier(0.22,1,0.36,1) both",
        "pop":        "pop 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
        "pulse-dot":  "pulseDot 1.5s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp:      { from: { opacity: 0, transform: "translateY(18px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn:      { from: { opacity: 0 }, to: { opacity: 1 } },
        slideInLeft: { from: { opacity: 0, transform: "translateX(-20px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        pop:         { from: { opacity: 0, transform: "scale(0.85)" }, to: { opacity: 1, transform: "scale(1)" } },
        pulseDot:    { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.5)", opacity: 0.6 } },
        shimmer:     { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      boxShadow: {
        card:    "0 2px 16px rgba(61,94,255,0.06), 0 1px 3px rgba(0,0,0,0.05)",
        "card-hover": "0 8px 32px rgba(61,94,255,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        brand:   "0 4px 24px rgba(61,94,255,0.35)",
        sidebar: "4px 0 24px rgba(8,13,28,0.15)",
      },
    },
  },
  plugins: [],
};
