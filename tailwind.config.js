const { hairlineWidth } = require('nativewind/theme');

// Colors live in global.css as HSL channels. `/ <alpha-value>` keeps opacity modifiers
// working (bg-foreground/45 for sheet backdrops) on the tokens Crumbs adds.
const hsl = (name) => `hsl(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // React Native Reusables tokens (unchanged names, Crumbs values)
        border: hsl('border'),
        input: hsl('input'),
        ring: hsl('ring'),
        background: hsl('background'),
        foreground: hsl('foreground'),
        primary: { DEFAULT: hsl('primary'), foreground: hsl('primary-foreground') },
        secondary: { DEFAULT: hsl('secondary'), foreground: hsl('secondary-foreground') },
        destructive: { DEFAULT: hsl('destructive'), foreground: hsl('destructive-foreground') },
        muted: { DEFAULT: hsl('muted'), foreground: hsl('muted-foreground') },
        accent: { DEFAULT: hsl('accent'), foreground: hsl('accent-foreground') },
        popover: { DEFAULT: hsl('popover'), foreground: hsl('popover-foreground') },
        card: { DEFAULT: hsl('card'), foreground: hsl('card-foreground') },

        // Crumbs-only: the returned-crumb moment. Use sparingly, one marigold thing per screen.
        marigold: {
          DEFAULT: hsl('marigold'),
          foreground: hsl('marigold-foreground'),
          tint: hsl('marigold-tint'),
          edge: hsl('marigold-edge'),
        },
        amber: hsl('amber'), // marigold-family text that passes contrast (light and dark)
      },

      // React Native selects fonts by family name, not fontWeight: use font-sans-bold, not font-bold.
      fontFamily: {
        sans: ['BricolageGrotesque_400Regular'],
        'sans-medium': ['BricolageGrotesque_500Medium'],
        'sans-semibold': ['BricolageGrotesque_600SemiBold'],
        'sans-bold': ['BricolageGrotesque_700Bold'],
        // Literata is only for the user's own words (crumb text, layers)
        serif: ['Literata_400Regular'],
        'serif-medium': ['Literata_500Medium'],
        'serif-italic': ['Literata_400Regular_Italic'],
      },

      fontSize: {
        caption: ['13px', '18px'],
        meta: ['14px', '20px'],
        body: ['15px', '22px'],
        label: ['16px', '22px'],
        button: ['17px', '22px'],
        title: ['22px', '28px'],
        sheet: ['24px', '28px'],
        hero: ['30px', '33px'],
        'crumb-sm': ['17px', '24px'], // jar list previews
        'crumb-md': ['20px', '28px'], // crumb above the Add a thought field
        crumb: ['24px', '34px'], // capture field
        'crumb-lg': ['32px', '42px'], // the returned crumb in Rediscovery
      },

      borderRadius: {
        // Reusables components use lg/md/sm; --radius is 16px in global.css
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Crumbs surfaces
        field: '12px',
        card: '18px',
        dialog: '24px',
        sheet: '28px',
      },

      spacing: {
        gutter: '20px', // screen side padding
        touch: '44px', // minimum touch target
        cta: '56px', // primary button height
      },

      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Keep any plugins your current config already lists (e.g. tailwindcss-animate).
  plugins: [require('tailwindcss-animate')],
};
