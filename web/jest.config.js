/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.css$": "<rootDir>/src/test/styleStub.ts",
    "\\.(png|jpe?g|gif|svg|webp|mp4|ttf|woff2?)$": "<rootDir>/src/test/fileStub.ts",
  },
  clearMocks: true,
};
