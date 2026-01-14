import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37",
        "primary-dark": "#B89628",
        secondary: "#E8D3D9",
        accent: "#6A5ACD",
        "background-light": "#FDFBF7",
        "background-dark": "#1F1A1C",
        "surface-light": "#FFFFFF",
        "surface-dark": "#2A2426",
        "text-light": "#4A403A",
        "text-dark": "#E8D3D9",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
