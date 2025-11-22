import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'bebas': ['Bebas Neue', 'sans-serif'],
        'blackops': ['Black Ops One', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "oil-amber": "hsl(var(--oil-amber))",
        "oil-bronze": "hsl(var(--oil-bronze))",
        "oil-gold": "hsl(var(--oil-gold))",
        "oil-gold-light": "hsl(var(--oil-gold-light))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0"
          },
          "50%": {
            transform: "scale(1.05)"
          },
          "70%": {
            transform: "scale(0.9)"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px currentColor"
          },
          "50%": {
            boxShadow: "0 0 20px currentColor, 0 0 30px currentColor"
          }
        },
        "gold-glow": {
          "0%": {
            boxShadow: "0 0 20px hsl(45 100% 65% / 0.3)"
          },
          "50%": {
            boxShadow: "0 0 40px hsl(45 100% 65% / 0.6), 0 0 60px hsl(48 100% 75% / 0.3)"
          },
          "100%": {
            boxShadow: "0 0 20px hsl(45 100% 65% / 0.3)"
          }
        },
        "spin-slow": {
          "from": {
            transform: "rotate(0deg)"
          },
          "to": {
            transform: "rotate(360deg)"
          }
        },
        "shine": {
          "0%": {
            transform: "translateX(-100%)"
          },
          "100%": {
            transform: "translateX(100%)"
          }
        },
        "bubble": {
          "0%": {
            transform: "translateY(0) scale(1)",
            opacity: "0"
          },
          "10%": {
            opacity: "0.6"
          },
          "90%": {
            opacity: "0.6"
          },
          "100%": {
            transform: "translateY(-400px) scale(0.5)",
            opacity: "0"
          }
        },
        "flame-flicker": {
          "0%, 100%": {
            filter: "brightness(1) contrast(1)",
            textShadow: "0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 146, 60, 0.6), 0 0 60px rgba(251, 146, 60, 0.4)"
          },
          "25%": {
            filter: "brightness(1.2) contrast(1.1)",
            textShadow: "0 0 25px rgba(251, 191, 36, 1), 0 0 50px rgba(251, 146, 60, 0.8), 0 0 70px rgba(251, 146, 60, 0.5)"
          },
          "50%": {
            filter: "brightness(0.9) contrast(0.95)",
            textShadow: "0 0 15px rgba(251, 191, 36, 0.7), 0 0 35px rgba(251, 146, 60, 0.5), 0 0 50px rgba(251, 146, 60, 0.3)"
          },
          "75%": {
            filter: "brightness(1.15) contrast(1.08)",
            textShadow: "0 0 30px rgba(251, 191, 36, 0.95), 0 0 55px rgba(251, 146, 60, 0.75), 0 0 80px rgba(251, 146, 60, 0.45)"
          }
        },
        "gold-shine": {
          "0%": {
            backgroundPosition: "-200% center"
          },
          "100%": {
            backgroundPosition: "200% center"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "gold-glow": "gold-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "shine": "shine 2s ease-in-out infinite",
        "bubble": "bubble 4s ease-in infinite",
        "flame-flicker": "flame-flicker 3s ease-in-out infinite",
        "gold-shine": "gold-shine 3s linear infinite",
      },
      animationDelay: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }: any) {
      const newUtilities = {
        '.hover-scale': {
          '@apply transition-transform duration-200 hover:scale-105': {},
        },
        '.animation-delay-100': {
          'animation-delay': '100ms',
        },
        '.animation-delay-200': {
          'animation-delay': '200ms',
        },
        '.animation-delay-300': {
          'animation-delay': '300ms',
        },
        // Touch-friendly minimum sizes for mobile
        '.touch-target': {
          '@apply min-h-[44px] min-w-[44px]': {}, // iOS minimum
        },
        '.touch-target-lg': {
          '@apply min-h-[48px] min-w-[48px]': {}, // Android minimum
        },
        // Active state for touch feedback
        '.touch-feedback': {
          '@apply active:scale-95 transition-transform duration-100': {},
        },
        // Text that adapts for readability on mobile
        '.text-mobile': {
          '@apply text-sm sm:text-base': {},
        },
        '.text-mobile-lg': {
          '@apply text-base sm:text-lg': {},
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
