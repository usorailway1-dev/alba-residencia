const S = {
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  avatar: { width: 34, height: 34, borderRadius: 17, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chip: { padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' },
  editar: { minHeight: 40, padding: '0 14px', borderRadius: 9, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' },
  nota: { display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: '#E9ECF2', color: '#2D4260', fontSize: 14 }
}

export default function Dietas({ filas, especiales, modificadas }) {
  const conAlergia = filas.filter((f) => f.alergias.length > 0)

  return (
    <>
      <section style={S.nota}>
        <strong style={{ whiteSpace: 'nowrap' }}>Ojo</strong>
        <span>
          Las alergias de esta pantalla son <strong>alimentarias</strong>. Las que aparecen en la
          ficha clínica son de medicamentos, y no sirven para cocinar: son dos listas distintas y
          en la app real tendrían que capturarse por separado.
        </span>
      </section>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Dietas por residente</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>
            {especiales} especiales · {modificadas} con consistencia modificada · {conAlergia.length} con alergia alimentaria
          </span>
        </div>
        <table style={{ minWidth: 980 }}>
          <thead>
            <tr>
              <th>Residente</th><th>Dieta</th><th>Consistencia</th><th>No puede comer</th><th>Indicaciones para cocina</th><th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.rid}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={S.avatar}>{f.ini}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{f.nombre}</span>
                      <span style={{ fontSize: 13, color: '#6A6C5A' }}>Hab. {f.habitacion}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontWeight: 600 }}>{f.etiqueta}</span>
                    {f.etiquetas.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {f.etiquetas.map((e) => (
                          <span key={e} style={{ ...S.chip, background: '#E9ECF2', color: '#3C5578', fontSize: 12 }}>{e}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span style={{ ...S.chip, background: f.consistenciaBg, color: f.consistenciaFg }}>{f.consistencia}</span>
                </td>
                <td>
                  {f.alergias.length === 0
                    ? <span style={{ color: '#6A6C5A' }}>Sin restricciones</span>
                    : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {f.alergias.map((a) => (
                          <span key={a} style={{ ...S.chip, background: '#FBE7E3', color: '#B42318' }}>{a}</span>
                        ))}
                      </div>
                      )}
                </td>
                <td style={{ color: '#474A3A', maxWidth: 320 }}>{f.nota}</td>
                <td style={{ textAlign: 'right' }}>
                  <button type="button" onClick={f.editar} style={S.editar}>Cambiar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
