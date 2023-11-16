/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: {
          "100": "#252526",
          "200": "rgba(0, 0, 0, 0.1)",
        },
        mediumblue: "#0040e5",
        dimgray: "#5f6166",
        whitesmoke: "#e9ebf0",
        chocolate: "#d56d21",
        black: "#000",
        royalblue: "#437aff",
        darkslategray: "#333335",
      },
      spacing: {},
      fontFamily: {
        "noto-sans": "'Noto Sans'",
        "noticia-text": "'Noticia Text'",
      },
    },
    fontSize: {
      smi: "13px",
      sm: "14px",
      base: "16px",
      inherit: "inherit",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
