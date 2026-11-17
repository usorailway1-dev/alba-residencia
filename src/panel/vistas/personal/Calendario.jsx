import { Fragment } from 'react'
import { DIAS, TURNOS, CLAVES_TURNO } from '../../../data/personal.js'

const S = {
  tarjeta: { background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 14, overflowX: 'auto' },
  cabecera: { padding: '18px 20px 6px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  h2: { margin: 0, fontSize: 18, fontWeight: 700 },
  areaFila: { background: '#FAF8F1', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6A6C5A' },
  avatar: { width: 34, height: 34, borderRadius: 17, background: '#F4D9B8', color: '#5A3410', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  celda: { width: '100%', minHeight: 38, borderRadius: 9, border: '1px solid transparent', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  menu: { position: 'absolute', top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: 168, background: '#FFFFFF', border: '1px solid #E5E1D5', borderRadius: 10, boxShadow: '0 12px 28px rgba(0,0,0,.16)', padding: 5, display: 'flex', flexDirection: 'column', gap: 2 },
  opcion: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 36, padding: '0 8px', border: 0, borderRadius: 7, background: 'transparent', fontSize: 13, fontWeight: 600, textAlign: 'left' },
  punto: { width: 18, height: 18, borderRadius: 5, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aviso: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: '#FBE7E3', color: '#5C1109', fontSize: 14 },
  chipHueco: { padding: '3px 9px', borderRadius: 999, background: '#FFFFFF', color: '#B42318', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' },
  leyenda: { display: 'flex', flexWrap: 'wrap', gap: 14, padding: '12px 20px 18px', fontSize: 13, color: '#6A6C5A' }
}

export default function Calendario({ grupos, huecos, totalTurnos, cerrarCelda }) {
  return (
    <>
      {huecos.length > 0 && (
        <section style={S.aviso}>
          <strong style={{ whiteSpace: 'nowrap' }}>Cobertura incompleta</strong>
          <span>{huecos.length} turnos de la semana se quedan sin personal de enfermería:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {huecos.map((h) => (
              <span key={h.clave} style={S.chipHueco}>{h.dia.corto} {h.dia.num} · {h.turno.nombre}</span>
            ))}
          </div>
        </section>
      )}

      <section style={S.tarjeta} onMouseLeave={cerrarCelda}>
        <div style={S.cabecera}>
          <h2 style={S.h2}>Semana del 9 al 15 de noviembre</h2>
          <span style={{ fontSize: 13, color: '#6A6C5A' }}>
            {totalTurnos} turnos asignados · toca una casilla para cambiarla
          </span>
        </div>

        <table style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 230 }}>Persona</th>
              {DIAS.map((d) => (
                <th key={d.i} style={{ textAlign: 'center', color: d.hoy ? '#4C6B27' : undefined }}>
                  {d.corto} {d.num}{d.hoy ? ' · hoy' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grupos.map((g) => (
              <Fragment key={g.area}>
                <tr>
                  <td colSpan={8} style={S.areaFila}>{g.area}</td>
                </tr>
                {g.gente.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={S.avatar}>{p.ini}</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{p.name}</span>
                          <span style={{ fontSize: 13, color: '#6A6C5A' }}>{p.rol}</span>
                        </div>
                      </div>
                    </td>
                    {p.dias.map((d) => (
                      <td key={d.dia} style={{ position: 'relative', textAlign: 'center', padding: '6px 8px' }}>
                        <button
                          type="button" onClick={d.abrir} aria-expanded={d.abierta}
                          aria-label={`${p.name}, ${DIAS[d.dia].corto} ${DIAS[d.dia].num}: ${d.turno.nombre}`}
                          style={{ ...S.celda, background: d.turno.bg, color: d.turno.fg, borderColor: d.abierta ? d.turno.fg : 'transparent' }}
                        >
                          {d.clave === 'D' ? 'Descanso' : d.turno.nombre}
                        </button>
                        {d.abierta && (
                          <div style={S.menu} role="menu">
                            {CLAVES_TURNO.map((clave) => {
                              const t = TURNOS[clave]
                              return (
                                <button key={clave} type="button" role="menuitem" style={S.opcion}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F4F2EA' }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                                  onClick={() => d.asignar(clave)}>
                                  <span style={{ ...S.punto, background: t.bg, color: t.fg }}>{t.clave}</span>
                                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{t.nombre}</span>
                                    <span style={{ fontSize: 11, fontWeight: 500, color: '#6A6C5A' }}>{t.horario}</span>
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>

        <div style={S.leyenda}>
          {CLAVES_TURNO.map((clave) => {
            const t = TURNOS[clave]
            return (
              <span key={clave} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...S.punto, background: t.bg, color: t.fg }}>{t.clave}</span>
                {t.nombre} {t.inicio && `· ${t.horario}`}
              </span>
            )
          })}
        </div>
      </section>
    </>
  )
}
