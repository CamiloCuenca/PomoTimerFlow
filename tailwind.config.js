/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#17CF17",          // botón principal
        secondary: "#125612",        // botón secundario
        bgMain: "#112111"            // fondo general
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
};
