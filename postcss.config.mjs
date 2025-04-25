/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    "@tailwindcss/postcss": {},   // Tailwind’s own PostCSS plugin :contentReference[oaicite:0]{index=0}
    autoprefixer: {},              // ensure vendor prefixes are added :contentReference[oaicite:1]{index=1}
  },
};

