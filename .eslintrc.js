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
  ],
  rules: {
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-extra-semi": "off",
  },
  overrides: [
    {
      files: ["docs/**/*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
}
