const S = {
  volver: { alignSelf: 'flex-start', minHeight: 40, padding: '0 12px', borderRadius: 9, border: '1px solid #DCE1E7', background: '#FFFFFF', color: '#1B2430', fontWeight: 600, fontSize: 14 },
  encabezado: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, background: '#E3F0EE', color: '#0B5A4E', fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  h2: { margin: 0, fontSize: 16, fontWeight: 700 },
  campoLabel: { fontSize: 12, color: '#5B6675', fontWeight: 600 },
  campo: { display: 'flex', flexDirection: 'column', gap: 2 },
  btnSec: { minHeight: 44, padding: '0 16px', borderRadius: 10, border: '1px solid #DCE1E7', background: '#FFFFFF', color: '#1B2430', fontWeight: 600, fontSize: 14 }
}

export default function Ficha({ accent, sel, goRes, onReportar, onEvolucion }) {
  return (
    <>
      <button type="button" onClick={goRes} style={S.volver}>← Volver a residentes</button>

      <section style={S.encabezado}>
        <div style={S.avatar}>{sel.ini}</div>
        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 800 }}>{sel.name}</span>
            <span style={{ padding: '4px 10px', borderRadius: 999, background: sel.bg, color: sel.fg, fontSize: 13, fontWeight: 700 }}>{sel.estado}</span>
          </div>
          <span style={{ fontSize: 14, color: '#5B6675' }}>
            {sel.age} años · Habitación {sel.room} · Ingreso {sel.ingreso} · Expediente RES-{sel.exp}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button type="button" onClick={onReportar} style={S.btnSec}>Reportar incidente</button>
          <button type="button" onClick={onEvolucion} style={{ minHeight: 44, padding: '0 16px', borderRadius: 10, border: 0, background: accent, color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>Nueva evolución</button>
        </div>
      </section>

      <div style={S.grid3}>
        <section style={S.tarjeta}>
          <h2 style={S.h2}>Datos y contacto</h2>
          <div style={S.campo}><span style={S.campoLabel}>Responsable</span><span style={{ fontSize: 15 }}>{sel.contacto}</span></div>
          <div style={S.campo}><span style={S.campoLabel}>Teléfono de emergencia</span><span style={{ fontSize: 15 }}>55 •••• {sel.tel}</span></div>
          <div style={S.campo}><span style={S.campoLabel}>Dieta</span><span style={{ fontSize: 15 }}>{sel.dieta}</span></div>
          <div style={S.campo}><span style={S.campoLabel}>Documentos</span><span style={{ fontSize: 15 }}>Consentimiento informado · Contrato de servicios · Identificación</span></div>
        </section>

        <section style={S.tarjeta}>
          <h2 style={S.h2}>Alergias y diagnósticos</h2>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FDE8E6', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#B42318' }}>ALERGIAS</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#5C1109' }}>{sel.alergias}</span>
          </div>
          <div style={S.campo}>
            <span style={S.campoLabel}>Diagnósticos activos</span>
            <span style={{ fontSize: 15, lineHeight: 1.5 }}>{sel.dx}</span>
          </div>
        </section>

        <section style={S.tarjeta}>
          <h2 style={S.h2}>Escalas de valoración</h2>
          {sel.escalas.map((e) => (
            <div key={e.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid #EEF1F4' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{e.name}</span>
                <span style={{ fontSize: 13, color: e.fg, fontWeight: 600 }}>{e.interp}</span>
              </div>
              <span style={{ fontSize: 24, fontWeight: 800 }}>{e.score}</span>
            </div>
          ))}
          <span style={{ fontSize: 12, color: '#5B6675' }}>Última valoración: 2 nov 2026</span>
        </section>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
        <section style={{ ...S.tarjeta, flex: '1 1 360px', minWidth: 0, gap: 10 }}>
          <h2 style={S.h2}>Medicación activa</h2>
          {sel.meds.map((m) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid #EEF1F4' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600 }}>{m.med}</span>
                <span style={{ fontSize: 13, color: '#5B6675' }}>{m.dose} · {m.via}</span>
              </div>
              <span style={{ fontWeight: 700, color: '#3D4652' }}>{m.time}</span>
            </div>
          ))}
        </section>

        <section style={{ ...S.tarjeta, flex: '1 1 360px', minWidth: 0, gap: 10 }}>
          <h2 style={S.h2}>Última evolución médica</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#2A333F' }}>{sel.nota}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid #EEF1F4', fontSize: 13, color: '#5B6675' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B6B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>{sel.firma}</span>
          </div>
        </section>
      </div>
    </>
  )
}
