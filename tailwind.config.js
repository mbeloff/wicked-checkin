const colors = require("tailwindcss/colors");
const customred = {
  DEFAULT: "#D40C0C",
  50: "#FCDACA",
  100: "#FBC6B2",
  200: "#F89A82",
  300: "#F56851",
  400: "#F23021",
  500: "#D40C0C",
  600: "#A90A15",
  700: "#7D0718",
  800: "#520515",
  900: "#27020C",
};
const accent = {
  DEFAULT: "#6000FF",
  50: "#D2B8FF",
  100: "#C6A3FF",
  200: "#AC7AFF",
  300: "#9352FF",
  400: "#7929FF",
  500: "#6000FF",
  600: "#4B00C7",
  700: "#36008F",
  800: "#210057",
  900: "#0C001F",
};
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
      primary: customred,
      red: customred,
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
