import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      window.location.hash = '';
      window.location.reload();
    } catch {
      this.setState({ hasError: false, error: undefined });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-900">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-[#d71e28] rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-stone-900">Wells Fargo Online Notice</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                A temporary display issue occurred while loading this page. You can restore the default banking portal with one click.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 bg-stone-100 rounded-lg text-left text-[11px] font-mono text-stone-700 break-words max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full bg-[#d71e28] hover:bg-[#b81620] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Portal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
