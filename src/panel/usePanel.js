import { useState } from 'react'
import { ACCENT, START_VIEW } from '../config.js'
import {
  tone, money, ini, depLabel, nortonLabel, tinettiLabel,
  residents, meds, GIVEN_INICIAL, billsRaw, CFDI_INICIAL, vitalsRaw,
  agenda, modulos, titles
} from '../data/alba.js'
import { AHORA } from '../data/fechas.js'
import { useInventario } from './useInventario.js'
import { useCocina } from './useCocina.js'
import { usePersonal } from './usePersonal.js'
import { useBitacora, useReportes } from './useReportes.js'

const ENFERMERA = 'L. Pérez'

/* Los cuatro módulos de "Gestión" del prototipo ya están desarrollados, así
   que la lista está vacía. Se deja el mecanismo —y la tarjeta punteada que
   lo pinta— por si más adelante se añade un módulo nuevo. */
const MODULOS_PENDIENTES = []

/**
 * Port de `renderVals()` de diseno-original/Main.dc.html, más el estado de los
 * formularios que el prototipo original dejaba sin conectar (incidentes,
 * evoluciones, altas, tomas PRN y registro de signos).
 */
export function usePanel() {
  const [view, setView] = useState(START_VIEW)
  const [sel, setSel] = useState('r3')
  const [fil, setFil] = useState('todos')
  const [given, setGiven] = useState(GIVEN_INICIAL)
  const [cfdi, setCfdi] = useState(CFDI_INICIAL)

  // Estado añadido: lo que antes no hacía nada.
  const [incidentes, setIncidentes] = useState([])
  const [evoluciones, setEvoluciones] = useState({})   // rid -> { nota, firma }
  const [altas, setAltas] = useState([])               // residentes dados de alta
  const [tomasPrn, setTomasPrn] = useState({})         // medId -> hora
  const [registros, setRegistros] = useState({})       // rid -> { pa, fc, t, glu, nota }
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(null)             // { tipo, rid } | null

  /*
   * Los módulos de Gestión cuelgan de aquí, no de sus vistas, por tres razones
   * distintas: el eMAR descuenta del inventario, la agenda de Inicio lee las
   * dietas de cocina, y Reportes lee de los cuatro a la vez. De paso, el
   * estado deja de reiniciarse cada vez que se cambia de pantalla.
   *
   * `anotar` va primero porque los demás hooks escriben en la bitácora.
   */
  const { entradas: bitacora, anotar } = useBitacora()
  const inventario = useInventario(anotar)
  const cocina = useCocina(anotar)
  const personal = usePersonal(anotar)

  const accent = ACCENT
  const go = (v) => () => setView(v)
  const abrirFicha = (rid) => { setSel(rid); setView('ficha') }

  // Catálogo vivo: los de muestra más los dados de alta en esta sesión.
  const todos = [...residents, ...altas]
  const porId = Object.fromEntries(todos.map((r) => [r.id, r]))

  // --- eMAR ---
  const medRows = meds.map((m) => {
    const r = porId[m.r]
    const isPrn = m.time === 'PRN'
    const isGiven = !!given[m.id]
    const prnTomada = isPrn && !!tomasPrn[m.id]
    let status = 'Programada'
    let t = tone.info
    if (isPrn) { status = 'Según necesidad'; t = tone.gray }
    else if (isGiven) { status = 'Administrada'; t = tone.ok }
    else if (m.time <= '09:00') { status = 'Retrasada'; t = tone.bad }
    return {
      ...m,
      res: r.name, room: r.room, alergia: r.alergias,
      status, bg: t.bg, fg: t.fg,
      isPrn, isGiven, prnTomada,
      canGive: !isPrn && !isGiven,
      puedeTomar: isPrn && !prnTomada,
      givenAt: given[m.id] || tomasPrn[m.id] || '',
      give: () => {
        setGiven((g) => ({ ...g, [m.id]: AHORA }))
        inventario.descontarPorMed(m.id)
        anotar({ modulo: 'Medicación', accion: 'Administró una dosis', detalle: `${m.med} · ${m.dose} · ${r.name} (${r.room}).` })
      },
      tomar: () => {
        setTomasPrn((t2) => ({ ...t2, [m.id]: AHORA }))
        inventario.descontarPorMed(m.id)
        anotar({ modulo: 'Medicación', accion: 'Registró una toma según necesidad', detalle: `${m.med} · ${m.dose} · ${r.name} (${r.room}).` })
      }
    }
  })
  const sched = medRows.filter((m) => !m.isPrn)
  const givenCount = sched.filter((m) => m.isGiven).length
  const late = sched.filter((m) => m.status === 'Retrasada').length

  // --- Facturación ---
  let tot = 0
  let paid = 0
  const bills = billsRaw.map((b) => {
    tot += b.amount
    paid += b.paid
    const saldo = b.amount - b.paid
    let estado = 'Pagado'
    let t = tone.ok
    if (b.late) { estado = 'Vencido · pago parcial'; t = tone.bad }
    else if (saldo > 0) { estado = 'Pendiente · ' + b.due; t = tone.warn }
    const has = !!cfdi[b.id]
    return {
      id: b.id, name: porId[b.r].name,
      amount: money(b.amount), saldo: money(saldo),
      estado, bg: t.bg, fg: t.fg,
      hasCfdi: has, noCfdi: !has,
      emit: () => {
        setCfdi((c) => ({ ...c, [b.id]: true }))
        anotar({
          modulo: 'Facturación', accion: 'Timbró un CFDI 4.0',
          detalle: `${porId[b.r].name} · ${money(b.amount)} · mensualidad de noviembre.`
        })
      }
    }
  })
  const due = tot - paid

  /* Reportes va al final de la cadena: no tiene datos propios más allá del
     histórico de meses cerrados y de los expedientes; todo lo demás lo cuenta
     de lo que hay en los otros módulos. */
  const reportes = useReportes({
    bitacora, anotar,
    incidentes, altas, evoluciones, cfdi, todos, porId,
    inventario, cocina, personal,
    ir: { personal: go('personal'), inventario: go('inventario'), cocina: go('cocina') }
  })

  // --- Navegación ---
  const nav = (list) => list.map(([id, label, count]) => ({
    id, label, go: go(id),
    bg: (view === id || (id === 'residentes' && view === 'ficha')) ? 'rgba(255,255,255,.14)' : 'transparent',
    weight: view === id ? 700 : 500,
    hasCount: !!count, count: count || ''
  }))
  const navMain = nav([
    ['inicio', 'Inicio', 0],
    ['residentes', 'Residentes', 0],
    ['medicacion', 'Medicación (eMAR)', late],
    ['enfermeria', 'Enfermería', 0],
    ['facturacion', 'Facturación', 0]
  ])
  const navMore = nav([
    ['personal', 'Personal y turnos', 0],
    ['inventario', 'Inventario', inventario.nAlertas],
    ['cocina', 'Cocina y dietas', cocina.nAlertas],
    ['reportes', 'Reportes e inspecciones', reportes.nAlertas]
  ])

  // --- Residentes y filtros ---
  const filters = [['todos', 'Todos'], ['bad', 'Atención'], ['warn', 'Vigilancia'], ['ok', 'Estables']]
    .map(([id, label]) => ({
      id, label,
      pressed: fil === id ? 'true' : 'false',
      pick: () => setFil(id),
      bg: fil === id ? '#3A4523' : '#FFFFFF',
      fg: fil === id ? '#FFFFFF' : '#262A1B',
      border: fil === id ? '#3A4523' : '#DCD6C6'
    }))
  const resList = todos
    .filter((r) => fil === 'todos' || r.t === fil)
    .map((r) => ({
      ...r, ini: ini(r.name), dep: depLabel(r.barthel),
      bg: tone[r.t].bg, fg: tone[r.t].fg,
      open: () => abrirFicha(r.id)
    }))

  // --- Ficha del residente seleccionado ---
  const s = porId[sel] || todos[2]
  /* Los textos están en data/alba.js porque el expediente en PDF usa los
     mismos cortes; aquí solo quedan los colores, que son cosa de la ficha. */
  const nortonFg = s.norton <= 12 ? tone.bad.fg : s.norton <= 14 ? tone.warn.fg : tone.ok.fg
  const tinettiFg = s.tinetti < 19 ? tone.bad.fg : s.tinetti <= 24 ? tone.warn.fg : tone.ok.fg
  const barthelFg = s.barthel <= 40 ? tone.bad.fg : s.barthel <= 60 ? tone.warn.fg : tone.ok.fg
  const evo = evoluciones[s.id]
  const selected = {
    ...s, ini: ini(s.name), bg: tone[s.t].bg, fg: tone[s.t].fg,
    nota: evo?.nota || s.nota,
    firma: evo?.firma || 'Firmada por Dra. Ana Morales · Céd. Prof. ••••••• · 8 nov 2026, 11:20 · Registro inmutable',
    escalas: [
      { name: 'Barthel (AVD)', score: s.barthel, interp: 'Dependencia ' + depLabel(s.barthel).toLowerCase(), fg: barthelFg },
      { name: 'Norton', score: s.norton, interp: nortonLabel(s.norton), fg: nortonFg },
      { name: 'Tinetti', score: s.tinetti, interp: tinettiLabel(s.tinetti), fg: tinettiFg }
    ],
    meds: meds
      .filter((m) => m.r === s.id)
      .map((m) => ({ ...m, time: m.time === 'PRN' ? 'Según necesidad' : m.time + ' h' }))
  }

  // --- Signos vitales ---
  const vrow = ([id, pa, fc, t, glu, spo]) => {
    const sys = parseInt(pa, 10)
    const paBad = sys >= 160
    const paWarn = sys >= 135 && !paBad
    const tHigh = Number(t) >= 37.5
    const gHigh = Number(glu) >= 180
    return {
      id, name: porId[id].name, pa, fc, t: Number(t).toFixed(1), glu, spo,
      paFg: paBad ? tone.bad.fg : paWarn ? tone.warn.fg : '#262A1B',
      paW: (paBad || paWarn) ? 700 : 400,
      tFg: tHigh ? tone.warn.fg : '#262A1B', tW: tHigh ? 700 : 400,
      gFg: gHigh ? tone.warn.fg : '#262A1B', gW: gHigh ? 700 : 400
    }
  }
  /* Un registro guardado reemplaza la toma de las 07:00 del residente; si es
     alguien dado de alta hoy, se añade como fila nueva. */
  const base = vitalsRaw.map((v) => (registros[v[0]]
    ? [v[0], registros[v[0]].pa, registros[v[0]].fc, registros[v[0]].t, registros[v[0]].glu, v[5]]
    : v))
  const extra = Object.entries(registros)
    .filter(([rid]) => !vitalsRaw.some((v) => v[0] === rid))
    .map(([rid, g]) => [rid, g.pa, g.fc, g.t, g.glu, '—'])
  const vitals = [...base, ...extra].map(vrow)

  // --- Alertas (las dos fijas del prototipo + las reportadas en esta sesión) ---
  const alertasIncidentes = incidentes.map((inc) => ({
    key: inc.id, tag: 'Incidente', title: inc.titulo, detail: inc.detalle,
    cta: 'Ver ficha', bg: tone.bad.bg, fg: tone.bad.fg,
    go: () => abrirFicha(inc.rid)
  }))
  const alerts = [
    ...alertasIncidentes,
    {
      key: 'caida', tag: 'Incidente', title: 'Roberto Hernández · caída nocturna',
      detail: '23:40 en baño de 104-A. Contusión leve, febrícula 37.8 °C. Rx de cadera solicitada.',
      cta: 'Ver ficha', bg: tone.bad.bg, fg: tone.bad.fg,
      go: () => abrirFicha('r4')
    },
    {
      key: 'signos', tag: 'Signos', title: 'Carmen Ruiz · presión arterial 165/95',
      detail: 'Fuera de rango en la toma de las 07:00. Nueva toma indicada a las 10:00.',
      cta: 'Ver ficha', bg: tone.warn.bg, fg: tone.warn.fg,
      go: () => abrirFicha('r3')
    },
    {
      key: 'medicacion', tag: 'Medicación', title: late + ' dosis retrasadas en la ronda de 08:00',
      detail: 'Pendientes de registrar en el eMAR del turno matutino.',
      cta: 'Ir a la ronda', bg: tone.info.bg, fg: tone.info.fg,
      go: go('medicacion')
    }
  ].filter((a) => a.tag !== 'Medicación' || late > 0)

  // --- KPIs ---
  const ocupadas = 42 + altas.length
  const pctOcup = Math.round(ocupadas / 48 * 100)
  const nIncidentes = 1 + incidentes.length
  const kpis = [
    { label: 'Ocupación', value: `${ocupadas} / 48`, sub: `${pctOcup} % de camas ocupadas · 2 ingresos en proceso`, pct: pctOcup + '%', bar: accent, color: '#262A1B' },
    { label: 'Medicación del turno', value: givenCount + ' / ' + sched.length, sub: late > 0 ? late + ' retrasadas' : 'Ronda al día', pct: Math.round(givenCount / sched.length * 100) + '%', bar: accent, color: '#262A1B' },
    { label: 'Alertas activas', value: String(alerts.length), sub: `${nIncidentes} incidente${nIncidentes > 1 ? 's' : ''} · signos fuera de rango`, pct: '30%', bar: '#B42318', color: '#B42318' },
    { label: 'Por cobrar (noviembre)', value: money(due).replace(' MXN', ''), sub: '1 cuenta vencida', pct: Math.round(due / tot * 100) + '%', bar: '#9A5B1C', color: '#262A1B' }
  ]

  // --- Buscador del encabezado ---
  const q = busqueda.trim().toLowerCase()
  const resultados = q.length < 2 ? [] : [
    ...todos
      .filter((r) => r.name.toLowerCase().includes(q) || r.room.toLowerCase().includes(q))
      .map((r) => ({ clave: 'r-' + r.id, tipo: 'Residente', label: r.name, sub: `Hab. ${r.room} · ${r.estado || 'Estable'}`, ir: () => abrirFicha(r.id) })),
    ...meds
      .filter((m) => m.med.toLowerCase().includes(q))
      .map((m) => ({ clave: 'm-' + m.id, tipo: 'Medicamento', label: m.med, sub: `${porId[m.r].name} · ${m.time === 'PRN' ? 'Según necesidad' : m.time}`, ir: go('medicacion') }))
  ].slice(0, 6)

  // --- Acciones de los formularios ---
  const cerrarModal = () => setModal(null)
  const acciones = {
    reportarIncidente: (rid) => setModal({ tipo: 'incidente', rid }),
    nuevaEvolucion: (rid) => setModal({ tipo: 'evolucion', rid }),
    nuevoResidente: () => setModal({ tipo: 'residente' }),

    guardarIncidente: (datos) => {
      setIncidentes((prev) => [{ id: 'inc' + (prev.length + 1), ...datos }, ...prev])
      anotar({
        modulo: 'Residentes', accion: 'Reportó incidente',
        detalle: `${porId[datos.rid].name} · ${datos.tipoTexto} · ${datos.detalle}`
      })
      cerrarModal()
      setView('inicio')
    },
    guardarEvolucion: (rid, datos) => {
      setEvoluciones((prev) => ({ ...prev, [rid]: datos }))
      anotar({
        modulo: 'Residentes', accion: 'Firmó nota de evolución',
        detalle: `${porId[rid].name} (${porId[rid].room}). Registro inmutable.`
      })
      cerrarModal()
    },
    guardarResidente: (datos) => {
      const id = 'n' + (altas.length + 1)
      setAltas((prev) => [...prev, {
        ...datos, id,
        ingreso: 'nov 2026',
        exp: String(190 + prev.length + 1).padStart(4, '0'),
        estado: { ok: 'Estable', warn: 'Vigilancia', bad: 'Atención' }[datos.t],
        nota: 'Ingreso reciente. Pendiente de primera valoración integral.'
      }])
      anotar({
        modulo: 'Residentes', accion: 'Registró un ingreso',
        detalle: `${datos.name} · habitación ${datos.room}. Expediente sin documentar.`
      })
      cerrarModal()
      setFil('todos')
      setView('residentes')
    },
    guardarSignos: (rid, datos) => {
      setRegistros((prev) => ({ ...prev, [rid]: datos }))
      anotar({
        modulo: 'Enfermería', accion: 'Registró signos vitales',
        detalle: `${porId[rid].name} · TA ${datos.pa} · FC ${datos.fc} · ${datos.t} °C · glucosa ${datos.glu} mg/dL.`
      })
    }
  }

  const modulo = modulos[view] || modulos.inventario

  return {
    accent, view, navMain, navMore, kpis, alerts, filters, resList,
    sel: selected, medRows, vitals, bills, modulo,
    inventario, cocina, personal, reportes,
    /* La línea de la comida ya no es texto fijo: la cuenta de dietas
       especiales y consistencias sale del módulo de Cocina. */
    agenda: agenda.map((g) => (g.title === 'Comida' ? { ...g, where: cocina.resumenComida } : g)),
    todos, porId, registros,
    busqueda, setBusqueda, resultados,
    modal, cerrarModal, acciones,
    pageTitle: view === 'personal' ? 'Personal y turnos' : (titles[view] || modulo.title),
    isInicio: view === 'inicio',
    isResidentes: view === 'residentes',
    isFicha: view === 'ficha',
    isMed: view === 'medicacion',
    isEnf: view === 'enfermeria',
    isFact: view === 'facturacion',
    isPersonal: view === 'personal',
    isInventario: view === 'inventario',
    isCocina: view === 'cocina',
    isReportes: view === 'reportes',
    isModulo: MODULOS_PENDIENTES.includes(view),
    givenCount, schedCount: sched.length,
    givenPct: Math.round(givenCount / sched.length * 100) + '%',
    billTotal: money(tot), billPaid: money(paid), billDue: money(due),
    goEnf: go('enfermeria'), goMed: go('medicacion'), goRes: go('residentes'),
    // Desde la ronda se salta directo a las alertas, no al listado completo.
    goInv: () => { setView('inventario'); inventario.irAlertas() },
    enfermera: ENFERMERA, ahora: AHORA
  }
}
