/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.ejs",
    "./views/partials/*.ejs",
    "./views/components/*.ejs",
    "./public/*.{html, js, css, csv}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    colors: {
      background: "#fffbe6",
      background2: "#f4f6f8",
      accent1: "#63991f",
      accent2: "#c5d419",
      text: "#131314",
      text2: "#272829",
    },
    fontFamily: {
      body: ["Hedvig Letters Sans", "sans"],
      heading: ["Hedvig Letters Serif", "serif"],
    },
  },
  plugins: [],
};
