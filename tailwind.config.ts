import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E7FFF",
          dark: "#1666CC",
          light: "#4D9AFF",
          accent: "#2C81FF",
          50: "#EFF6FF",
          100: "#DBEAFE",
        },
        navy: "#0F2259",
        "dark-grey": "#1F2523",
        ink: {
          DEFAULT: "#0F172A",
          soft: "#334155",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["Open Sans", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(15, 23, 42, 0.06)",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { lg: "1100px", xl: "1180px" },
      },
    },
  },
  plugins: [],
};
export default config;
