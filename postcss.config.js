module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: "./tailwind.config.js",
    "@fullhuman/postcss-purgecss": {
      content: ["./src/**/*.vue", "./src/**/*.js"],
      whitelistPatterns: [/^vue-ads-w-(\d+)\/4$/],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    },
    "postcss-import": {},
    "postcss-url": {},
  },
};
