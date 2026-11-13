import { byId } from '../../../data/alba.js'
import Menu from './Menu.jsx'
import Dietas from './Dietas.jsx'
import Ingesta from './Ingesta.jsx'
import Compras from './Compras.jsx'
import FormDieta from '../../modales/FormDieta.jsx'
import FormMenu from '../../modales/FormMenu.jsx'
import FormCompra from '../../modales/FormCompra.jsx'
import { TIEMPOS } from '../../../data/cocina.js'

/* Mismas píldoras que los otros dos módulos desarrollados. El estado vive en
   usePanel porque la agenda de Inicio lee de aquí. */
const S = {
  tabs: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tab: { display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 16px', borderRadius: 999, fontWeight: 600, fontSize: 14 },
  aviso: { minWidth: 20, height: 20, padding: '0 6px', boxSizing: 'border-box', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
}

export default function Cocina({ accent, coc }) {
  return (
    <>
      <div role="group" aria-label="Secciones de cocina" style={S.tabs}>
        {coc.subtabs.map((t) => (
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

      {coc.sub === 'menu' && (
        <Menu accent={accent} diasMenu={coc.diasMenu} tiemposDelDia={coc.tiemposDelDia}
          comensales={coc.comensales} especiales={coc.especiales}
          resumenComida={coc.resumenComida} esHoy={coc.esHoy} />
      )}
      {coc.sub === 'dietas' && (
        <Dietas filas={coc.dietaFilas} especiales={coc.especiales} modificadas={coc.modificadas} />
      )}
      {coc.sub === 'ingesta' && (
        <Ingesta filas={coc.ingestaFilas} registrosHoy={coc.registrosHoy} totalTiempos={coc.totalTiempos}
          mediaDia={coc.mediaDia} insuficientes={coc.insuficientes} paraEnfermeria={coc.paraEnfermeria}
          siguiente={coc.siguiente} cerrarCelda={coc.cerrarCelda} />
      )}
      {coc.sub === 'compras' && (
        <Compras accent={accent} grupos={coc.gruposCompra} porComprar={coc.porComprar}
          total={coc.totalCompra} onNueva={coc.abrirCompra} />
      )}

      {coc.modal?.tipo === 'dieta' && (
        <FormDieta accent={accent} dieta={coc.dietaDe[coc.modal.rid]} nombre={byId[coc.modal.rid].name}
          onCerrar={coc.cerrarModal} onGuardar={(datos) => coc.guardarDieta(coc.modal.rid, datos)} />
      )}
      {coc.modal?.tipo === 'menu' && (
        <FormMenu accent={accent} dia={coc.modal.dia}
          tiempo={TIEMPOS.find((t) => t.id === coc.modal.tiempo)}
          comida={coc.menuDe(coc.modal.dia, coc.modal.tiempo)}
          onCerrar={coc.cerrarModal} onGuardar={coc.guardarMenu} />
      )}
      {coc.modal?.tipo === 'compra' && (
        <FormCompra accent={accent} onCerrar={coc.cerrarModal} onGuardar={coc.guardarCompra} />
      )}
    </>
  )
}
