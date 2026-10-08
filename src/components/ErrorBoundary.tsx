import { Component, type ErrorInfo, type ReactNode } from "react";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Plan Cerca: error de renderizado", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    // Enlace normal (no <Link>): recargar la home reinicia el estado que provocó el fallo.
    return <main className="status-page">
      <div className="status-page-card" role="alert">
        <span className="kicker">Plan Cerca</span>
        <h1>Algo ha salido mal</h1>
        <p>No hemos podido mostrar esta página. Puedes volver al inicio e intentarlo de nuevo.</p>
        <a className="button button--primary" href="/">Ir a la página de inicio</a>
      </div>
    </main>;
  }
}
