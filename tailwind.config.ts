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
        primary: {
          green: '#6B7C5F', // Primary sage/olive green
          dark: '#2C3E2C',  // Dark green for text
        },
        accent: {
          white: '#FFFFFF',  // White for UI elements
          cream: '#F5F5F0',  // Light background
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        logo: ['Segoe Print', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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