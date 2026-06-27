/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },

        accent: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },

        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",

        surface: {
          light: "#f8fafc",
          dark: "#0f172a",
        },
      },

      boxShadow: {
        soft: "0 10px 30px rgba(6,182,212,0.15)",
        card: "0 8px 24px rgba(15,23,42,0.08)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};