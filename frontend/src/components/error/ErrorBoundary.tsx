import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/utils/errorLogger';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        logError(error, errorInfo);

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps): void {
        // Reset error boundary if resetKeys change
        if (
            this.state.hasError &&
            this.props.resetKeys &&
            prevProps.resetKeys &&
            this.hasResetKeysChanged(prevProps.resetKeys, this.props.resetKeys)
        ) {
            this.resetErrorBoundary();
        }
    }

    hasResetKeysChanged(
        prevResetKeys: Array<string | number>,
        resetKeys: Array<string | number>
    ): boolean {
        return resetKeys.some((key, index) => key !== prevResetKeys[index]);
    }

    resetErrorBoundary = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback if none provided
            return (
                <div className="flex items-center justify-center min-h-[400px] p-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-heading font-semibold text-destructive">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-muted-foreground">
                            We're sorry, but something unexpected happened.
                        </p>
                        <button
                            onClick={this.resetErrorBoundary}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
