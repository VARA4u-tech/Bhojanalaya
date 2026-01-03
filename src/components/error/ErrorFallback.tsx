import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
    error?: Error;
    resetError?: () => void;
    fullPage?: boolean;
    title?: string;
    message?: string;
}

export function ErrorFallback({
    error,
    resetError,
    fullPage = false,
    title = 'Something went wrong',
    message = 'We encountered an unexpected error. Please try again.',
}: ErrorFallbackProps) {
    const navigate = useNavigate();
    const isDev = import.meta.env.DEV;

    const content = (
        <div className="flex flex-col items-center justify-center text-center space-y-6 p-8">
            <div className="rounded-full bg-destructive/10 p-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                    {title}
                </h2>
                <p className="text-muted-foreground">{message}</p>
            </div>

            {isDev && error && (
                <details className="w-full max-w-2xl">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Error Details (Development Only)
                    </summary>
                    <div className="mt-4 p-4 bg-muted rounded-lg text-left">
                        <p className="font-mono text-xs text-destructive break-all">
                            {error.message}
                        </p>
                        {error.stack && (
                            <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-40">
                                {error.stack}
                            </pre>
                        )}
                    </div>
                </details>
            )}

            <div className="flex gap-3">
                {resetError && (
                    <Button onClick={resetError} variant="default">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                )}
                {fullPage && (
                    <Button onClick={() => navigate('/')} variant="outline">
                        <Home className="h-4 w-4" />
                        Go Home
                    </Button>
                )}
            </div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                {content}
            </div>
        );
    }

    return (
        <div className="min-h-[400px] flex items-center justify-center">
            {content}
        </div>
    );
}
