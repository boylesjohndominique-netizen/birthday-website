/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        oxblood: {
          DEFAULT: '#5C1A1B',
          50: '#F7E9E9',
          100: '#EFD2D3',
          200: '#DCA5A7',
          300: '#C9787B',
          400: '#B64B4F',
          500: '#8F2E31',
          600: '#5C1A1B',
          700: '#4A1516',
          800: '#381011',
          900: '#260B0B',
        },
        crimson: {
          DEFAULT: '#B3243C',
          50: '#FCEBEE',
          100: '#F8D2D8',
          200: '#EFA3AF',
          300: '#E67487',
          400: '#DD4560',
          500: '#B3243C',
          600: '#8F1D30',
          700: '#6B1524',
          800: '#470E18',
          900: '#23070C',
        },
        blush: {
          DEFAULT: '#F4D9D6',
          50: '#FDF7F6',
          100: '#F9EAE8',
          200: '#F4D9D6',
          300: '#EBB8B2',
          400: '#E0938B',
        },
        ivory: {
          DEFAULT: '#FBF6EF',
          100: '#FFFDFB',
          200: '#FBF6EF',
          300: '#F3EADC',
        },
        charcoal: {
          DEFAULT: '#2A2321',
          light: '#4A4038',
        },
        gold: {
          DEFAULT: '#C9A15A',
          soft: '#E4C98B',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Karla"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        script: ['"Great Vibes"', '"Segoe Script"', 'cursive'],
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(92, 26, 27, 0.35)',
        card: '0 4px 20px -8px rgba(92, 26, 27, 0.25)',
      },
      borderRadius: {
        keepsake: '1.25rem',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1, transform: 'scaleY(1)' },
          '50%': { opacity: 0.85, transform: 'scaleY(0.96)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '10%': { opacity: 1 },
          '100%': { transform: 'translateY(-40px)', opacity: 0 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        flicker: 'flicker 2.4s ease-in-out infinite',
        floatUp: 'floatUp 1.6s ease-out forwards',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};
