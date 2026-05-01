/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#f6f8fb",
          surface: "#ffffff",
          soft: "#eef3f8",
          line: "#d9e2ec",
          text: "#172033",
          body: "#334155",
          muted: "#64748b",
          primary: "#2563eb",
          primaryStrong: "#1d4ed8",
          primarySoft: "#dbeafe",
          teal: "#0f766e",
          success: "#15803d",
          successSoft: "#dcfce7",
          error: "#b91c1c",
          errorSoft: "#fee2e2",
          review: "#d97706",
          reviewSoft: "#fef3c7",
        },
      },
      boxShadow: {
        panel: "0 18px 48px rgba(23, 32, 51, 0.06)",
        soft: "0 10px 28px rgba(23, 32, 51, 0.05)",
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', "system-ui", "sans-serif"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stretch: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        rise: "rise 420ms ease-out both",
        stretch: "stretch 780ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};
