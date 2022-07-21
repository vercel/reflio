module.exports = {
  content: [
    "../ui/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/reflio/pages/**/*.{js,ts,jsx,tsx}",
    "../../apps/reflio/templates/**/*.{js,ts,jsx,tsx}",
    "../../apps/reflio-affiliate/pages/**/*.{js,ts,jsx,tsx}",
    "../../apps/reflio-affiliate/templates/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontWeight: {
      hairline: 300,
      'extra-light': 300,
      thin: 300,
      light: 300,
      normal: 300,
      medium: 400,
      semibold: 500,
      bold: 500,
      extrabold: 500,
      'extra-bold': 500,
      black: 500,
    },
    extend: {
      maxWidth: {
        '8xl': '1920px'
      },
      fontFamily: {
        primary: ["TT Interfaces"]
      },
      colors: {
        primary: 'var(--primary)',
        'primary-2': 'var(--primary-2)',
        'primary-3': 'var(--primary-3)',
        secondary: 'var(--secondary)',
        'secondary-2': 'var(--secondary-2)',
        'secondary-3': 'var(--secondary-3)',
        'hover-1': 'var(--hover-1)',
        'hover-2': 'var(--hover-2)',
        'accents-0': 'var(--accents-0)',
        'accents-1': 'var(--accents-1)',
        'accents-2': 'var(--accents-2)',
        'accents-3': 'var(--accents-3)',
        'accents-4': 'var(--accents-4)',
        'accents-5': 'var(--accents-5)',
        'accents-6': 'var(--accents-6)',
        'accents-7': 'var(--accents-7)',
        'accents-8': 'var(--accents-8)',
        'accents-9': 'var(--accents-9)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)'
      },
      boxShadow: {
        'outline-2': '0 0 0 2px var(--accents-2)',
        magical:
          'rgba(0, 0, 0, 0.02) 0px 30px 30px, rgba(0, 0, 0, 0.03) 0px 0px 8px, rgba(0, 0, 0, 0.05) 0px 1px 0px'
      },
      lineHeight: {
        'extra-loose': '2.2'
      },
      animation: {
        'pulse-fast': 'pulse 0.75s linear infinite',
      }
    }
  },
  variants: {
    extend: {
      bg: ['disabled'],
    }
  }
};
