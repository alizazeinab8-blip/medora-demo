import type { Config } from "tailwindcss";

/**
 * Medora design tokens.
 * Change the brand palette here — every component uses these names,
 * so a rebrand is a one-file change.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ["'Vazirmatn Variable'", "Vazirmatn", "Tahoma", "sans-serif"],
      },
      colors: {
        navy: {
          50: "#f2f5fa",
          100: "#e3e9f3",
          200: "#c5d1e5",
          300: "#98abcd",
          400: "#6581ae",
          500: "#44608f",
          600: "#344b73",
          700: "#2a3c5c",
          800: "#1c2a44",
          900: "#111d33",
          950: "#0a1324",
        },
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#bcd6ff",
          300: "#8ebcff",
          400: "#5997fd",
          500: "#3474f6",
          600: "#1f57e0",
          700: "#1a45b8",
          800: "#1b3d91",
          900: "#1c3773",
        },
        teal: {
          50: "#effbf9",
          100: "#d6f4ef",
          200: "#aee8df",
          300: "#7bd5c9",
          400: "#46b9ac",
          500: "#2a9d91",
          600: "#1f7e76",
          700: "#1d6560",
        },
        surface: "#f6f8fb",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,29,51,0.04), 0 4px 16px -4px rgba(17,29,51,0.06)",
        lift: "0 2px 4px rgba(17,29,51,0.04), 0 12px 32px -8px rgba(17,29,51,0.12)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
