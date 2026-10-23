module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
"rules": {
    "object-curly-spacing": ["error", "always"],
    "max-len": "off",
    "require-jsdoc": "off",
    "quotes": "off",
    "indent": "off",
    "quote-props": "off",
    "import/no-unresolved": "off",
    "linebreak-style": "off",
    "new-cap": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
