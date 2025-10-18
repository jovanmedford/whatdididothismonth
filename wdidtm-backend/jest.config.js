module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  setupFiles: ["./jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/.aws-sam/", "/dist/", "/build/"],
};
