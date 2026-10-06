import "./ComingSoonPage.css"

export default function ComingSoonPage() {
  return (
    <main className="coming-page">
      <header className="coming-header">
        <a className="coming-brand" href="/" aria-label="Plan Cerca, inicio">
          <span className="coming-brand-mark" aria-hidden="true">PC</span>
          <span>Plan Cerca</span>
        </a>
        <span className="coming-status"><i aria-hidden="true" />Estamos preparando la web</span>
      </header>

      <section className="coming-content" aria-labelledby="coming-title">
        <p className="coming-eyebrow">CULTURA Y PLANES, MÁS CERCA</p>
        <h1 id="coming-title">Próximamente<span>.</span></h1>
        <p className="coming-description">Estamos preparando algo nuevo para que encuentres tu próximo plan.</p>
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