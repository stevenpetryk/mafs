module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "no-console": "error",
  },
  overrides: [
    {
      files: ["docs/**/*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
    {
      files: ["scripts/**/*"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
}
