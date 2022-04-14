module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: [
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
  ],

  parserOptions: {
    parser: "@babel/eslint-parser",
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
