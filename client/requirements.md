## Packages
framer-motion | Complex animations for hero sections and transitions
lucide-react | Iconography
clsx | Utility for conditional classes
tailwind-merge | Utility for merging tailwind classes
date-fns | Date formatting
react-day-picker | Date picker for bookings

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  serif: ["Playfair Display", "serif"],
  sans: ["Inter", "sans-serif"],
  arabic: ["Amiri", "serif"], // Assuming a font for Arabic if needed, or fallback
}
colors:
  primary: 
    DEFAULT: "hsl(var(--primary))"
    foreground: "hsl(var(--primary-foreground))"
  gold:
    DEFAULT: "hsl(var(--gold))"
    foreground: "hsl(var(--gold-foreground))"
