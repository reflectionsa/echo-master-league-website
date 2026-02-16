import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary caught error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '40px',
          backgroundColor: '#fee',
          color: '#a00',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          margin: '20px'
        }}>
          <h2 style={{ color: '#a00' }}>⚠️ Application Error</h2>
          <p><strong>Message:</strong></p>
          <div style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>
            {String(this.state.error.message || this.state.error)}
          </div>
          {this.state.errorInfo && (
            <>
              <p style={{ marginTop: '20px' }}><strong>Stack Trace:</strong></p>
              <div style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>
                {this.state.errorInfo.componentStack}
              </div>
            </>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
