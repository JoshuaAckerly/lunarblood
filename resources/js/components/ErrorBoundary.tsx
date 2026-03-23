import { RefreshCw, TriangleAlert } from 'lucide-react';
import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface DefaultFallbackProps {
    error: Error | null;
    onReset: () => void;
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({ onReset }) => (
    <div className="card flex flex-col items-center gap-4 py-12 text-center">
        <TriangleAlert size={36} className="text-[var(--destructive)]" />
        <div>
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                An unexpected error occurred. Your data is safe — try refreshing this section.
            </p>
        </div>
        <button type="button" onClick={onReset} className="btn btn-secondary flex items-center gap-2">
            <RefreshCw size={14} />
            Try again
        </button>
    </div>
);

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    reset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            return this.props.fallback ?? <DefaultFallback error={this.state.error} onReset={this.reset} />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
