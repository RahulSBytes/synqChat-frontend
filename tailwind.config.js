import scrollbar from "tailwind-scrollbar";
/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
        handwriting: ['"Patrick Hand"', 'cursive']   
      },
  },
  plugins: [scrollbar, daisyui],
  daisyui: {
    themes: "all",
  },
};
