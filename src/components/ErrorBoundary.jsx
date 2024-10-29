import { Snippet } from '@nextui-org/react'
import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h3>An error occurred in the application.</h3>
                    <Snippet
                        variant="shadow"
                        color="danger"
                        className="z-50 text-foreground max-w-[500px]"
                    >
                        <span>{this.state.error?.message}</span>
                    </Snippet>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
