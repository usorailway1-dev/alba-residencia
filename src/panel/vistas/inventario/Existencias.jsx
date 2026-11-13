import { Fragment } from 'react'

const S = {
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#5B6675' },
  kpiValue: { fontSize: 28, fontWeight: 800 },
  barraSuperior: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  grupo: { background: '#F7F9FA', fontWeight: 700 },
  avatar: { width: 30, height: 30, borderRadius: 15, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  barra: { height: 6, width: 120, borderRadius: 3, background: '#EEF1F4', overflow: 'hidden', marginTop: 6 },
  chip: { padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }
}

const Celdas = ({ f }) => (
  <>
    <td style={{ color: '#3D4652' }}>{f.lote || '—'}</td>
    <td>{f.caducidadTexto}</td>
    <td>
      <span style={{ fontWeight: 700 }}>{f.existencias}</span>
      <span style={{ fontSize: 13, color: '#5B6675' }}> {f.unidad}</span>
      <div style={S.barra}><div style={{ height: 6, width: f.barraPct, background: f.barraColor }} /></div>
      <span style={{ fontSize: 12, color: '#5B6675' }}>mínimo {f.minimo}</span>
    </td>
    <td style={{ color: '#3D4652' }}>{f.cobertura}</td>
    <td><span style={{ ...S.chip, background: f.bg, color: f.fg }}>{f.estado}</span></td>
  </>
)

export default function Existencias({ accent, grupos, general, totalRef, nBajos, nCaducidad, onEntrada }) {
  return (
    <>
      <section style={S.kpiGrid}>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Referencias</span>
          <span style={S.kpiValue}>{totalRef}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>botiquines individuales y almacén</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Stock bajo</span>
          <span style={{ ...S.kpiValue, color: nBajos ? '#8A5300' : '#1B2430' }}>{nBajos}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>en o por debajo del mínimo</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Caducidades</span>
          <span style={{ ...S.kpiValue, color: nCaducidad ? '#B42318' : '#1B2430' }}>{nCaducidad}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>vencidas o en los próximos 30 días</span>
        </div>
      </section>

      <div style={S.barraSuperior}>
        <span style={{ fontSize: 14, color: '#5B6675' }}>
          Cada dosis administrada en el eMAR se descuenta sola del botiquín del residente.
        </span>
        <button type="button" onClick={onEntrada}
          style={{ minHeight: 44, padding: '0 18px', borderRadius: 10, border: 0, background: accent, color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>
          + Registrar entrada
        </button>
      </div>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Botiquín por residente</h2>
          <span style={{ fontSize: 13, color: '#5B6675' }}>Lo aporta la familia · uso exclusivo del residente</span>
        </div>
        <table style={{ minWidth: 920 }}>
          <thead>
            <tr>
              <th>Medicamento</th><th>Lote</th><th>Caducidad</th><th>Existencias</th><th>Cobertura</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map((g) => (
              <Fragment key={g.rid}>
                <tr style={S.grupo}>
                  <td colSpan={6}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={S.avatar}>{g.ini}</div>
                      <span>{g.persona}</span>
                      <span style={{ fontWeight: 400, fontSize: 13, color: '#5B6675' }}>Hab. {g.habitacion}</span>
                    </div>
                  </td>
                </tr>
                {g.filas.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.nombre}</td>
                    <Celdas f={f} />
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Almacén general</h2>
          <span style={{ fontSize: 13, color: '#5B6675' }}>Insumos que compra la residencia</span>
        </div>
        <table style={{ minWidth: 920 }}>
          <thead>
            <tr>
              <th>Artículo</th><th>Lote</th><th>Caducidad</th><th>Existencias</th><th>Cobertura</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {general.map((f) => (
              <tr key={f.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{f.nombre}</span>
                    {f.retirado && <span style={{ fontSize: 13, color: '#B42318' }}>{f.retirado}</span>}
                  </div>
                </td>
                <Celdas f={f} />
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
