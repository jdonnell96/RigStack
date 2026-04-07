import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f1117",
          raised: "#1a1d27",
          overlay: "#242836",
        },
        accent: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
        status: {
          gray: "#6b7280",
          blue: "#3b82f6",
          amber: "#f59e0b",
          green: "#22c55e",
          red: "#ef4444",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
