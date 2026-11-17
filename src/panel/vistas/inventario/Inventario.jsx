import Existencias from './Existencias.jsx'
import Alertas from './Alertas.jsx'
import Reposiciones from './Reposiciones.jsx'
import Controlados from './Controlados.jsx'
import FormEntradaInventario from '../../modales/FormEntradaInventario.jsx'
import FormMovimiento from '../../modales/FormMovimiento.jsx'

/* Mismas píldoras que "Personal y turnos", para que los dos módulos nuevos se
   lean igual. El estado vive en usePanel: el eMAR necesita descontar aquí. */
const S = {
  tabs: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tab: { display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 16px', borderRadius: 999, fontWeight: 600, fontSize: 14 },
  aviso: { minWidth: 20, height: 20, padding: '0 6px', boxSizing: 'border-box', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
}

export default function Inventario({ accent, inv }) {
  return (
    <>
      <div role="group" aria-label="Secciones de inventario" style={S.tabs}>
        {inv.subtabs.map((t) => (
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

      {inv.sub === 'existencias' && (
        <Existencias
          accent={accent} grupos={inv.grupos} general={inv.general}
          totalRef={inv.totalRef} nBajos={inv.nBajos} nCaducidad={inv.nCaducidad}
          onEntrada={inv.abrirEntrada}
        />
      )}
      {inv.sub === 'alertas' && (
        <Alertas accent={accent} bajos={inv.bajos} caducidades={inv.caducidades} />
      )}
      {inv.sub === 'reposiciones' && (
        <Reposiciones solicitudes={inv.solicitudes} pendientes={inv.pendientes} />
      )}
      {inv.sub === 'controlados' && (
        <Controlados accent={accent} tarjetas={inv.tarjetas} libro={inv.libro}
          descuadres={inv.descuadres} onMovimiento={inv.abrirMovimiento} />
      )}

      {inv.modal?.tipo === 'entrada' && (
        <FormEntradaInventario accent={accent} articulos={inv.articulos}
          onCerrar={inv.cerrarModal} onGuardar={inv.guardarEntrada} />
      )}
      {inv.modal?.tipo === 'movimiento' && (
        <FormMovimiento accent={accent} controlados={inv.controlados} personal={inv.personal}
          saldoDe={inv.saldoDe} onCerrar={inv.cerrarModal} onGuardar={inv.guardarMovimiento} />
      )}
    </>
  )
}
