import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Make sure jest.setup.ts is loaded
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
  },
  testMatch: ["**/__tests__/**/*.(test|spec).[jt]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript files with ts-jest
    "^.+\\.(js|jsx)$": "babel-jest", // Transform JavaScript files with babel-jest
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@supabase|isows)/).*", // Ensure @supabase and isows modules are not ignored
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true, // Speed up transformation by isolating modules (if applicable)
    },
  },
};

export default config;
