import { Fragment } from 'react'

const S = {
  aviso: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 14, background: '#E8EEF9', color: '#1F3A6B' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  kpi: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#5B6675' },
  kpiValue: { fontSize: 28, fontWeight: 800 },
  tarjeta: { background: '#FFFFFF', border: '1px solid #E3E7EC', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  h2: { margin: 0, fontSize: 18, fontWeight: 700 },
  avatar: { width: 34, height: 34, borderRadius: 17, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chip: { padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' },
  barra: { height: 6, borderRadius: 3, background: '#EEF1F4', overflow: 'hidden', minWidth: 110 },
  boton: { minHeight: 38, padding: '0 12px', borderRadius: 9, border: '1px solid #DCE1E7', background: '#FFFFFF', color: '#1B2430', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' },
  primario: { minHeight: 40, padding: '0 16px', borderRadius: 9, border: 0, color: '#FFFFFF', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' },
  detalle: { background: '#F8FAFB', padding: '4px 20px 18px' },
  doc: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #EEF1F4' }
}

export default function Expedientes({ accent, fichas, listos, conPendientes, porVencerTotal, total, onCaratula }) {
  return (
    <>
      <section style={S.aviso}>
        <strong style={{ whiteSpace: 'nowrap' }}>NOM-031-SSA3-2012</strong>
        <span style={{ flex: '1 1 380px' }}>
          Diez documentos por residente, nueve de ellos obligatorios. La valoración geriátrica, el
          plan de atención y el esquema de vacunación caducan: estar en la carpeta no basta.
        </span>
        <button type="button" onClick={onCaratula} style={{ ...S.primario, background: accent }}>
          Carátula de inspección (PDF)
        </button>
      </section>

      <section style={S.kpiGrid}>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Listos para inspección</span>
          <span style={{ ...S.kpiValue, color: '#0B6B5C' }}>{listos} / {total}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>expedientes completos y vigentes</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Con pendientes</span>
          <span style={{ ...S.kpiValue, color: conPendientes ? '#B42318' : '#1B2430' }}>{conPendientes}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>falta un documento o se les venció</span>
        </div>
        <div style={S.kpi}>
          <span style={S.kpiLabel}>Por vencer</span>
          <span style={{ ...S.kpiValue, color: porVencerTotal ? '#8A5300' : '#1B2430' }}>{porVencerTotal}</span>
          <span style={{ fontSize: 13, color: '#5B6675' }}>documentos con 30 días o menos de vigencia</span>
        </div>
      </section>

      <section style={S.tarjeta}>
        <div style={S.cabecera}>
          <h2 style={S.h2}>Expediente por residente</h2>
          <span style={{ fontSize: 13, color: '#5B6675' }}>Toca una fila para ver los documentos</span>
        </div>
        <table style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 260 }}>Residente</th>
              <th>Obligatorios</th>
              <th>Estado</th>
              <th><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {fichas.map((e) => (
              <Fragment key={e.rid}>
                <tr>
                  <td>
                    <button type="button" onClick={e.abrir} aria-expanded={e.abierto}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, border: 0, background: 'transparent', padding: 0, textAlign: 'left' }}>
                      <div style={S.avatar}>{e.ini}</div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{e.nombre}</span>
                        <span style={{ fontSize: 13, color: '#5B6675' }}>
                          Hab. {e.habitacion} · expediente {e.exp}
                        </span>
                      </div>
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontWeight: 600 }}>{e.entregados} / {e.obligatorios}</span>
                      <div style={S.barra}>
                        <div style={{ height: 6, width: e.pct + '%', borderRadius: 3, background: e.pct === 100 ? '#0B6B5C' : '#B4541A' }} />
                      </div>
                    </div>
                  </td>
                  <td><span style={{ ...S.chip, background: e.bg, color: e.fg }}>{e.resumen}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <button type="button" onClick={e.abrir} style={S.boton}>
                        {e.abierto ? 'Ocultar' : 'Ver documentos'}
                      </button>
                      <button type="button" onClick={e.exportar} style={S.boton}>Expediente en PDF</button>
                    </div>
                  </td>
                </tr>
                {e.abierto && (
                  <tr>
                    <td colSpan={4} style={S.detalle}>
                      {e.docs.map((d) => (
                        <div key={d.clave} style={S.doc}>
                          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>
                              {d.nombre}
                              {!d.obligatorio && <span style={{ fontWeight: 400, color: '#5B6675' }}> · opcional</span>}
                            </span>
                            <span style={{ fontSize: 13, color: '#5B6675' }}>{d.nota}</span>
                          </div>
                          <span style={{ fontSize: 13, color: '#3D4652', minWidth: 110 }}>
                            {d.fechaTexto}
                            {d.venceTexto !== '—' && d.venceTexto !== 'Sin vencimiento' && (
                              <span style={{ color: '#5B6675' }}> → {d.venceTexto}</span>
                            )}
                          </span>
                          <span style={{ ...S.chip, background: d.bg, color: d.fg }}>{d.estado}</span>
                          {(d.falta || d.vencido || d.porVencer) && (
                            <button type="button" onClick={d.marcar} style={S.boton}>
                              {!d.falta ? 'Registrar renovación' : d.obligatorio ? 'Marcar entregado' : 'Registrar documento'}
                            </button>
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
