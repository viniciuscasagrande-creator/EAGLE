import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCw, Home, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isDetailsOpen: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isDetailsOpen: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      isDetailsOpen: false,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary capturou uma falha não tratada:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsOpen: false,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private handleCopyError = () => {
    const text = `Erro: ${this.state.error?.message || 'Desconhecido'}\n\nStack:\n${this.state.error?.stack || ''}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(text);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full min-h-[360px] p-6 flex items-center justify-center">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-2xl bg-[#141b2d] border border-rose-500/30 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Instabilidade Detectada {this.props.moduleName ? `no Módulo ${this.props.moduleName}` : ''}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  O aplicativo interceptou uma falha de renderização para proteger sua sessão.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-rose-300 font-mono break-words">
              {this.state.error?.message || 'Erro inesperado na execução do componente.'}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>Ir para o Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => this.setState((prev) => ({ isDetailsOpen: !prev.isDetailsOpen }))}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <span>Detalhes Técnicos</span>
                {this.state.isDetailsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Collapsible Tech Stack */}
            {this.state.isDetailsOpen && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stack Trace
                  </span>
                  <button
                    type="button"
                    onClick={this.handleCopyError}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {this.state.copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Erro</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 text-[10px] font-mono text-slate-400 max-h-48 overflow-y-auto overflow-x-auto whitespace-pre-wrap">
                  {this.state.error?.stack}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
