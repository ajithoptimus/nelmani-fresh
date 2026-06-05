import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/store/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#15803d",
          dark: "#14532d",
          light: "#166534",
        },
        accent: {
          DEFAULT: "#d97706",
          light: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-green": "radial-gradient(circle at 30% 50%, rgba(212,175,55,0.15), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
