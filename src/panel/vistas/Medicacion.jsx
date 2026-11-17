const S = {
  resumen: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: '18px 20px' },
  barra: { height: 8, borderRadius: 4, background: '#EEEBE0', overflow: 'hidden' },
  tabla: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  aviso: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: '#FBF0D5', color: '#5E3A00', fontSize: 14 },
  verInv: { minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #C9A86A', background: '#FFFFFF', color: '#5E3A00', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', marginLeft: 'auto' }
}

export default function Medicacion({ accent, medRows, givenCount, schedCount, givenPct, avisoInventario, irInventario }) {
  return (
    <>
      <section style={S.resumen}>
        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            Ronda del turno matutino · {givenCount} de {schedCount} administradas
          </span>
          <div style={S.barra}><div style={{ height: 8, width: givenPct, background: accent }} /></div>
        </div>
        <span style={{ fontSize: 13, color: '#6A6C5A' }}>
          Cada registro guarda hora, usuario y firma. El inventario se descuenta automáticamente.
        </span>
      </section>

      <section style={S.tabla}>
        <table style={{ minWidth: 860 }}>
          <thead>
            <tr>
              <th>Hora</th><th>Residente</th><th>Medicamento</th><th>Dosis y vía</th><th>Estado</th><th>Registro</th>
            </tr>
          </thead>
          <tbody>
            {medRows.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 700 }}>{m.time}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{m.res}</span>
                    <span style={{ fontSize: 13, color: '#6A6C5A' }}>Hab. {m.room} · Alergia: {m.alergia}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{m.med}</td>
                <td>{m.dose} · {m.via}</td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: m.bg, color: m.fg, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{m.status}</span>
                </td>
                <td>
                  {m.canGive && (
                    <button type="button" onClick={m.give} style={{ minHeight: 40, padding: '0 14px', borderRadius: 9, border: 0, background: accent, color: '#FFFFFF', fontWeight: 600, fontSize: 13 }}>
                      Administrar
                    </button>
                  )}
                  {(m.isGiven || m.prnTomada) && <span style={{ fontSize: 13, color: '#474A3A' }}>{m.givenAt} · L. Pérez</span>}
                  {m.puedeTomar && (
                    <button type="button" onClick={m.tomar} style={{ minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 13 }}>
                      Registrar toma
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* El texto sale del módulo de Inventario: si administras una dosis que
          deja un medicamento bajo mínimo, aquí aparece solo. */}
      {avisoInventario.length > 0 && (
        <section style={S.aviso}>
          <strong style={{ whiteSpace: 'nowrap' }}>Inventario</strong>
          <span style={{ flex: '1 1 420px' }}>{avisoInventario.join(' ')}</span>
          <button type="button" onClick={irInventario} style={S.verInv}>Ver inventario</button>
        </section>
      )}
    </>
  )
}
