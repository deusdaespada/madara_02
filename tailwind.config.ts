import type { Config } from "tailwindcss";

// Design tokens — "Reino dos Lobos": a moonlit forest palette, not a generic
// dark-mode default. Deep indigo-black ground, aged-gold accent (the "moon"),
// and a muted blood-garnet for danger/likes states — never pure black or
// acid green/terracotta.
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))", // aged gold — moonlight / rank / CTA
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // deep violet — wolf-night accent
          foreground: "hsl(var(--secondary-foreground))",
        },
        garnet: {
          DEFAULT: "hsl(var(--garnet))", // likes / ratings / alerts
          foreground: "hsl(var(--garnet-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
