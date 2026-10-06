import "./ComingSoonPage.css"

export default function ComingSoonPage() {
  return (
    <main className="coming-page">
      <header className="coming-header">
        <a className="coming-brand" href="/" aria-label="Plan Cerca, inicio">
          <span className="coming-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <span className="coming-brand-name"><span>Plan</span><span>Cerca</span></span>
        </a>
        <span className="coming-status"><i aria-hidden="true" />Estamos preparando la web</span>
      </header>

      <section className="coming-content" aria-labelledby="coming-title">
        <p className="coming-eyebrow">CULTURA Y PLANES, MÁS CERCA</p>
        <h1 id="coming-title">Próximamente<span>.</span></h1>
        <p className="coming-description">Muy pronto descubrirás conciertos, teatro y exposiciones para encontrar tu próximo plan cerca de ti.</p>
        <div className="coming-preview" aria-label="Próximamente: conciertos, teatro y exposiciones">
          <span>Conciertos</span><i aria-hidden="true" />
          <span>Teatro</span><i aria-hidden="true" />
          <span>Exposiciones</span>
        </div>
        <div className="coming-signoff"><span>Nos vemos muy pronto</span><span className="coming-signoff-line" aria-hidden="true" /></div>
      </section>

      <footer className="coming-footer">
        <span>Plan Cerca</span>
        <span>© 2026</span>
      </footer>
      <span className="coming-orbit" aria-hidden="true"><span /></span>
    </main>
  )
}