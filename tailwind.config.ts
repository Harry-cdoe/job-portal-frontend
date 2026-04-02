import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9e9ff",
          500: "#1f6feb",
          600: "#1757b8",
          900: "#102a56"
        }
      }
    }
  },
  plugins: []
};

export default config;
