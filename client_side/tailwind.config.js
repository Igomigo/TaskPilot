/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "form-bg": "#1F2937",
        "input-bg": "#374151",
        "yellow": "#EAB308",
        "green": "#4ADE80",
        "bg-color": "#111827"
      }
    },
  },
  plugins: [],
}

