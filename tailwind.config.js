/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind'in sınıfları tarayacağı dosyalar
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Bold Typography tasarım sistemi — koyu palet, tek vurgu rengi (vermillion)
      colors: {
        background: "#0A0A0A",
        foreground: "#FAFAFA",
        muted: "#1A1A1A",
        "muted-foreground": "#737373",
        accent: "#FF3D00",
        "accent-foreground": "#0A0A0A",
        border: "#262626",
        input: "#1A1A1A",
        card: "#0F0F0F",
        "card-foreground": "#FAFAFA",
        ring: "#FF3D00",
      },
      fontFamily: {
        // next/font tarafından sağlanan CSS değişkenleri
        sans: ["var(--font-sans)", "Inter Tight", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.06em",
        tight: "-0.04em",
        normal: "-0.01em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
      },
      lineHeight: {
        none: "1",
        tight: "1.1",
        snug: "1.25",
        normal: "1.6",
        relaxed: "1.75",
      },
      fontSize: {
        // Poster ölçeği — devasa başlıklar
        "8xl": "8rem", // 128px
        "9xl": "10rem", // 160px
      },
      borderRadius: {
        // Keskin köşeler — yuvarlaklık yok
        none: "0px",
        DEFAULT: "0px",
      },
      transitionTimingFunction: {
        crisp: "cubic-bezier(0.25, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};
