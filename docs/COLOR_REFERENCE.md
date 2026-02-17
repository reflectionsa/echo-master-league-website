# EML Color Reference

This document provides a reference for the colors used in the Echo Master League application before the color system was centralized.

## Commit Reference

**Commit:** `afc9ad54e1a0872fca9647dc1b7d024fd5766659`  
**Date:** Mon Feb 16 18:27:34 2026 -0500  
**Message:** style: format code for consistency across components

## Color Systems

The application has evolved through two color systems:

1. **Chakra UI Color Tokens** (Original) - Located in `src/theme/colors-chakra.js`
2. **Centralized Hex Colors** (Current) - Located in `src/theme/colors.js`

---

## Original Chakra UI Colors (from commit afc9ad54e1a0872fca9647dc1b7d024fd5766659)

### Background Colors

| Usage | Dark Mode | Light Mode | Purpose |
|-------|-----------|------------|---------|
| Main App Background | `gray.950` | `gray.50` | Root background color |
| Card Background | `gray.900` | `white` | Primary card surfaces |
| Elevated Headers | `purple.900` | - | Card headers, special sections |
| Table Headers | `gray.800` | - | Table header backgrounds |
| Special Rows (Top 3) | `gray.850` | - | Highlighted table rows |
| Navigation Overlay | `blackAlpha.600` | `whiteAlpha.800` | Semi-transparent nav |
| Stronger Overlay | `blackAlpha.700` | `whiteAlpha.900` | Drawer backgrounds |
| Subtle Overlays | `whiteAlpha.100` | `blackAlpha.100` | Button backgrounds |
| Blur Effects | `orange.500/10` | `blue.500/10` | Decorative blur circles |

### Text Colors

| Usage | Dark Mode | Light Mode | Context |
|-------|-----------|------------|---------|
| Primary Text | `white` | `gray.900` | Headings, important text |
| Secondary Text | `gray.300` | `gray.700` | Supporting text |
| Muted Text | `gray.400` | `gray.600` | Table headers, labels |
| Subtle Text | `gray.500` | `gray.600` | Timestamps, metadata |
| Link/Clickable | `blue.400` | `blue.600` | Team names, clickable text |

### Accent Colors

| Usage | Color Token | Where Used |
|-------|-------------|------------|
| Primary Orange | `orange.300` | Hero gradient text (dark) |
| Orange Border | `orange.400` | Hero card border (dark) |
| Orange Mid | `orange.500` | Blur effects |
| Orange Strong/Bronze | `orange.600` | 3rd place trophy, light mode |
| Primary Blue | `blue.400` | Team names, links |
| Blue Mid | `blue.500` | Hero border (light mode) |
| Blue Strong | `blue.600` | Hero text (light mode) |
| Purple Soft | `purple.300` | Trophy icons, score text |
| Purple Mid | `purple.400` | Team names (alt) |
| Purple Strong | `purple.600` | Light mode accents |
| Purple Background | `purple.900` | Card headers |
| Purple Border | `purple.800` | Border for purple sections |

### Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| Live | `red.500` | Pulsing indicator on live matches |
| Live Border | `red.600` | Border color for live match cards |
| Scheduled | `green.500` | Scheduled match badges |
| Completed | `blue.500` | Completed match status |

### Trophy/Award Colors

| Place | Color | Icon |
|-------|-------|------|
| 1st Place | `yellow.400` | 🏆 Gold |
| 2nd Place | `gray.400` | 🏆 Silver |
| 3rd Place | `orange.600` | 🏆 Bronze |

### Border Colors

| Usage | Dark Mode | Light Mode |
|-------|-----------|------------|
| Standard Borders | `gray.800` | `gray.200` |
| Medium Borders | `gray.700` | `gray.200` |
| Accent Border | `orange.400` | `blue.500` |
| Transparent Border (Nav) | `whiteAlpha.200` | `blackAlpha.200` |

### Gradient Backgrounds

#### Hero Section (Dark Mode)

```css
linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)
```

- Start: `#0f172a` (slate-950 equivalent)
- Mid: `#1e1b4b` (indigo-950 equivalent)  
- End: `#312e81` (indigo-900 equivalent)

#### Hero Section (Light Mode)

```css
linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)
```

- Start: `#dbeafe` (blue-100)
- Mid: `#bfdbfe` (blue-200)
- End: `#93c5fd` (blue-300)

#### Text Gradients

**Dark Mode:**

```css
linear(to-r, orange.300, blue.400)
```

Light Mode:**

```css
linear(to-r, blue.600, orange.500)
```

---

## Component-Specific Color Usage (from commit)

### MatchCard.jsx

- Background: `gray.900`
- Border: `gray.800` (default), `red.600` (live)
- Live Pulse: `red.500`
- Team Names: `blue.400` with `blue.300` hover
- Score Box: `purple.900` background, `purple.700` border, `purple.300` text
- VS Divider: `gray.600`
- Separator: `gray.800`
- Timestamp: `gray.500`

### Navigation.jsx

- Background: `blackAlpha.600` (dark), `whiteAlpha.800` (light)
- Border: `whiteAlpha.200` (dark), `blackAlpha.200` (light)
- Text: `white` (dark), `gray.900` (light)
- Drawer Background: `gray.900` (dark), `white` (light)
- Drawer Border: `gray.700` (dark), `gray.200` (light)
- Section Headers: `gray.300` (dark), `gray.700` (light)
- Active Link: `purple.400` (dark), `purple.600` (light)

### StandingsTable.jsx

- Card Background: `gray.900`
- Card Border: `gray.800`
- Header Background: `purple.900`
- Header Border: `purple.800`
- Trophy Icon: `purple.300`
- Table Header: `gray.800`
- Column Headers: `gray.400`
- Top 3 Rows: `gray.850`
- Rank Number: `gray.500`
- Team Name: `purple.400`
- Win Count: `purple.400`
- Empty State: `gray.500`

### Hero.jsx

- Background: Gradient (see above)
- Blur Circles: `orange.500/10` and `blue.500/10`
- Card Background: `whiteAlpha.100` (dark), `blackAlpha.100` (light)
- Card Border: `orange.400` (dark), `blue.500` (light)
- Heading Gradient: `linear(to-r, orange.300, blue.400)` (dark)
- Subtitle: `gray.400` (dark), `gray.600` (light)
- Stat Card: `whiteAlpha.100` (dark), `blackAlpha.100` (light)
- Stat Value: `orange.300` (dark), `blue.600` (light)
- Stat Label: `gray.400` (dark), `gray.600` (light)

---

## Migration Notes

To switch between color systems:

1. **Using Chakra Colors:** Import from `src/theme/colors-chakra.js`
2. **Using Hex Colors:** Import from `src/theme/colors.js`

The files are structured with the same export name (`emlColors`), making them easily swappable.

### Example Swap

**Before (Chakra):**

```javascript
import { emlColors } from './theme/colors-chakra.js';
// Uses: bg={emlColors.bgPrimary} → "gray.950"
```

**After (Hex):**

```javascript
import { emlColors } from './theme/colors.js';
// Uses: bg={emlColors.bgPrimary} → "#0f172a"
```

---

## Chakra UI Color Scale Reference

For reference, here are the actual hex values of the Chakra UI colors used:

| Token | Hex Value | Description |
|-------|-----------|-------------|
| `gray.950` | `#0a0a0b` | Near black |
| `gray.900` | `#171717` | Very dark gray |
| `gray.850` | `#1f1f1f` | Dark gray (custom) |
| `gray.800` | `#262626` | Dark gray |
| `gray.700` | `#404040` | Medium-dark gray |
| `gray.600` | `#525252` | Medium gray |
| `gray.500` | `#737373` | Mid gray |
| `gray.400` | `#a3a3a3` | Light gray |
| `gray.300` | `#d4d4d4` | Lighter gray |
| `gray.200` | `#e5e5e5` | Very light gray |
| `gray.50` | `#fafafa` | Almost white |
| `orange.300` | `#fdba74` | Light orange |
| `orange.400` | `#fb923c` | Medium orange |
| `orange.500` | `#f97316` | Orange |
| `orange.600` | `#ea580c` | Dark orange |
| `blue.300` | `#93c5fd` | Light blue |
| `blue.400` | `#60a5fa` | Medium blue |
| `blue.500` | `#3b82f6` | Blue |
| `blue.600` | `#2563eb` | Dark blue |
| `purple.300` | `#d8b4fe` | Light purple |
| `purple.400` | `#c084fc` | Medium purple |
| `purple.600` | `#9333ea` | Dark purple |
| `purple.800` | `#6b21a8` | Very dark purple |
| `purple.900` | `#581c87` | Nearly black purple |
| `red.500` | `#ef4444` | Red |
| `red.600` | `#dc2626` | Dark red |
| `yellow.400` | `#facc15` | Yellow/gold |

---

**Last Updated:** February 16, 2026  
**Maintained By:** EML Development Team
