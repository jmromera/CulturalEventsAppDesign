import { Component, type ErrorInfo, type ReactNode } from "react";
import { readLanguage } from "../data/language";
import { errorCopy } from "../data/translations";

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
    // Fuera de App no hay estado de idioma: se lee el que dejó guardado la persona usuaria.
    const text = errorCopy[readLanguage()];
    // Enlace normal (no <Link>): recargar la home reinicia el estado que provocó el fallo.
    return <main className="status-page">
      <div className="status-page-card" role="alert">
        <span className="kicker">Plan Cerca</span>
        <h1>{text.title}</h1>
        <p>{text.text}</p>
        <a className="button button--primary" href="/">{text.home}</a>
      </div>
    </main>;
  }
}
