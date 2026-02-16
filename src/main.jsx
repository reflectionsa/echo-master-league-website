import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import App from './App.jsx'
import './styles.css'
import ErrorBoundary from './ErrorBoundary'

const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <ChakraProvider value={defaultSystem}>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </ChakraProvider>
    </React.StrictMode>
)
