module.exports = {
  plugins: {
    // Tailwind v4 ships its own PostCSS plugin and handles vendor
    // prefixing internally via Lightning CSS, so autoprefixer is gone.
    "@tailwindcss/postcss": {},
  },
};
