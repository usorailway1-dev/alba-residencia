const S = {
  barra: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  tabla: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, overflowX: 'auto' },
  avatar: { width: 38, height: 38, borderRadius: 19, background: '#E3F0EE', color: '#0B5A4E', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  verFicha: { minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #DCE1E7', background: '#FFFFFF', color: '#1B2430', fontWeight: 600, fontSize: 13 }
}

export default function Residentes({ accent, filters, resList, onNuevo }) {
  return (
    <>
      <div style={S.barra}>
        <div role="group" aria-label="Filtrar por estado" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {filters.map((f) => (
            <button key={f.id} type="button" onClick={f.pick} aria-pressed={f.pressed}
              style={{ minHeight: 40, padding: '0 16px', borderRadius: 999, border: `1px solid ${f.border}`, background: f.bg, color: f.fg, fontWeight: 600, fontSize: 14 }}>
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={onNuevo} style={{ minHeight: 44, padding: '0 18px', borderRadius: 10, border: 0, background: accent, color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>
          + Nuevo residente
        </button>
      </div>

      <section style={S.tabla}>
        <table style={{ minWidth: 820 }}>
          <thead>
            <tr>
              <th>Residente</th>
              <th>Habitación</th>
              <th>Dependencia (Barthel)</th>
              <th>Alergias</th>
              <th>Estado</th>
              <th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {resList.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={S.avatar}>{r.ini}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{r.name}</span>
                      <span style={{ fontSize: 13, color: '#5B6675' }}>{r.age} años · Ingreso {r.ingreso}</span>
                    </div>
                  </div>
                </td>
                <td>{r.room}</td>
                <td>{r.barthel} · {r.dep}</td>
                <td>{r.alergias}</td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: r.bg, color: r.fg, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{r.estado}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button type="button" onClick={r.open} style={S.verFicha}>Ver ficha</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
