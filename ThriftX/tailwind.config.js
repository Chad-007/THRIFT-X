/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./screens/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "#F5A623",
        },
      },
    },
  },
  plugins: [],
};

// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
