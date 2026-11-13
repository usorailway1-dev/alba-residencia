import { useState } from 'react'

const S = {
  tablaCard: { flex: '3 1 520px', minWidth: 0, background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, overflowX: 'auto' },
  tablaHead: { padding: '18px 20px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  form: { flex: '2 1 300px', minWidth: 0, background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: '#3D4652' },
  input: { height: 44, border: '1px solid #DCE1E7', borderRadius: 9, padding: '0 10px', boxSizing: 'border-box' },
  select: { height: 44, border: '1px solid #DCE1E7', borderRadius: 9, padding: '0 10px', background: '#FFFFFF', color: '#1B2430' },
  textarea: { border: '1px solid #DCE1E7', borderRadius: 9, padding: 10, resize: 'vertical' },
  aviso: { padding: '10px 12px', borderRadius: 9, background: '#E3F3EF', color: '#0B6B5C', fontSize: 13, fontWeight: 600, lineHeight: 1.45 }
}

const VACIO = { pa: '', fc: '', t: '', glu: '', nota: '' }

export default function Enfermeria({ accent, vitals, residentes, onGuardar, ahora }) {
  const [rid, setRid] = useState('r3')
  const [f, setF] = useState(VACIO)
  const [guardado, setGuardado] = useState(null)
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }))

  const completo = f.pa.trim() && f.fc.trim() && f.t.trim() && f.glu.trim()

  const guardar = () => {
    if (!completo) {
      setGuardado({ ok: false, texto: 'Faltan datos: presión, frecuencia, temperatura y glucosa son obligatorios.' })
      return
    }
    onGuardar(rid, { pa: f.pa.trim(), fc: f.fc.trim(), t: f.t.trim(), glu: f.glu.trim(), nota: f.nota.trim() })
    const r = residentes.find((x) => x.id === rid)
    setGuardado({
      ok: true,
      texto: `Registro guardado a las ${ahora} para ${r.name}. La tabla ya muestra los nuevos valores.` +
        (f.nota.trim() ? ' La nota de turno quedó adjunta.' : '')
    })
    setF(VACIO)
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
      <section style={S.tablaCard}>
        <div style={S.tablaHead}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Signos vitales · toma de las 07:00</h2>
          <span style={{ fontSize: 13, color: '#5B6675' }}>Valores fuera de rango resaltados</span>
        </div>
        <table style={{ minWidth: 640 }}>
          <thead>
            <tr><th>Residente</th><th>Presión</th><th>FC</th><th>Temp.</th><th>Glucosa</th><th>SpO₂</th></tr>
          </thead>
          <tbody>
            {vitals.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600 }}>{v.name}</td>
                <td style={{ color: v.paFg, fontWeight: v.paW }}>{v.pa}</td>
                <td>{v.fc}</td>
                <td style={{ color: v.tFg, fontWeight: v.tW }}>{v.t} °C</td>
                <td style={{ color: v.gFg, fontWeight: v.gW }}>{v.glu} mg/dL</td>
                <td>{v.spo} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <form style={S.form} onSubmit={(e) => { e.preventDefault(); guardar() }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Registrar signos vitales</h2>
        <label style={S.label}>Residente
          <select value={rid} onChange={(e) => { setRid(e.target.value); setGuardado(null) }} style={S.select}>
            {residentes.map((r) => <option key={r.id} value={r.id}>{r.name} · {r.room}</option>)}
          </select>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <label style={S.label}>Presión arterial<input type="text" value={f.pa} onChange={set('pa')} placeholder="120/80" style={S.input} /></label>
          <label style={S.label}>Frec. cardiaca<input type="text" value={f.fc} onChange={set('fc')} placeholder="lpm" style={S.input} /></label>
          <label style={S.label}>Temperatura<input type="text" value={f.t} onChange={set('t')} placeholder="°C" style={S.input} /></label>
          <label style={S.label}>Glucosa<input type="text" value={f.glu} onChange={set('glu')} placeholder="mg/dL" style={S.input} /></label>
        </div>
        <label style={S.label}>Nota de turno
          <textarea rows="3" value={f.nota} onChange={set('nota')} placeholder="Observaciones, ingesta, ánimo, sueño…" style={S.textarea} />
        </label>
        {guardado && (
          <span style={{ ...S.aviso, background: guardado.ok ? '#E3F3EF' : '#FFF1D6', color: guardado.ok ? '#0B6B5C' : '#8A5300' }} role="status">
            {guardado.texto}
          </span>
        )}
        <button type="submit" style={{ minHeight: 46, borderRadius: 10, border: 0, background: accent, color: '#FFFFFF', fontWeight: 700, fontSize: 15 }}>
          Guardar registro
        </button>
      </form>
    </div>
  )
}
