const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        spacing: "margin, padding",
      },
      screens: {
        print: { raw: "print" },
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.zinc,
      blue: colors.sky,
      accent: colors.sky,
      primary: colors.red,
      rose: colors.rose,
      yellow: colors.amber,
      orange: colors.orange,
    },
  },
  variants: {
    extend: {
      scale: ["active", "group-hover"],
      translate: ["group-hover"],
      borderRadius: ["first", "last"],
      padding: ["hover"],
    },
  },
};
