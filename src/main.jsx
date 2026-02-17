import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './theme/system'
import App from './App.jsx'
import './styles.css'
import ErrorBoundary from './ErrorBoundary'

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
