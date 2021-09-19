const prod = process.env.NODE_ENV === "production"

module.exports = {
  mode: "jit",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Computer Modern Serif", "serif"],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
