'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            ドキュメントの読み込み中にエラーが発生しました
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {this.state.error?.message ||
              'エラーの詳細は開発者コンソールを確認してください。'}
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => this.setState({ hasError: false })}
          >
            再試行
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
