const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "soft-orange": `hsl(35, 77%, 62%)`,
        "soft-red": `hsl(5, 85%, 63%)`,
        "off-white": `hsl(36, 100%, 99%)`,
        "gray-blue": `hsl(233, 8%, 79%)`,
        "dark-blue": `hsl(236, 13%, 42%)`,
        "very-dark-blue": `hsl(240, 100%, 5%)`,
      },
      letterSpacing: {
        widest: "0.3em",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: "15px" },
      });
    }),
    require("@tailwindcss/line-clamp"),
  ],
};
