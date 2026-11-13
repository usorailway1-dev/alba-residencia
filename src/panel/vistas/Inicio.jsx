const S = {
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#5B6675' },
  kpiSub: { fontSize: 13, color: '#5B6675' },
  barra: { height: 6, borderRadius: 3, background: '#EEF1F4', overflow: 'hidden' },
  fila: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' },
  alertas: { flex: '3 1 420px', minWidth: 0, background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  h2: { margin: 0, fontSize: 18, fontWeight: 700 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  accionPrim: { minHeight: 48, borderRadius: 10, border: 0, color: '#FFFFFF', fontWeight: 600, fontSize: 14 },
  accionSec: { minHeight: 48, borderRadius: 10, border: '1px solid #DCE1E7', background: '#FFFFFF', color: '#1B2430', fontWeight: 600, fontSize: 14 }
}

export default function Inicio({ accent, kpis, alerts, agenda, goEnf, goMed, onReportar, onNuevoIngreso }) {
  return (
    <>
      <section style={S.kpiGrid}>
        {kpis.map((k) => (
          <div key={k.label} style={S.kpi}>
            <span style={S.kpiLabel}>{k.label}</span>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', color: k.color }}>{k.value}</span>
            <span style={S.kpiSub}>{k.sub}</span>
            <div style={S.barra}><div style={{ height: 6, width: k.pct, background: k.bar, borderRadius: 3 }} /></div>
          </div>
        ))}
      </section>

      <div style={S.fila}>
        <section style={S.alertas}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 style={S.h2}>Alertas que requieren atención</h2>
            <span style={{ fontSize: 13, color: '#5B6675' }}>Actualizado hace 2 min</span>
          </div>
          {alerts.map((a) => (
            <div key={a.key} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: 14, borderRadius: 12, background: a.bg }}>
              <span style={{ marginTop: 2, padding: '3px 9px', borderRadius: 999, background: '#FFFFFF', color: a.fg, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{a.tag}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1B2430' }}>{a.title}</span>
                <span style={{ fontSize: 14, color: '#3D4652' }}>{a.detail}</span>
              </div>
              <button type="button" onClick={a.go} style={{ minHeight: 40, padding: '0 14px', borderRadius: 9, border: `1px solid ${a.fg}`, background: '#FFFFFF', color: a.fg, fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{a.cta}</button>
            </div>
          ))}
        </section>

        <section style={{ flex: '2 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={S.tarjeta}>
            <h2 style={S.h2}>Agenda de hoy</h2>
            {agenda.map((g) => (
              <div key={g.time} style={{ display: 'flex', gap: 14, alignItems: 'baseline', paddingBottom: 10, borderBottom: '1px solid #EEF1F4' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: accent, width: 48, flexShrink: 0 }}>{g.time}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{g.title}</span>
                  <span style={{ fontSize: 13, color: '#5B6675' }}>{g.where}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={S.tarjeta}>
            <h2 style={S.h2}>Acciones rápidas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              <button type="button" onClick={goEnf} style={{ ...S.accionPrim, background: accent }}>Registrar signos</button>
              <button type="button" onClick={goMed} style={{ ...S.accionPrim, background: accent }}>Ronda de medicación</button>
              <button type="button" onClick={onReportar} style={S.accionSec}>Reportar incidente</button>
              <button type="button" onClick={onNuevoIngreso} style={S.accionSec}>Nuevo ingreso</button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
