import Calendario from './Calendario.jsx'
import Asistencia from './Asistencia.jsx'
import Entregas from './Entregas.jsx'
import Certificaciones from './Certificaciones.jsx'
import FormEntrega from '../../modales/FormEntrega.jsx'

/* Las sub-pestañas usan el mismo patrón de píldora que los filtros de
   Residentes, para que el módulo no parezca de otra aplicación. */
const S = {
  tabs: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tab: { display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 16px', borderRadius: 999, fontWeight: 600, fontSize: 14 },
  aviso: { minWidth: 20, height: 20, padding: '0 6px', boxSizing: 'border-box', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
}

/* El estado ya no se crea aquí: vive en usePanel, porque la bitácora de
   Reportes anota los cambios de turno y las checadas, y porque así el
   calendario no se reinicia cada vez que se sale del módulo. */
export default function Personal({ accent, per: v }) {
  return (
    <>
      <div role="group" aria-label="Secciones de personal" style={S.tabs}>
        {v.subtabs.map((t) => (
          <button key={t.id} type="button" onClick={t.ir} aria-pressed={t.activo ? 'true' : 'false'}
            style={{
              ...S.tab,
              border: `1px solid ${t.activo ? '#3A4523' : '#DCD6C6'}`,
              background: t.activo ? '#3A4523' : '#FFFFFF',
              color: t.activo ? '#FFFFFF' : '#262A1B'
            }}>
            {t.label}
            {t.aviso > 0 && (
              <span style={{ ...S.aviso, background: t.activo ? 'rgba(255,255,255,.2)' : '#FBE7E3', color: t.activo ? '#FFFFFF' : '#B42318' }}>
                {t.aviso}
              </span>
            )}
          </button>
        ))}
      </div>

      {v.sub === 'calendario' && (
        <Calendario grupos={v.grupos} huecos={v.huecos} totalTurnos={v.totalTurnos} cerrarCelda={v.cerrarCelda} />
      )}
      {v.sub === 'asistencia' && (
        <Asistencia accent={accent} filas={v.asistenciaFilas} dentro={v.dentro} pendientes={v.pendientes} incidencias={v.incidencias} />
      )}
      {v.sub === 'entregas' && (
        <Entregas accent={accent} entregas={v.entregas} onNueva={v.abrirFormEntrega} />
      )}
      {v.sub === 'certificaciones' && (
        <Certificaciones filas={v.certFilas} vencidas={v.vencidas} porVencer={v.porVencer} />
      )}

      {v.verFormEntrega && (
        <FormEntrega accent={accent} personal={v.personal} onCerrar={v.cerrarFormEntrega} onGuardar={v.guardarEntrega} />
      )}
    </>
  )
}
