export default {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", { jsc: { transform: { react: { runtime: "automatic" } } } }],
  },
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
}
