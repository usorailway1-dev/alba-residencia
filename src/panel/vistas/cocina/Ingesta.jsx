import { NIVELES, TIEMPOS } from '../../../data/cocina.js'
import { tone } from '../../../data/alba.js'

const S = {
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#6A6C5A' },
  kpiValue: { fontSize: 28, fontWeight: 800 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  avatar: { width: 34, height: 34, borderRadius: 17, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  celda: { width: '100%', minHeight: 42, borderRadius: 9, border: '1px solid transparent', fontWeight: 700, fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 },
  menu: { position: 'absolute', top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: 160, background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 10, boxShadow: '0 12px 28px rgba(0,0,0,.16)', padding: 5, display: 'flex', flexDirection: 'column', gap: 2 },
  opcion: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 36, padding: '0 8px', border: 0, borderRadius: 7, background: 'transparent', fontSize: 13, fontWeight: 600, textAlign: 'left' },
  punto: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  aviso: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 14 }
}

export default function Ingesta({ filas, registrosHoy, totalTiempos, mediaDia, insuficientes, paraEnfermeria, siguiente, cerrarCelda }) {
  return (
    <>
      <section style={S.kpiGrid}>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Registros de hoy</span>
          <span style={S.kpiValue}>{registrosHoy} / {totalTiempos}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>
            {siguiente ? `Sigue ${siguiente.nombre.toLowerCase()} a las ${siguiente.hora}` : 'Día completo'}
          </span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Ingesta media</span>
          <span style={{ ...S.kpiValue, color: mediaDia >= 70 ? '#4C6B27' : '#8A5300' }}>{mediaDia} %</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>de lo servido en los tiempos ya registrados</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Ingesta insuficiente</span>
          <span style={{ ...S.kpiValue, color: insuficientes.length ? '#B42318' : '#262A1B' }}>{insuficientes.length}</span>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>residentes que comieron poco o nada</span>
        </div>
      </section>

      {paraEnfermeria.length > 0 && (
        <section style={{ ...S.aviso, background: '#FBE7E3', color: '#5C1109' }}>
          <strong style={{ whiteSpace: 'nowrap' }}>Avisar a enfermería</strong>
          <span>
            {paraEnfermeria.map((f) => f.nombre).join(', ')} lleva{paraEnfermeria.length > 1 ? 'n' : ''} dos
            o más tiempos por debajo de la mitad. En un adulto mayor eso se vigila desde el primer día.
          </span>
        </section>
      )}
      {paraEnfermeria.length === 0 && insuficientes.length > 0 && (
        <section style={{ ...S.aviso, background: '#FBF0D5', color: '#5E3A00' }}>
          <strong style={{ whiteSpace: 'nowrap' }}>Vigilar</strong>
          <span>
            {insuficientes.map((f) => `${f.nombre} (${f.bajos})`).join(', ')}. Si se repite en el
            siguiente tiempo, se avisa a enfermería.
          </span>
        </section>
      )}

      <section style={S.tarjeta} onMouseLeave={cerrarCelda}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Lunes 9 de noviembre</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>Toca una casilla para registrar cuánto comió</span>
        </div>
        <table style={{ minWidth: 980 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 240 }}>Residente</th>
              {TIEMPOS.map((t) => (
                <th key={t.id} style={{ textAlign: 'center' }}>{t.nombre}<br />{t.hora}</th>
              ))}
              <th style={{ textAlign: 'center' }}>Media</th>
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
                      <span style={{ fontSize: 13, color: '#6A6C5A' }}>
                        {f.etiqueta}{f.consistencia !== 'Normal' ? ` · consistencia ${f.consistencia.toLowerCase()}` : ''}
                      </span>
                    </div>
                  </div>
                </td>
                {f.celdas.map((c) => (
                  <td key={c.tiempo.id} style={{ position: 'relative', textAlign: 'center', padding: '6px 8px' }}>
                    <button type="button" onClick={c.abrir} aria-expanded={c.abierta}
                      aria-label={`${f.nombre}, ${c.tiempo.nombre}: ${c.nivel ? c.nivel.label : 'sin registrar'}`}
                      style={{ ...S.celda, background: c.bg, color: c.fg, borderColor: c.abierta ? c.fg : (c.nivel ? 'transparent' : '#E5E1D5'), borderStyle: c.nivel ? 'solid' : 'dashed' }}>
                      <span>{c.nivel ? c.nivel.label : 'Registrar'}</span>
                      {c.reg && <span style={{ fontSize: 11, fontWeight: 500, opacity: .85 }}>{c.reg.hora}</span>}
                    </button>
                    {c.abierta && (
                      <div style={S.menu} role="menu">
                        {NIVELES.map((n) => (
                          <button key={n.id} type="button" role="menuitem" style={S.opcion}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#F4F2EA' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                            onClick={() => c.poner(n.id)}>
                            <span style={{ ...S.punto, background: tone[n.tono].fg }} />
                            <span>{n.label}</span>
                            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: '#6A6C5A' }}>{n.pct} %</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                ))}
                <td style={{ textAlign: 'center', fontWeight: 700, color: f.media === null ? '#6A6C5A' : f.media >= 70 ? '#4C6B27' : '#B42318' }}>
                  {f.media === null ? '—' : `${f.media} %`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {filas.some((f) => f.celdas.some((c) => c.reg?.nota)) && (
        <section style={{ ...S.tarjeta, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Observaciones de cocina</h2>
          {filas.flatMap((f) => f.celdas
            .filter((c) => c.reg?.nota)
            .map((c) => (
              <div key={`${f.rid}-${c.tiempo.id}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 14, paddingBottom: 8, borderBottom: '1px solid #EEEBE0' }}>
                <span style={{ fontWeight: 600, minWidth: 220 }}>{f.nombre}</span>
                <span style={{ color: '#6A6C5A', minWidth: 120 }}>{c.tiempo.nombre} · {c.reg.hora}</span>
                <span style={{ color: '#474A3A', flex: '1 1 260px' }}>{c.reg.nota}</span>
              </div>
            )))}
        </section>
      )}
    </>
  )
}
