/**
 * analytics.js — PostHog event tracking helpers
 *
 * Usage (in any component):
 *   import { trackEvent } from '../analytics'
 *   trackEvent('standings_opened', { source: 'nav' })
 *
 * Events are no-ops if PostHog is not initialised (e.g. no API key in .env).
 */
import posthog from 'posthog-js'

/**
 * Track a custom event.
 * @param {string} event  - Event name, e.g. 'nav_clicked'
 * @param {object} [props] - Optional properties, e.g. { section: 'standings' }
 */
export function trackEvent(event, props = {}) {
    if (posthog.__loaded) {
        posthog.capture(event, props)
    }
}
