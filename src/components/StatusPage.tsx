import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function StatusPage({ kicker, title, text, homeLabel, children }: { kicker: string; title: string; text: string; homeLabel: string; children?: ReactNode }) {
  return <main className="status-page">
    <div className="status-page-card">
      <span className="kicker">{kicker}</span>
      <h1>{title}</h1>
      <p>{text}</p>
      <Link className="button button--primary" to="/">{homeLabel}</Link>
    </div>
    {children}
  </main>;
}
