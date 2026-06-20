# Theme System Annotation Report

Generated: 2026-06-19

---

## 1. `/src/theme/colors.js`

### Purpose
Central color definition module exporting dark-mode, light-mode, color-blind-safe, and per-scheme color palettes for use across the application.

### Color Palette

#### `emlColors` (dark defaults)
| Token | Value |
|---|---|
| bgPrimary | `#0a0a0a` |
| bgSecondary | `#111111` |
| bgTertiary | `#1a1a1a` |
| bgCard | `#0d0d0d` |
| bgElevated | `#1e1e1e` |
| bgHover | `#242424` |
| accentOrange | `#ff6b2b` |
| accentPink | `#ff8c42` |
| accentRose | `#ef4444` |
| accentBlue | `#00bfff` |
| accentCyan | `#00e5ff` |
| accentPurple | `#7c3aed` |
| textPrimary | `#ffffff` |
| textSecondary | `#e5e7eb` |
| textMuted | `#9ca3af` |
| textSubtle | `#6b7280` |
| statusLive | `#ef4444` |
| statusScheduled | `#10b981` |
| statusCompleted | `#3b82f6` |
| statusDisputed | `#f59e0b` |
| borderLight | `rgba(255, 255, 255, 0.07)` |
| borderMedium | `rgba(255, 255, 255, 0.12)` |
| borderAccent | `#ff6b2b` |

#### `emlColorsLight`
| Token | Value |
|---|---|
| bgPrimary | `#f8fafc` |
| bgSecondary | `#e0e7ff` |
| bgTertiary | `#c7d2fe` |
| bgCard | `#ffffff` |
| bgElevated | `#f1f5f9` |
| bgHover | `#e2e8f0` |
| accentOrange | `#f97316` |
| accentPink | `#ec4899` |
| accentRose | `#ef4444` |
| accentBlue | `#0ea5e9` |
| accentCyan | `#06b6d4` |
| accentPurple | `#9333ea` |
| textPrimary | `#0f172a` |
| textSecondary | `#334155` |
| textMuted | `#64748b` |
| textSubtle | `#94a3b8` |
| statusLive | `#ef4444` |
| statusScheduled | `#10b981` |
| statusCompleted | `#3b82f6` |
| statusDisputed | `#a855f7` |
| borderLight | `rgba(0, 0, 0, 0.1)` |
| borderMedium | `rgba(0, 0, 0, 0.15)` |
| borderAccent | `#f97316` |

#### `colorBlindSemanticColors`
| Token | Value |
|---|---|
| win | `#2563eb` |
| loss | `#f97316` |
| winBadge | `blue` (Chakra colorPalette) |
| lossBadge | `orange` (Chakra colorPalette) |
| active | `blue` |
| inactive | `orange` |
| live | `#f97316` |
| error | `#f97316` |

#### `defaultSemanticColors`
| Token | Value |
|---|---|
| win | `#22c55e` |
| loss | `#ef4444` |
| winBadge | `green` |
| lossBadge | `red` |
| active | `green` |
| inactive | `red` |
| live | `#ef4444` |
| error | `#f87171` |

#### `COLOR_THEMES` (per-scheme palettes)
Six schemes defined: `g2`, `pink`, `tan`, `camo`, `crimson`, `blue`. Each contains a `dark` and `light` sub-object with the same 22 tokens as `emlColors`/`emlColorsLight`, plus `label` and `preview` (3-color array).

### Theme Modes
- Dark and light per scheme, resolved via `getThemedColors(theme, colorBlind)`.
- Color-blind mode overlays `colorBlindSemanticColors` onto any scheme.

### Animation Patterns
None.

### SMELL Annotations

- **[DUPLICATION]** `emlColors` (line 4) and `COLOR_THEMES.g2.dark` (line 121) contain identical values for all 22 tokens. The standalone `emlColors` object is redundant with `COLOR_THEMES.g2.dark`.
- **[DUPLICATION]** `emlColorsLight` (line 40) and `COLOR_THEMES.g2.light` (line 145) contain identical values for all 22 tokens except `borderLight`: `emlColorsLight` uses `rgba(0, 0, 0, 0.1)` (line 70), `COLOR_THEMES.g2.light` uses `rgba(0,0,0,0.08)` (line 166).
- **[INCONSISTENCY]** `emlColorsLight.borderLight` is `rgba(0, 0, 0, 0.1)` (line 70) but `COLOR_THEMES.g2.light.borderLight` is `rgba(0,0,0,0.08)` (line 166). Different opacity values for the same logical token.
- **[NAMING]** `accentPink` in `emlColors` is `#ff8c42` (line 15), which is a soft orange, not pink. In `emlColorsLight`, `accentPink` is `#ec4899` (line 51), which is pink. The dark-mode value contradicts the token name.
- **[INCONSISTENCY]** `statusDisputed` differs between modes with no comment: dark is `#f59e0b` (amber, line 31), light is `#a855f7` (purple, line 67). The comment on line 63 says "same as dark mode" for status colors, but `statusDisputed` is not the same.
- **[UNUSED]** `emlColorsLight` is exported (line 40) but never imported by any of the other eight files under review. `system.js` imports only `emlColors`. `getThemedColors()` reads from `COLOR_THEMES`, not from `emlColorsLight`.

---

## 2. `/src/theme/colors-chakra.js`

### Purpose
Legacy Chakra UI color token file predating the centralized hex-based system in `colors.js`.

### Color Palette
All values are Chakra UI semantic tokens (e.g., `gray.950`, `orange.300`), not hex. Key tokens:

| Token | Value |
|---|---|
| bgPrimary | `gray.950` |
| bgPrimaryLight | `gray.50` |
| bgSecondary | `gray.900` |
| bgTertiary | `gray.850` |
| bgCard | `gray.900` |
| bgElevated | `purple.900` |
| bgHover | `gray.800` |
| accentOrange | `orange.300` |
| accentBlue | `blue.400` |
| accentPurple | `purple.300` |
| textPrimary | `white` |
| textSecondary | `gray.300` |
| textMuted | `gray.400` |
| textSubtle | `gray.600` |
| statusLive | `red.500` |
| statusScheduled | `green.500` |
| statusCompleted | `blue.500` |
| statusDisputed | `purple.500` |
| borderLight | `gray.800` |
| borderAccent | `orange.400` |
| awardGold | `yellow.400` |
| awardSilver | `gray.400` |
| awardBronze | `orange.600` |
| gradientHeroDark | `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)` |
| gradientHeroLight | `linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)` |
| gradientTextDark | `linear(to-r, orange.300, blue.400)` |
| gradientTextLight | `linear(to-r, blue.600, orange.500)` |

Additional tokens not present in `colors.js`: `bgPrimaryLight`, `bgOverlayDark`, `bgOverlayDarkStrong`, `bgOverlayLight`, `bgOverlayLightStrong`, `bgSubtleDark`, `bgSubtleLight`, `bgBlurDark`, `bgBlurLight`, `accentOrangeAlt`, `accentOrangeMid`, `accentOrangeStrong`, `accentBlueMid`, `accentBlueStrong`, `accentPurpleMid`, `accentPurpleStrong`, `accentPurpleBg`, `accentPurpleBorder`, `textPrimaryLight`, `textSecondaryLight`, `textMutedAlt`, `awardGold`, `awardSilver`, `awardBronze`, `borderLightMode`, `borderMediumLight`, `borderAccentLight`, `borderTransparentDark`, `borderTransparentLight`, all gradient tokens.

### Theme Modes
Light/dark handled via a `themed(isDark, darkValue, lightValue)` helper (line 78). Tokens are flat (not nested under dark/light).

### Animation Patterns
None.

### SMELL Annotations

- **[DUPLICATION]** This file re-exports `emlColors` under the same name as `colors.js` (line 5). Two files export `const emlColors` with incompatible value types (Chakra tokens vs. hex strings). Import path determines which is used.
- **[DEAD CODE]** File header (line 2) says "contains the original Chakra UI color tokens used before centralization." No other file under review imports from this path. If nothing else in the project imports it, the file is dead.
- **[MISSING TOKENS]** `colors.js` defines `accentCyan` and `accentRose`; this file does not. Conversely, this file defines `awardGold`, `awardSilver`, `awardBronze`, overlay tokens, and gradient tokens that `colors.js` does not.
- **[INCONSISTENCY]** `bgElevated` is `purple.900` here (line 11) vs. `#1e1e1e` (a neutral dark gray) in `colors.js` (line 10). These are visually different colors.
- **[INCONSISTENCY]** `statusDisputed` is `purple.500` here (line 53) vs. `#f59e0b` (amber) in `colors.js` dark (line 31). Different hues for the same semantic concept.

---

## 3. `/src/theme/system.js`

### Purpose
Creates the Chakra UI `system` instance by mapping `emlColors` (from `colors.js`) into Chakra design tokens under the `eml.*` namespace.

### Color Palette
No new colors defined. Maps 22 tokens from `emlColors` into Chakra token paths: `eml.bg.primary`, `eml.accent.orange`, `eml.text.primary`, `eml.status.live`, `eml.border.light`, etc.

### Theme Modes
Single mode only. The system is created from `emlColors` (dark-mode defaults). There is no conditional token resolution for light mode.

### Animation Patterns
None.

### SMELL Annotations

- **[DARK-ONLY]** Chakra tokens are bound to `emlColors` (dark values) at lines 13-43. Light-mode values from `emlColorsLight` or `COLOR_THEMES[x].light` are never registered. Components using `eml.*` tokens will always get dark-mode colors regardless of active theme mode.
- **[INCOMPLETE]** Semantic colors (`defaultSemanticColors`, `colorBlindSemanticColors`) are not mapped into Chakra tokens. Components using the Chakra system cannot access them via token paths.

---

## 4. `/src/styles.css`

### Purpose
Global CSS providing base layout, scrollbar theming, scroll performance optimizations, and a 3D card-flip animation.

### Color Palette
| Location | Color | Value |
|---|---|---|
| line 13 | body/html background | `#0a0a0a` |
| line 23 | body color | `#ffffff` |
| line 41 | close-button color | `rgba(255, 255, 255, 0.7)` |
| line 46 | close-button hover color | `#ffffff` |
| line 47 | close-button hover bg | `rgba(255, 255, 255, 0.1)` |
| line 52 | CSS variable `--eml-accent` | `#ff6b2b` |

### Theme Modes
- Dark mode is the hardcoded default (background `#0a0a0a`, text `#ffffff`).
- Light mode is handled via `body.eml-light` class selector (lines 84-94), affecting only scrollbar opacity adjustments.
- Close-button styles use `!important` and are locked to white-on-dark regardless of theme (lines 40-48).

### Animation Patterns
| Animation | Type | Details |
|---|---|---|
| 3D flip card | CSS `transition` | `transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)` on `.eml-flip-inner`, triggered by `:hover` / `:focus-within`. Uses `perspective: 1100px`, `transform-style: preserve-3d`, `backface-visibility: hidden`. Lines 124-150. |

### SMELL Annotations

- **[HARDCODED]** Background `#0a0a0a` is hardcoded on both `html` (line 13) and `body` (line 22). This matches `emlColors.bgPrimary` and `COLOR_THEMES.g2.dark.bgPrimary` but will not update when a non-g2 theme is selected.
- **[HARDCODED]** `--eml-accent` fallback is `#ff6b2b` (line 52), matching g2 dark `accentOrange`. Comment says "overridden by JS" but no mechanism in these files sets it for other schemes.
- **[THEME-BLIND]** Close-button styles force white text via `!important` (line 41). In light mode these will be white-on-light, likely invisible.

---

## 5. `/src/components/FloatingShapes.jsx`

### Purpose
Renders a full-screen ambient particle background using tsparticles, with per-theme color palettes and shape sets.

### Color Palette

#### `THEME_CONFIGS` (local, lines 10-35)
| Scheme | Colors |
|---|---|
| pink | `#ff4d9d`, `#ff80bf`, `#c084fc`, `#f0abfc`, `#ff99cc`, `#e040fb` |
| tan | `#c9a96e`, `#d4b896`, `#a08860`, `#c9a040`, `#e8d0a0`, `#b09060` |
| blue | `#1e6fff`, `#38bdf8`, `#00e5ff`, `#818cf8`, `#60a5fa`, `#93c5fd` |
| camo | `#8aaa3a`, `#aac85a`, `#5a8a5a`, `#7aaa7a`, `#4a6a28`, `#9ab050` |
| crimson | `#dc143c`, `#ff4d6d`, `#ff0030`, `#c084fc`, `#f472b6`, `#e0194a` |
| g2 | `#ff6b2b`, `#00bfff`, `#7c3aed`, `#10b981`, `#ef4444`, `#a855f7` |

### Theme Modes
- Accepts `colorScheme` and `mode` props.
- `mode` controls only `mixBlendMode`: `multiply` for light, `screen` for dark (line 91).
- Particle colors are drawn from the scheme only; they are the same in dark and light.

### Animation Patterns
| Animation | Type | Details |
|---|---|---|
| Particle movement | tsparticles | Speed 0.2-0.7, direction `none`, bounce at edges. 14 particles. Lines 68-72. |
| Particle rotation | tsparticles | 0-360 degrees, speed 2, async. Lines 73-80. |
| Particle opacity | tsparticles | Static range 0.05-0.1, animation disabled. Lines 59-61. |

### SMELL Annotations

- **[DUPLICATION]** `THEME_CONFIGS` (lines 10-35) duplicates color values already present in `COLOR_THEMES` in `colors.js`. For example, `THEME_CONFIGS.g2.colors` lists `#ff6b2b`, `#00bfff`, `#7c3aed` which are `COLOR_THEMES.g2.dark.accentOrange`, `.accentBlue`, `.accentPurple`. Two sources of truth for the same per-theme colors.
- **[EXTRA COLORS]** Several colors in `THEME_CONFIGS` do not appear in `COLOR_THEMES`: `#ff99cc` (pink, line 14), `#e040fb` (pink, line 14), `#b09060` (tan, line 18), `#93c5fd` (blue, line 20), `#9ab050` (camo, line 24), `#e0194a` (crimson, line 28), `#a855f7` (g2, line 33). These are particle-only colors with no corresponding token.
- **[INCONSISTENCY]** `THEME_CONFIGS.g2.colors` includes `#10b981` (statusScheduled green) and `#ef4444` (statusLive red) as particle colors. These are status colors in `colors.js`, not accent colors.

---

## 6. `/src/components/ParticlePulseDot.jsx`

### Purpose
Renders a pulsing red dot live indicator using tsparticles, with a static red circle fallback while the engine loads.

### Color Palette
| Location | Color | Value |
|---|---|---|
| line 19 | particle color | `#ef4444` |
| line 78 | fallback dot background | `#ef4444` |
| line 100 | static center dot | `#ef4444` |

### Theme Modes
None. All three color references are hardcoded `#ef4444`. No theme-aware behavior.

### Animation Patterns
| Animation | Type | Details |
|---|---|---|
| Opacity pulse | tsparticles | Fade from max (0.85) to min (0), speed 1.2, destroy at min. Lines 22-30. |
| Size growth | tsparticles | Grow from min (2) to max (6), speed 4, destroy at max. Lines 32-40. |
| Particle drift | tsparticles | Speed 0.5-1.5, random direction, destroyed at edges. Lines 42-49. |
| Emitter | tsparticles | Center position, rate: 2 particles every 0.4s. Lines 51-56. |

### SMELL Annotations

- **[HARDCODED]** `#ef4444` appears three times (lines 19, 78, 100) instead of referencing `emlColors.statusLive` or equivalent token. If the live-indicator color is changed centrally, this component will not update.
- **[THEME-BLIND]** The crimson theme uses `#ff0030` for `statusLive` (colors.js line 345), blue uses `#ef4444` (line 407), pink uses `#ff2d78` (line 191). This component always emits `#ef4444` regardless of active theme.

---

## 7. `/src/components/ThemePicker.jsx`

### Purpose
Dropdown menu component for selecting a color scheme (g2, pink, tan, camo, crimson, blue) and mode (dark/light).

### Color Palette
No colors defined locally. Consumes `getThemedColors(theme)` from `colors.js` and uses the returned palette for all styling.

### Theme Modes
Renders dark and light mode toggle buttons (lines 86-123). Calls `onModeChange('dark')` or `onModeChange('light')`.

### Animation Patterns
| Animation | Type | Details |
|---|---|---|
| Menu fade-in | Inline CSS `@keyframes` | `fadeIn` from `opacity: 0; translateY(-6px)` to `opacity: 1; translateY(0)`, duration 0.15s ease. Lines 11-14, applied at line 39. |
| Button transitions | Chakra `transition` prop | `all 0.15s ease` on scheme buttons and mode buttons. |

### SMELL Annotations

- **[INLINE KEYFRAMES]** The `@keyframes fadeIn` is injected via a `<style>` tag inside the component (lines 10-15). This is re-injected every render. The animation name is generic and could collide with other `fadeIn` definitions.

---

## 8. `/src/components/ThemeToggle.jsx`

### Purpose
Floating icon button that toggles between dark and light mode, using Sun/Moon icons from lucide-react.

### Color Palette
No colors defined locally. Consumes `getThemedColors(theme)` for all styling.

### Theme Modes
Determines current mode via `theme.endsWith('-dark') || theme === 'dark'` (line 7). Passes mode to `onToggle` callback. Displays Sun icon in dark mode, Moon icon in light mode.

### Animation Patterns
| Animation | Type | Details |
|---|---|---|
| Hover rotate | Chakra `_hover` | `transform: rotate(180deg)` on hover. `transition: all 0.4s ease`. Lines 22-23. |

### SMELL Annotations

- **[REDUNDANT]** This component duplicates the mode-toggle functionality of `ThemePicker.jsx` (which has its own dark/light buttons at lines 86-123). Two independent UI surfaces for the same action.
- **[FRAGILE PARSING]** Mode detection uses string matching: `theme.endsWith('-dark') || theme === 'dark'` (line 7). This assumes theme strings follow the pattern `{scheme}-{mode}`. The bare string `'dark'` is special-cased. If a scheme name ends in `dark` (e.g., hypothetical `pitch-dark`), this would misparse.

---

## 9. `/src/utils/particlesInit.js`

### Purpose
Registers the slim tsparticles bundle with the engine for use by `FloatingShapes` and `ParticlePulseDot`.

### Color Palette
None.

### Theme Modes
None.

### Animation Patterns
None (initialization only).

### SMELL Annotations
None.

---

## Cross-File SMELL Summary

| # | Category | Files | Fact |
|---|---|---|---|
| 1 | DUPLICATION | `colors.js` | `emlColors` (line 4) duplicates `COLOR_THEMES.g2.dark` (line 121). `emlColorsLight` (line 40) nearly duplicates `COLOR_THEMES.g2.light` (line 145) except `borderLight` opacity differs (0.1 vs 0.08). |
| 2 | DUPLICATION | `colors.js`, `colors-chakra.js` | Both export `const emlColors` with the same name but incompatible value types (hex vs. Chakra tokens). |
| 3 | DUPLICATION | `colors.js`, `FloatingShapes.jsx` | Per-theme particle colors in `THEME_CONFIGS` (FloatingShapes lines 10-35) restate values from `COLOR_THEMES` (colors.js lines 116-441) without importing them. |
| 4 | DEAD CODE | `colors-chakra.js` | Entire file described as legacy (line 2). No file under review imports from it. |
| 5 | DEAD CODE | `colors.js` | `emlColorsLight` is exported but not imported by any file under review. |
| 6 | DARK-ONLY | `system.js` | Chakra tokens are bound exclusively to dark-mode values (lines 13-43). Light-mode tokens are never registered. |
| 7 | HARDCODED | `styles.css` | Background `#0a0a0a` (lines 13, 22) and `--eml-accent: #ff6b2b` (line 52) are g2-dark-specific and will not reflect theme changes. |
| 8 | HARDCODED | `ParticlePulseDot.jsx` | `#ef4444` appears three times (lines 19, 78, 100) without referencing a theme token. |
| 9 | THEME-BLIND | `styles.css` | Close-button `!important` forces white text (line 41), which is invisible in light mode. |
| 10 | THEME-BLIND | `ParticlePulseDot.jsx` | Always emits `#ef4444` regardless of theme. Five of six schemes define different `statusLive` colors. |
| 11 | INCONSISTENCY | `colors.js` | `accentPink` in dark mode is `#ff8c42` (orange, line 15); in light mode is `#ec4899` (pink, line 51). |
| 12 | INCONSISTENCY | `colors.js` | Comment on line 63 says status colors are "same as dark mode," but `statusDisputed` differs: dark `#f59e0b` (line 31) vs light `#a855f7` (line 67). |
| 13 | INCONSISTENCY | `colors.js`, `colors-chakra.js` | `bgElevated` is `#1e1e1e` (neutral gray) in `colors.js` line 10 vs. `purple.900` in `colors-chakra.js` line 11. |
| 14 | REDUNDANT | `ThemePicker.jsx`, `ThemeToggle.jsx` | Both components provide dark/light mode toggling. |
