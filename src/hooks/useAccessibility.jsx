import { useState, useEffect } from 'react';

/**
 * Detects OS-level accessibility settings for color-blind users.
 * Reads from the user's system preferences — no manual toggle needed.
 * 
 * Detects:
 * - prefers-contrast: more (user requested higher contrast)
 * - forced-colors: active (Windows High Contrast mode)
 * - prefers-reduced-transparency (often enabled alongside color filters)
 * 
 * On Windows 11: Settings > Accessibility > Color filters
 * When any of these are active, the app swaps red/green to blue/orange
 * so color-blind users can distinguish win/loss, active/inactive, etc.
 */
export const useAccessibility = () => {
    const [needsColorBlindSupport, setNeedsColorBlindSupport] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check OS-level accessibility media queries
        const contrastQuery = window.matchMedia('(prefers-contrast: more)');
        const forcedColorsQuery = window.matchMedia('(forced-colors: active)');
        const reducedTransparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');

        const checkAccessibility = () => {
            const isActive = contrastQuery.matches ||
                forcedColorsQuery.matches ||
                reducedTransparencyQuery.matches;
            setNeedsColorBlindSupport(isActive);
        };

        // Initial check
        checkAccessibility();

        // Listen for changes (user toggling settings while site is open)
        contrastQuery.addEventListener('change', checkAccessibility);
        forcedColorsQuery.addEventListener('change', checkAccessibility);
        reducedTransparencyQuery.addEventListener('change', checkAccessibility);

        return () => {
            contrastQuery.removeEventListener('change', checkAccessibility);
            forcedColorsQuery.removeEventListener('change', checkAccessibility);
            reducedTransparencyQuery.removeEventListener('change', checkAccessibility);
        };
    }, []);

    return { needsColorBlindSupport };
};
