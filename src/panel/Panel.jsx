import { usePanel } from './usePanel.js'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import Inicio from './vistas/Inicio.jsx'
import Residentes from './vistas/Residentes.jsx'
import Ficha from './vistas/Ficha.jsx'
import Medicacion from './vistas/Medicacion.jsx'
import Enfermeria from './vistas/Enfermeria.jsx'
import Facturacion from './vistas/Facturacion.jsx'
import ModuloPorPrototipar from './vistas/ModuloPorPrototipar.jsx'
import Personal from './vistas/personal/Personal.jsx'
import Inventario from './vistas/inventario/Inventario.jsx'
import Cocina from './vistas/cocina/Cocina.jsx'
import Reportes from './vistas/reportes/Reportes.jsx'
import FormIncidente from './modales/FormIncidente.jsx'
import FormEvolucion from './modales/FormEvolucion.jsx'
import FormResidente from './modales/FormResidente.jsx'

const S = {
  shell: { minHeight: '100vh', display: 'flex', flexWrap: 'wrap', background: '#F3F5F7' },
  main: { flex: '999 1 560px', minWidth: 0, padding: '24px 32px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 }
}

export default function Panel() {
  const v = usePanel()
  const { acciones: a } = v

  return (
    <div style={S.shell}>
      <Sidebar accent={v.accent} navMain={v.navMain} navMore={v.navMore} />
      <main style={S.main}>
        <Header
          pageTitle={v.pageTitle}
          busqueda={v.busqueda}
          setBusqueda={v.setBusqueda}
          resultados={v.resultados}
          alerts={v.alerts}
        />

        {v.isInicio && (
          <Inicio
            accent={v.accent} kpis={v.kpis} alerts={v.alerts} agenda={v.agenda}
            goEnf={v.goEnf} goMed={v.goMed}
            onReportar={() => a.reportarIncidente()}
            onNuevoIngreso={a.nuevoResidente}
          />
        )}
        {v.isResidentes && (
          <Residentes accent={v.accent} filters={v.filters} resList={v.resList} onNuevo={a.nuevoResidente} />
        )}
        {v.isFicha && (
          <Ficha
            accent={v.accent} sel={v.sel} goRes={v.goRes}
            onReportar={() => a.reportarIncidente(v.sel.id)}
            onEvolucion={() => a.nuevaEvolucion(v.sel.id)}
          />
        )}
        {v.isMed && (
          <Medicacion
            accent={v.accent} medRows={v.medRows}
            givenCount={v.givenCount} schedCount={v.schedCount} givenPct={v.givenPct}
            avisoInventario={v.inventario.avisoMedicacion} irInventario={v.goInv}
          />
        )}
        {v.isEnf && (
          <Enfermeria accent={v.accent} vitals={v.vitals} residentes={v.todos} onGuardar={a.guardarSignos} ahora={v.ahora} />
        )}
        {v.isFact && (
          <Facturacion accent={v.accent} bills={v.bills} billTotal={v.billTotal} billPaid={v.billPaid} billDue={v.billDue} />
        )}
        {v.isPersonal && (
          <Personal accent={v.accent} per={v.personal} />
        )}
        {v.isInventario && (
          <Inventario accent={v.accent} inv={v.inventario} />
        )}
        {v.isCocina && (
          <Cocina accent={v.accent} coc={v.cocina} />
        )}
        {v.isReportes && (
          <Reportes accent={v.accent} rep={v.reportes} />
        )}
        {v.isModulo && (
          <ModuloPorPrototipar modulo={v.modulo} />
        )}
      </main>

      {v.modal?.tipo === 'incidente' && (
        <FormIncidente
          accent={v.accent} residentes={v.todos} ridInicial={v.modal.rid}
          onCerrar={v.cerrarModal} onGuardar={a.guardarIncidente}
        />
      )}
      {v.modal?.tipo === 'evolucion' && (
        <FormEvolucion
          accent={v.accent} residente={v.porId[v.modal.rid]}
          onCerrar={v.cerrarModal}
          onGuardar={(datos) => a.guardarEvolucion(v.modal.rid, datos)}
        />
      )}
      {v.modal?.tipo === 'residente' && (
        <FormResidente accent={v.accent} onCerrar={v.cerrarModal} onGuardar={a.guardarResidente} />
      )}
    </div>
  )
}
