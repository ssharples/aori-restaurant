import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aori Brand Colors
        aori: {
          green: '#6B7C5F',     // Primary sage/olive green
          dark: '#2C3E2C',      // Dark green for text
          white: '#FFFFFF',     // White for UI elements
          cream: '#F5F5F0',     // Light background
          'green-light': '#8FA384', // Lighter shade of green
          'green-dark': '#5A6B4F',  // Darker shade of green
        },
        primary: {
          DEFAULT: '#6B7C5F',
          green: '#6B7C5F',
          dark: '#2C3E2C',
        },
        accent: {
          white: '#FFFFFF',
          cream: '#F5F5F0',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        logo: ['var(--font-kalam)', 'Segoe Print', 'cursive'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;