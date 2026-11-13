import { useEffect, useRef } from 'react'

const S = {
  fondo: { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(18,50,47,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, boxSizing: 'border-box' },
  caja: { width: '100%', maxWidth: 560, maxHeight: '90dvh', overflowY: 'auto', background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 16, padding: 24, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 24px 60px rgba(0,0,0,.22)' },
  titulo: { margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-.01em' },
  desc: { fontSize: 14, color: '#5B6675', lineHeight: 1.5 },
  pie: { display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 },
  cancelar: { minHeight: 44, padding: '0 18px', borderRadius: 10, border: '1px solid #DCE1E7', background: '#FFFFFF', color: '#1B2430', fontWeight: 600, fontSize: 14 },
  guardar: { minHeight: 44, padding: '0 18px', borderRadius: 10, border: 0, color: '#FFFFFF', fontWeight: 700, fontSize: 14 }
}

/**
 * Diálogo modal del panel. Cierra con Escape o clic en el fondo, y enfoca el
 * primer campo al abrir. El contenido se envía con Enter porque va en un <form>.
 */
export default function Modal({ titulo, descripcion, accent, textoGuardar = 'Guardar', onCerrar, onGuardar, children }) {
  const caja = useRef(null)

  useEffect(() => {
    const alTeclear = (e) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', alTeclear)
    caja.current?.querySelector('input, select, textarea')?.focus()
    // Evita que el panel de atrás se desplace mientras el modal está abierto.
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = overflow
    }
  }, [onCerrar])

  return (
    <div style={S.fondo} onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <form
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        style={S.caja}
        onSubmit={(e) => { e.preventDefault(); onGuardar() }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h2 style={S.titulo}>{titulo}</h2>
          {descripcion && <span style={S.desc}>{descripcion}</span>}
        </div>

        {children}

        <div style={S.pie}>
          <button type="button" onClick={onCerrar} style={S.cancelar}>Cancelar</button>
          <button type="submit" style={{ ...S.guardar, background: accent }}>{textoGuardar}</button>
        </div>
      </form>
    </div>
  )
}
