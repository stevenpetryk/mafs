module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Computer Modern Serif", "serif"],
    },
    extend: {
      backgroundPosition: {
        "left-nudge": "center left 8px",
      },
    },
  },
  plugins: [],
}
