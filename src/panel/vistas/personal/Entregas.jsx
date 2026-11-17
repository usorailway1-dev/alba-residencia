import { TURNOS } from '../../../data/personal.js'

const S = {
  barra: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  nota: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 },
  cabecera: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  flecha: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 },
  chip: { padding: '3px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  firma: { display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid #EEEBE0', fontSize: 13, color: '#6A6C5A' }
}

const porNombre = (nombre) => Object.values(TURNOS).find((t) => t.nombre === nombre) || TURNOS.D

export default function Entregas({ accent, entregas, onNueva }) {
  return (
    <>
      <div style={S.barra}>
        <span style={{ fontSize: 14, color: '#6A6C5A' }}>
          Lo que cada turno deja escrito al siguiente. Queda firmado con hora y autor.
        </span>
        <button type="button" onClick={onNueva}
          style={{ minHeight: 44, padding: '0 18px', borderRadius: 10, border: 0, background: accent, color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>
          + Nueva entrega
        </button>
      </div>

      {entregas.map((e) => {
        const de = porNombre(e.de)
        const a = porNombre(e.a)
        return (
          <article key={e.id} style={S.nota}>
            <div style={S.cabecera}>
              <span style={{ ...S.chip, background: de.bg, color: de.fg }}>{e.de}</span>
              <span style={{ ...S.flecha, color: '#6A6C5A' }}>→</span>
              <span style={{ ...S.chip, background: a.bg, color: a.fg }}>{e.a}</span>
              <span style={{ fontSize: 13, color: '#6A6C5A', marginLeft: 'auto' }}>{e.fecha} · {e.hora}</span>
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#33382A' }}>{e.texto}</p>
            <div style={S.firma}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4C6B27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Firmada por {e.autor} · Registro inmutable</span>
            </div>
          </article>
        )
      })}
    </>
  )
}
