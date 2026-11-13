import { useEffect, useRef, useState } from 'react'

const S = {
  header: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  titulo: { margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' },
  fecha: { fontSize: 14, color: '#5B6675' },
  buscador: { display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 14px', background: '#FFFFFF', border: '1px solid #DCE1E7', borderRadius: 10, minWidth: 240, boxSizing: 'border-box' },
  input: { border: 0, outline: 'none', flex: 1, background: 'transparent', color: '#1B2430' },
  campana: { width: 44, height: 44, borderRadius: 10, border: '1px solid #DCE1E7', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  punto: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, background: '#B42318' },
  panel: { position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 40, width: 320, maxHeight: 340, overflowY: 'auto', background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,.14)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2 },
  fila: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, width: '100%', padding: '10px 12px', border: 0, borderRadius: 9, background: 'transparent', textAlign: 'left' },
  vacio: { padding: '12px', fontSize: 13, color: '#5B6675' }
}

/** Cierra el desplegable al hacer clic fuera o pulsar Escape. */
function useCerrarFuera(abierto, cerrar) {
  const ref = useRef(null)
  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => { if (ref.current && !ref.current.contains(e.target)) cerrar() }
    const esc = (e) => { if (e.key === 'Escape') cerrar() }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', esc)
    }
  }, [abierto, cerrar])
  return ref
}

export default function Header({ pageTitle, busqueda, setBusqueda, resultados, alerts }) {
  const [verCampana, setVerCampana] = useState(false)
  const refBusca = useCerrarFuera(busqueda.length > 0, () => setBusqueda(''))
  const refCampana = useCerrarFuera(verCampana, () => setVerCampana(false))

  return (
    <header style={S.header}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={S.titulo}>{pageTitle}</h1>
        <span style={S.fecha}>Lunes 9 de noviembre de 2026 · 09:41 · Turno matutino</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <div ref={refBusca} style={{ position: 'relative' }}>
          <label style={S.buscador}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6675" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="sr-only">Buscar</span>
            <input
              type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar residente, medicamento…" style={S.input}
            />
          </label>
          {busqueda.trim().length >= 2 && (
            <div style={S.panel} role="listbox" aria-label="Resultados de búsqueda">
              {resultados.length === 0 && <span style={S.vacio}>Sin resultados para «{busqueda.trim()}».</span>}
              {resultados.map((r) => (
                <button key={r.clave} type="button" style={S.fila}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F5F7' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  onClick={() => { r.ir(); setBusqueda('') }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#5B6675' }}>{r.tipo}</span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: '#5B6675' }}>{r.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={refCampana} style={{ position: 'relative' }}>
          <button type="button" aria-label={`Notificaciones (${alerts.length})`} aria-expanded={verCampana}
            onClick={() => setVerCampana((x) => !x)} style={S.campana}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {alerts.length > 0 && <span style={S.punto} />}
          </button>
          {verCampana && (
            <div style={S.panel}>
              {alerts.map((a) => (
                <button key={a.key} type="button" style={S.fila}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F5F7' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  onClick={() => { a.go(); setVerCampana(false) }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, background: a.bg, color: a.fg, fontSize: 11, fontWeight: 700 }}>{a.tag}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{a.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
