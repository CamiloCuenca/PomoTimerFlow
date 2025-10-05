/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3b53a1",
        primaryNeutral_1: "#f4f6fa",
        secondary: "#e57400",
        tertiary: "#4444",
        quaternary: "#f4fb8a",
        disabled: "#4444",
        bgMain: "#fffefc",
        semitransparent: "rgba(244, 246, 250, 0.65)",
      },
      fontFamily: {
        "alegra-medium": ["AlegreyaSans-Medium"],
        "alegra-regular": ["AlegreyaSans-Regular"],
        "alegra-bold": ["AlegreyaSans-Bold"],
        "montserrat-bold": ["Montserrat-Bold"],
        "montserrat-medium": ["Montserrat-Medium"],
        "roboto-mono-regular": ["RobotoMono-Regular"],
      },
    },
  },
  plugins: [],
}

