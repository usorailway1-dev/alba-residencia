import Indicadores from './Indicadores.jsx'
import Expedientes from './Expedientes.jsx'
import Bitacora from './Bitacora.jsx'
import Financieros from './Financieros.jsx'

/* Mismas píldoras que los otros tres módulos desarrollados. El estado vive en
   usePanel porque este módulo lee de todos los demás: indicadores, expedientes
   y bitácora se arman con lo que hacen las otras pantallas. */
const S = {
  tabs: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tab: { display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 16px', borderRadius: 999, fontWeight: 600, fontSize: 14 },
  aviso: { minWidth: 20, height: 20, padding: '0 6px', boxSizing: 'border-box', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
}

export default function Reportes({ accent, rep }) {
  return (
    <>
      <div role="group" aria-label="Secciones de reportes" style={S.tabs}>
        {rep.subtabs.map((t) => (
          <button key={t.id} type="button" onClick={t.ir} aria-pressed={t.activo ? 'true' : 'false'}
            style={{
              ...S.tab,
              border: `1px solid ${t.activo ? '#12322F' : '#DCE1E7'}`,
              background: t.activo ? '#12322F' : '#FFFFFF',
              color: t.activo ? '#FFFFFF' : '#1B2430'
            }}>
            {t.label}
            {t.aviso > 0 && (
              <span style={{ ...S.aviso, background: t.activo ? 'rgba(255,255,255,.2)' : '#FDE8E6', color: t.activo ? '#FFFFFF' : '#B42318' }}>
                {t.aviso}
              </span>
            )}
          </button>
        ))}
      </div>

      {rep.sub === 'indicadores' && (
        <Indicadores accent={accent} tarjetas={rep.tarjetas} senales={rep.senales} meses={rep.meses}
          transcurridos={rep.transcurridos} diasMes={rep.diasMes} />
      )}
      {rep.sub === 'expedientes' && (
        <Expedientes accent={accent} fichas={rep.fichas} listos={rep.listos}
          conPendientes={rep.conPendientes} porVencerTotal={rep.porVencerTotal}
          total={rep.totalFichas} onCaratula={rep.exportarCaratula} />
      )}
      {rep.sub === 'bitacora' && (
        <Bitacora accent={accent} entradas={rep.entradas} filtros={rep.filtros}
          hoy={rep.hoyEnBitacora} total={rep.totalBitacora} onExportar={rep.exportarBitacora} />
      )}
      {rep.sub === 'financieros' && (
        <Financieros accent={accent} cuentas={rep.cuentas} finanzas={rep.finanzas}
          facturado={rep.facturadoTexto} cobrado={rep.cobradoTexto}
          porCobrar={rep.porCobrarTexto} carteraVencida={rep.carteraVencidaTexto}
          pctCobranza={rep.pctCobranza} nVencidas={rep.nVencidas}
          timbradas={rep.timbradas} totalCuentas={rep.totalCuentas}
          ocupadas={rep.ocupadas} camas={rep.camas} />
      )}
    </>
  )
}
