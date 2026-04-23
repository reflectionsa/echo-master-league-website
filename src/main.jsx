import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './theme/system'
import App from './App.jsx'
import './styles.css'
import ErrorBoundary from './ErrorBoundary'
import posthog from 'posthog-js'

// Initialise PostHog analytics
// VITE_POSTHOG_KEY must be set in .env (see .env.example)
if (import.meta.env.VITE_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: 'https://us.i.posthog.com',
        autocapture: true,       // auto-tracks clicks, inputs, pageviews
        capture_pageview: true,
        session_recording: {
            maskAllInputs: true, // privacy: mask form inputs in replays
        },
    })
}

const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <ChakraProvider value={system}>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </ChakraProvider>
    </React.StrictMode>
)
