# 00 — Design System (SplitBeam)

## Brand & Tokens
- **App Name:** SplitBeam

### Core Brand
- **Primary (Brand):** Indigo — `#4F46E5` (600)
- **Focus Ring:** `#818CF8` (Indigo 400)
- **Success:** Emerald — `#047857` (700)
- **Warning:** Amber — `#D97706` (600)
- **Error:** Rose — `#DC2626` (600)
- **Info:** Sky — `#0369A1` (700)

### Accents
- **Coral:** `#E11D48` (Rose 600)
- **Jade:** `#047857` (Emerald 700)
- **Cobalt:** `#1D4ED8` (Blue 700)
- **Plum:** `#6D28D9` (Purple 700)
- **Saffron:** `#D97706` (Amber 600)
- **Teal:** `#0F766E` (Teal 700)

### Neutrals — Light
- **Background:** `#F8FAFC` (Slate 50)
- **Card:** `#FFFFFF`
- **Border:** `#E2E8F0` (Slate 200)
- **Text Primary:** `#0F172A` (Slate 900)
- **Text Secondary:** `#334155` (Slate 700)
- **Text Tertiary:** `#64748B` (Slate 500)

### Neutrals — Dark
- **Background:** `#0F172A` (Slate 900)
- **Card:** `#1F2937` (Slate 800)
- **Border:** `#374151` (Slate 700)
- **Text Primary:** `#E5E7EB` (Slate 200)
- **Text Secondary:** `#CBD5E1` (Slate 300)
- **Text Tertiary:** `#94A3B8` (Slate 400)

### Currency
- Show currency symbols when known; fallback to ISO code. Format with `Intl.NumberFormat` using currency-specific decimal places.

## Component Inventory
- Navigation (top bar with icons, mobile overflow), Hero, Tiles, Cards, Tables, Forms, Chips, Badges, Avatars, Uploads.
- Interactive tiles: `role="button"`, `tabIndex=0`, Enter/Space activation.
- Tables: right-aligned numeric columns; focus rings; keyboard activation.

## Motion
- Subtle hover-lift on tiles; respect reduced motion.

## Dark Mode
- Use dark neutrals; reduce accent saturation to maintain contrast; replace heavy shadows with border overlays.

## Iconography
- Lucide icon set; consistent 16–20px sizing.
