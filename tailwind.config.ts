import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        '#F5F0E8',
        surface:   '#FFFFFF',
        border:    '#1A1A2E',
        primary: {
          DEFAULT: '#FF6B2B',
          dark:    '#CC4A10',
          light:   '#FFF0E8',
          muted:   '#FFD5BC',
        },
        secondary: '#1A1A2E',
        navy:      '#1A1A2E',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card:   '20px',
        btn:    '12px',
        input:  '10px',
      },
      boxShadow: {
        card:    '6px 6px 0px #1A1A2E',
        'card-hover': '8px 8px 0px #1A1A2E',
        btn:     '4px 4px 0px #1A1A2E',
        'btn-hover': '6px 6px 0px #1A1A2E',
        'btn-active': '2px 2px 0px #1A1A2E',
        'card-success': '6px 6px 0px #86EFAC',
        'card-danger':  '6px 6px 0px #FCA5A5',
        'card-warning': '6px 6px 0px #FCD34D',
        'card-info':    '6px 6px 0px #93C5FD',
        'card-primary': '6px 6px 0px #FF6B2B',
      },
    },
  },
  plugins: [],
};
export default config;
