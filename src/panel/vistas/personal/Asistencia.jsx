const S = {
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#6A6C5A' },
  kpiValue: { fontSize: 28, fontWeight: 800 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  avatar: { width: 34, height: 34, borderRadius: 17, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  btn: { minHeight: 40, padding: '0 14px', borderRadius: 9, fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' },
  pin: { display: 'inline-flex', alignItems: 'center', gap: 5 }
}

const IconoPin = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export default function Asistencia({ accent, filas, dentro, pendientes, incidencias }) {
  return (
    <>
      <section style={S.kpiGrid}>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>En la residencia</span>
          <span style={{ ...S.kpiValue, color: '#4C6B27' }}>{dentro}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>de {filas.length} programados hoy</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Por checar</span>
          <span style={S.kpiValue}>{pendientes}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>turno vespertino desde las 15:00</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Incidencias</span>
          <span style={{ ...S.kpiValue, color: incidencias ? '#B42318' : '#262A1B' }}>{incidencias}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>retardos o checada fuera del perímetro</span>
        </div>
      </section>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Entradas y salidas · lunes 9 de noviembre</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>La ubicación se toma del teléfono al checar</span>
        </div>
        <table style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th>Persona</th><th>Turno</th><th>Entrada</th><th>Salida</th><th>Ubicación</th><th>Estado</th><th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={S.avatar}>{f.ini}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{f.name}</span>
                      <span style={{ fontSize: 13, color: '#6A6C5A' }}>{f.rol} · {f.area}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: f.turno.bg, color: f.turno.fg, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {f.turno.nombre}
                  </span>
                  <div style={{ fontSize: 12, color: '#6A6C5A', marginTop: 4 }}>{f.turno.horario}</div>
                </td>
                <td style={{ fontWeight: f.retardo ? 700 : 400, color: f.retardo ? '#8A5300' : '#262A1B' }}>{f.entradaTexto}</td>
                <td>{f.salidaTexto}</td>
                <td>
                  {f.reg ? (
                    <span style={{ ...S.pin, color: f.reg.ubicacionOk ? '#474A3A' : '#B42318', fontWeight: f.reg.ubicacionOk ? 400 : 700 }}>
                      <IconoPin color={f.reg.ubicacionOk ? '#6A6C5A' : '#B42318'} />
                      {f.reg.ubicacion}
                    </span>
                  ) : <span style={{ color: '#6A6C5A' }}>—</span>}
                </td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: f.bg, color: f.fg, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{f.estado}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {f.puedeEntrar && (
                    <button type="button" onClick={f.registrarEntrada} style={{ ...S.btn, border: 0, background: accent, color: '#FFFFFF' }}>
                      Registrar entrada
                    </button>
                  )}
                  {f.puedeSalir && (
                    <button type="button" onClick={f.registrarSalida} style={{ ...S.btn, border: '1px solid #DCD6C6', background: '#FFFFFF', color: '#262A1B' }}>
                      Registrar salida
                    </button>
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
