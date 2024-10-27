/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "gray-muted": "#A8A4A4",
        theme: "#5858FA",
      },
      fontFamily: {
        rubik: "var(--font-rubik)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
