import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./core/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      width: {
        18: "4.5rem",
      },
      height: {
        18: "4.5rem",
      },
      size: {
        18: "4.5rem",
      },
      colors: {
        orange: "#fb923c",
        "orange-fg": "#9a3412",
        purple: "#caaaff",
        "purple-fg": "#2e125a",
        blue: "#1e3a8a",
        "blue-fg": "#60a5fa",
        yellow: "#facc15",
        "yellow-fg": "#713f12",
        teal: "#5eead4",
        "teal-fg": "#134e4a",
        indigo: "#818cf8",
        "indigo-fg": "#3730a3",
        pink: "#f472b6",
        "pink-fg": "#831843",
        lime: "#bef264",
        "lime-fg": "#3f6212",
        amber: "#fbbf24",
        "amber-fg": "#92400e",
        rose: "#fb7185",
        "rose-fg": "#9f1239",
        red: {
          DEFAULT: "#ef4444",
          "fg": "#991b1b",
          "50": "#fef2f2",
          "100": "#fee2e2",
          "200": "#fecaca",
          "300": "#fca5a5",
          "400": "#f87171",
          "500": "#ef4444",
          "600": "#dc2626",
          "700": "#b91c1c",
          "800": "#991b1b",
          "900": "#7f1d1d",
          "950": "#450a0a",
        },
        black: {
          DEFAULT: "#141718",
          "50": "#f4f6f7",
          "100": "#e4e9e9",
          "200": "#cbd4d6",
          "300": "#a8b7b8",
          "400": "#7c9294",
          "500": "#617679",
          "600": "#536467",
          "700": "#485356",
          "800": "#3f484b",
          "900": "#383f41",
          "950": "#141718",
          "1000": "#000",
        },

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
