/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./index.js",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#17CF17",          // botón principal
        secondary: "#125612",        // botón secundario
        bgMain: "#112111" ,    // fondo general
        bgDarkGreen: "#1f4e33", // fondo oscuro
      },
      fontFamily: {
        "alegra-medium": ["AlegreyaSans-Medium"],
        "alegra-regular": ["AlegreyaSans-Regular"],
        "alegra-bold": ["AlegreyaSans-Bold"],
        "montserrat-bold": ["Montserrat-Bold"],
        "montserrat-medium": ["Montserrat-Medium"],
        "roboto-mono-regular": ["RobotoMono-Regular"],
      },
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
     require('tailwindcss-textshadow')
  ],
};
