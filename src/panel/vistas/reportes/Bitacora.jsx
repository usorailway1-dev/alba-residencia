const TONOS = {
  Residentes: { bg: '#E9ECF2', fg: '#3C5578' },
  Medicación: { bg: '#E8EEDB', fg: '#4C6B27' },
  Enfermería: { bg: '#E8EEDB', fg: '#4C6B27' },
  Inventario: { bg: '#FBF0D5', fg: '#8A5300' },
  Cocina: { bg: '#FBF0D5', fg: '#8A5300' },
  Personal: { bg: '#EDE8F0', fg: '#5F4473' },
  Facturación: { bg: '#FBE7E3', fg: '#B42318' },
  Sistema: { bg: '#EEEBE0', fg: '#474A3A' }
}

const S = {
  aviso: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 14, background: '#E9ECF2', color: '#2D4260' },
  filtros: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  filtro: { display: 'flex', alignItems: 'center', gap: 7, minHeight: 36, padding: '0 13px', borderRadius: 999, fontWeight: 600, fontSize: 13 },
  n: { fontSize: 12, fontWeight: 700, opacity: .75 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  h2: { margin: 0, fontSize: 18, fontWeight: 700 },
  chip: { padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  primario: { minHeight: 40, padding: '0 16px', borderRadius: 9, border: 0, color: '#FFFFFF', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }
}

export default function Bitacora({ accent, entradas, filtros, hoy, total, onExportar }) {
  return (
    <>
      <section style={S.aviso}>
        <strong style={{ whiteSpace: 'nowrap' }}>Quién, qué y cuándo</strong>
        <span style={{ flex: '1 1 380px' }}>
          Cada acción que hagas en cualquier módulo cae aquí sola. En la app real estas líneas serían
          de solo escritura: ni el administrador podría corregirlas, que es justo lo que las hace
          servir en una auditoría.
        </span>
        <button type="button" onClick={onExportar} style={{ ...S.primario, background: accent }}>
          Exportar en PDF
        </button>
      </section>

      <div role="group" aria-label="Filtrar la bitácora por módulo" style={S.filtros}>
        {filtros.map((x) => (
          <button key={x.id} type="button" onClick={x.ir} aria-pressed={x.activo ? 'true' : 'false'}
            style={{
              ...S.filtro,
              border: `1px solid ${x.activo ? '#3A4523' : '#DCD6C6'}`,
              background: x.activo ? '#3A4523' : '#FFFFFF',
              color: x.activo ? '#FFFFFF' : '#262A1B'
            }}>
            {x.label}<span style={S.n}>{x.n}</span>
          </button>
        ))}
      </div>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={S.h2}>Movimientos</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>
            {entradas.length} de {total} · {hoy} de hoy
          </span>
        </div>
        <table style={{ minWidth: 940 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 110 }}>Cuándo</th>
              <th style={{ minWidth: 190 }}>Quién</th>
              <th>Qué</th>
              <th>Módulo</th>
            </tr>
          </thead>
          <tbody>
            {entradas.map((e) => {
              const t = TONOS[e.modulo] || TONOS.Sistema
              return (
                <tr key={e.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{e.hora}</span>
                      <span style={{ fontSize: 13, color: '#6A6C5A' }}>{e.fechaTexto}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{e.quien}</span>
                      <span style={{ fontSize: 13, color: '#6A6C5A' }}>{e.rol}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontWeight: 600 }}>{e.accion}</span>
                      <span style={{ fontSize: 13, color: '#474A3A' }}>{e.detalle}</span>
                    </div>
                  </td>
                  <td><span style={{ ...S.chip, background: t.bg, color: t.fg }}>{e.modulo}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </>
  )
}
