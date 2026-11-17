const S = {
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#6A6C5A' },
  kpiValue: { fontSize: 28, fontWeight: 800 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  avatar: { width: 34, height: 34, borderRadius: 17, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  renovar: { minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }
}

export default function Certificaciones({ filas, vencidas, porVencer }) {
  const vigentes = filas.filter((c) => c.dias !== null && c.dias > 60).length

  return (
    <>
      <section style={S.kpiGrid}>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Vigentes</span>
          <span style={{ ...S.kpiValue, color: '#4C6B27' }}>{vigentes}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>más de 60 días de margen</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Por vencer</span>
          <span style={{ ...S.kpiValue, color: porVencer ? '#8A5300' : '#262A1B' }}>{porVencer}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>en los próximos 60 días</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Vencidas</span>
          <span style={{ ...S.kpiValue, color: vencidas ? '#B42318' : '#262A1B' }}>{vencidas}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>bloquean la asignación de turnos</span>
        </div>
      </section>

      {vencidas > 0 && (
        <section style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: '#FBE7E3', color: '#5C1109', fontSize: 14 }}>
          <strong style={{ whiteSpace: 'nowrap' }}>Atención</strong>
          <span>
            Hay {vencidas} documento{vencidas > 1 ? 's' : ''} vencido{vencidas > 1 ? 's' : ''}. En una
            inspección conforme a la NOM-031-SSA3-2012 esto se revisa expediente por expediente.
          </span>
        </section>
      )}

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cédulas y certificaciones</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>Se avisa con 60 días de antelación</span>
        </div>
        <table style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th>Persona</th><th>Documento</th><th>Número</th><th>Vigencia</th><th>Estado</th><th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={S.avatar}>{c.ini}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{c.persona}</span>
                      <span style={{ fontSize: 13, color: '#6A6C5A' }}>{c.area}</span>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{c.documento}</td>
                <td style={{ color: '#474A3A' }}>{c.numero}</td>
                <td>{c.venceTexto}</td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: c.bg, color: c.fg, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{c.estado}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {c.puedeRenovar && (
                    <button type="button" onClick={c.renovar} style={S.renovar}>Registrar renovación</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
