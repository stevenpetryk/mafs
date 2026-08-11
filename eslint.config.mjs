import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import prettier from "eslint-config-prettier"

export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "build/",
      "docs/.next/",
      "sample-site/dist/",
      "sample-site/node_modules/",
      "playwright-report/",
      "test-results/",
      "playwright/.cache/",
      ".api-report/temp/",
      "tests/frameworks/",
      "**/*.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  prettier,
  {
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "no-console": "error",
    },
  },
  {
    files: ["scripts/**/*", "tests/**/*", "e2e/**/*"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["docs/**/*"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["sample-site/**/*.{mjs,js,ts,tsx}"],
    languageOptions: {
      globals: {
        console: "readonly",
        document: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      "no-console": "off",
    },
  },
)
