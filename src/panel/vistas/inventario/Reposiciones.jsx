const S = {
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  chip: { padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' },
  boton: { minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }
}

export default function Reposiciones({ solicitudes, pendientes }) {
  return (
    <>
      <section style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: '#E9ECF2', color: '#2D4260', fontSize: 14 }}>
        <strong style={{ whiteSpace: 'nowrap' }}>Cómo funciona</strong>
        <span>
          Cuando un medicamento del botiquín llega al mínimo, se le pide a la familia que lo
          reponga; los insumos del almacén se piden al proveedor. Al registrar la recepción, las
          existencias suben solas y la alerta desaparece.
        </span>
      </section>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Solicitudes de reposición</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>
            {pendientes === 0 ? 'Ninguna pendiente' : `${pendientes} pendiente${pendientes > 1 ? 's' : ''} de recibir`}
          </span>
        </div>
        <table style={{ minWidth: 940 }}>
          <thead>
            <tr>
              <th>Artículo</th><th>Se le pidió a</th><th>Cantidad</th><th>Solicitado</th><th>Estado</th><th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.nombre}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{s.destino}</span>
                    <span style={{ fontSize: 13, color: '#6A6C5A' }}>{s.nota}</span>
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{s.cantidad} {s.unidad}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{s.fecha}</td>
                <td><span style={{ ...S.chip, background: s.bg, color: s.fg }}>{s.estado}</span></td>
                <td style={{ textAlign: 'right' }}>
                  {s.puedeRecibir && (
                    <button type="button" onClick={s.recibir} style={S.boton}>Registrar recepción</button>
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
