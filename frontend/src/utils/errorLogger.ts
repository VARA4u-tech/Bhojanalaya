import { ErrorInfo } from 'react';

interface ErrorLog {
    error: Error;
    errorInfo?: ErrorInfo;
    timestamp: Date;
}

class ErrorLogger {
    private errors: ErrorLog[] = [];

    log(error: Error, errorInfo?: ErrorInfo): void {
        const errorLog: ErrorLog = {
            error,
            errorInfo,
            timestamp: new Date(),
        };

        this.errors.push(errorLog);

        // Log to console in development
        if (import.meta.env.DEV) {
            console.group('🔴 Error Caught by Error Boundary');
            console.error('Error:', error);
            if (errorInfo) {
                console.error('Component Stack:', errorInfo.componentStack);
            }
            console.error('Timestamp:', errorLog.timestamp.toISOString());
            console.groupEnd();
        }

        // In production, you would send this to an error tracking service
        // like Sentry, LogRocket, or similar
        // Example:
        // if (import.meta.env.PROD) {
        //   Sentry.captureException(error, {
        //     contexts: {
        //       react: {
        //         componentStack: errorInfo?.componentStack,
        //       },
        //     },
        //   });
        // }
    }

    getErrors(): ErrorLog[] {
        return [...this.errors];
    }

    clearErrors(): void {
        this.errors = [];
    }
}

const errorLogger = new ErrorLogger();

export function logError(error: Error, errorInfo?: ErrorInfo): void {
    errorLogger.log(error, errorInfo);
}

export function getErrorLogs(): ErrorLog[] {
    return errorLogger.getErrors();
}

export function clearErrorLogs(): void {
    errorLogger.clearErrors();
}
