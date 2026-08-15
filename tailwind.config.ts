import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--color-bg)",
          subtle: "var(--color-bg-subtle)",
          elevated: "var(--color-bg-elevated)",
          overlay: "var(--color-bg-overlay)",
        },
        reader: {
          bg: "var(--color-reader-bg)",
          surface: "var(--color-reader-surface)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          subtle: "var(--color-surface-subtle)",
          elevated: "var(--color-surface-elevated)",
          active: "var(--color-surface-active)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          active: "var(--color-accent-active)",
          subtle: "var(--color-accent-subtle)",
          contrast: "var(--color-accent-contrast)",
        },
        status: {
          success: "var(--color-status-success)",
          warning: "var(--color-status-warning)",
          error: "var(--color-status-error)",
          info: "var(--color-status-info)",
        },
      },
      fontFamily: {
        sans: ["var(--font-family-sans)"],
        mono: ["var(--font-family-mono)"],
      },
      fontSize: {
        "12": ["var(--font-size-12)", { lineHeight: "var(--line-height-12)" }],
        "14": ["var(--font-size-14)", { lineHeight: "var(--line-height-14)" }],
        "16": ["var(--font-size-16)", { lineHeight: "var(--line-height-16)" }],
        "20": ["var(--font-size-20)", { lineHeight: "var(--line-height-20)" }],
        "28": ["var(--font-size-28)", { lineHeight: "var(--line-height-28)" }],
        "36": ["var(--font-size-36)", { lineHeight: "var(--line-height-36)" }],
      },
      spacing: {
        "4px": "var(--spacing-4)",
        "8px": "var(--spacing-8)",
        "12px": "var(--spacing-12)",
        "16px": "var(--spacing-16)",
        "24px": "var(--spacing-24)",
        "32px": "var(--spacing-32)",
        "48px": "var(--spacing-48)",
        "64px": "var(--spacing-64)",
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      maxWidth: {
        container: "var(--container-max-width)",
        reader: "var(--reader-max-width)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        "card-hover": "var(--shadow-card-hover)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
