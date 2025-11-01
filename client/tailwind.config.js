/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFD643", // This is the yellow for the button
          hover: "#FACC15",   // This is the darker yellow for hover
        },
      },
    },
  },
  plugins: [],
};