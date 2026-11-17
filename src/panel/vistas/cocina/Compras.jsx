import { Fragment } from 'react'

const S = {
  barra: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  categoria: { background: '#FAF8F1', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6A6C5A' },
  boton: { minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' },
  marca: { width: 22, height: 22, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
}

export default function Compras({ accent, grupos, porComprar, total, onNueva }) {
  return (
    <>
      <div style={S.barra}>
        <span style={{ fontSize: 14, color: '#6A6C5A', flex: '1 1 380px' }}>
          Lo que hace falta para el menú de la semana. Los artículos de dieta especial van al
          final y son los que no se pueden sustituir sobre la marcha.
        </span>
        <button type="button" onClick={onNueva}
          style={{ minHeight: 44, padding: '0 18px', borderRadius: 10, border: 0, background: accent, color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>
          + Añadir artículo
        </button>
      </div>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Compra de la semana</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>
            {porComprar} por comprar de {total} · {total - porComprar} ya en despensa
          </span>
        </div>
        <table style={{ minWidth: 920 }}>
          <thead>
            <tr>
              <th style={{ width: 40 }}><span className="sr-only">Comprado</span></th>
              <th>Artículo</th><th>Cantidad</th><th>Para qué</th><th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {grupos.map((g) => (
              <Fragment key={g.categoria}>
                <tr><td colSpan={5} style={S.categoria}>{g.categoria}</td></tr>
                {g.filas.map((c) => (
                  <tr key={c.id} style={{ opacity: c.comprado ? .6 : 1 }}>
                    <td>
                      <span style={{ ...S.marca, background: c.comprado ? '#E8EEDB' : '#EEEBE0' }} aria-hidden="true">
                        {c.comprado && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4C6B27" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, textDecoration: c.comprado ? 'line-through' : 'none' }}>{c.articulo}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{c.cantidad}</td>
                    <td style={{ color: '#474A3A' }}>{c.motivo}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" onClick={c.alternar} style={S.boton}>
                        {c.comprado ? 'Desmarcar' : 'Marcar comprado'}
                      </button>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
