import { createSystem, defaultConfig } from '@chakra-ui/react'
import { emlColors } from './colors'

// Create Chakra UI theme system using EML colors
export const system = createSystem(
    defaultConfig,
    {
        theme: {
            tokens: {
                colors: {
                    eml: {
                        // Backgrounds
                        'bg.primary': { value: emlColors.bgPrimary },
                        'bg.secondary': { value: emlColors.bgSecondary },
                        'bg.tertiary': { value: emlColors.bgTertiary },
                        'bg.card': { value: emlColors.bgCard },
                        'bg.elevated': { value: emlColors.bgElevated },
                        'bg.hover': { value: emlColors.bgHover },

                        // Accents
                        'accent.orange': { value: emlColors.accentOrange },
                        'accent.pink': { value: emlColors.accentPink },
                        'accent.rose': { value: emlColors.accentRose },
                        'accent.blue': { value: emlColors.accentBlue },
                        'accent.cyan': { value: emlColors.accentCyan },
                        'accent.purple': { value: emlColors.accentPurple },

                        // Text
                        'text.primary': { value: emlColors.textPrimary },
                        'text.secondary': { value: emlColors.textSecondary },
                        'text.muted': { value: emlColors.textMuted },
                        'text.subtle': { value: emlColors.textSubtle },

                        // Status
                        'status.live': { value: emlColors.statusLive },
                        'status.scheduled': { value: emlColors.statusScheduled },
                        'status.completed': { value: emlColors.statusCompleted },
                        'status.disputed': { value: emlColors.statusDisputed },

                        // Borders
                        'border.light': { value: emlColors.borderLight },
                        'border.medium': { value: emlColors.borderMedium },
                        'border.accent': { value: emlColors.borderAccent },
                    },
                },
            },
        },
    }
)

// Export colors for use in JS logic (gradients, dynamic calculations, etc.)
export { emlColors }
