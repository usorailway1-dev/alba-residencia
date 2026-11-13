import { useState } from 'react'
import {
  tone, money, ini, depLabel, nortonLabel, tinettiLabel, residents, meds, billsRaw
} from '../data/alba.js'
import { AHORA, HOY_ISO, HOY_TEXTO, fechaCorta, diasPara, masMeses } from '../data/fechas.js'
import {
  CAMAS, DIAS_NOVIEMBRE, TRANSCURRIDOS_NOVIEMBRE, BASE_NOVIEMBRE,
  historico, DOCUMENTOS, OBLIGATORIOS, expedientesIniciales,
  USUARIO, bitacoraInicial
} from '../data/reportes.js'
import { personal } from '../data/personal.js'
import { imprimir, htmlExpediente, htmlCaratula, htmlBitacora } from './documentos.js'

/* El libro de controlados guarda el nombre de quien firma, no su puesto. */
const ROL_DE = Object.fromEntries(personal.map((p) => [p.name, p.rol]))

/** Un documento se marca en ámbar cuando le quedan 30 días o menos. */
const AVISO_DOC = 30

const red = (n) => Math.round(n * 10) / 10

/** Un mes en curso solo ha corrido una parte de sus días. */
const diasEfectivos = (m) => (m.enCurso ? m.transcurridos : m.dias)

/*
 * Los cuatro indicadores de la tarjeta del prototipo. Cada uno lleva, además
 * del conteo, una tasa normalizada: comparar las 3 caídas de un octubre
 * completo contra la 1 de un noviembre que lleva 9 días no dice nada, pero
 * las caídas por 1 000 días-residente sí se pueden comparar.
 */
const INDICADORES = [
  {
    clave: 'ocupacion', titulo: 'Ocupación media', subeEsBueno: true,
    valor: (m) => m.ocupadas,
    texto: (m) => `${m.ocupadas} / ${CAMAS}`,
    tasa: (m) => Math.round((m.ocupadas / CAMAS) * 100),
    tasaTexto: (v) => `${v} % de las camas`,
    pie: 'Camas ocupadas de las 48 autorizadas.'
  },
  {
    clave: 'caidas', titulo: 'Caídas', subeEsBueno: false,
    valor: (m) => m.caidas,
    texto: (m) => String(m.caidas),
    tasa: (m) => red((m.caidas * 1000) / (m.ocupadas * diasEfectivos(m))),
    tasaTexto: (v) => `${v} por 1 000 días-residente`,
    pie: 'Toda caída cuenta, se haya lesionado o no el residente.'
  },
  {
    clave: 'ulceras', titulo: 'Úlceras por presión', subeEsBueno: false,
    valor: (m) => m.ulceras,
    texto: (m) => String(m.ulceras),
    tasa: (m) => red((m.ulceras / m.ocupadas) * 100),
    tasaTexto: (v) => `${v} % de prevalencia`,
    pie: 'Úlceras aparecidas ya dentro de la residencia, no las de ingreso.'
  },
  {
    clave: 'incidentes', titulo: 'Incidentes registrados', subeEsBueno: false,
    valor: (m) => m.incidentes,
    texto: (m) => String(m.incidentes),
    tasa: (m) => red((m.incidentes * 1000) / (m.ocupadas * diasEfectivos(m))),
    tasaTexto: (v) => `${v} por 1 000 días-residente`,
    pie: 'Total del mes: las caídas y las úlceras van incluidas aquí dentro.'
  }
]

/*
 * La bitácora vive aparte del resto del módulo porque usePanel tiene que
 * repartir `anotar` a los otros hooks, y esos se llaman antes que useReportes.
 */
export function useBitacora() {
  const [entradas, setEntradas] = useState(bitacoraInicial)

  /** Una línea por acción. Por omisión la firma quien tiene la sesión abierta. */
  const anotar = (e) => setEntradas((prev) => [...prev, {
    id: 'b' + (prev.length + 1),
    fecha: HOY_ISO, hora: AHORA,
    quien: USUARIO.nombre, rol: USUARIO.rol,
    ...e
  }])

  return { entradas, anotar }
}

export function useReportes(f) {
  const [sub, setSub] = useState('indicadores')
  const [expedientes, setExpedientes] = useState(expedientesIniciales)
  const [verRid, setVerRid] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  const sello = `${HOY_TEXTO}, ${AHORA}`

  // ---------------------------------------------------------------
  // Indicadores
  // ---------------------------------------------------------------

  /* Noviembre no está en data/reportes.js: se cuenta con lo que haya pasado
     en la app. El tipo del incidente lo trae el formulario de reporte. */
  const delTipo = (t) => f.incidentes.filter((i) => i.tipo === t).length
  const noviembre = {
    id: 'nov', mes: 'Nov', nombre: 'Noviembre 2026',
    dias: DIAS_NOVIEMBRE, transcurridos: TRANSCURRIDOS_NOVIEMBRE, enCurso: true,
    ocupadas: 42 + f.altas.length,
    caidas: BASE_NOVIEMBRE.caidas + delTipo('Caída'),
    ulceras: BASE_NOVIEMBRE.ulceras + delTipo('Úlcera'),
    incidentes: BASE_NOVIEMBRE.incidentes + f.incidentes.length
  }
  const meses = [...historico, noviembre]

  const tarjetas = INDICADORES.map((ind) => {
    const serie = meses.map((m) => ({
      id: m.id, mes: m.mes, nombre: m.nombre, enCurso: !!m.enCurso,
      valor: ind.valor(m), tasa: ind.tasa(m)
    }))
    const tope = Math.max(...serie.map((s) => s.valor), 1)
    const actual = serie[serie.length - 1]
    const previo = serie[serie.length - 2]
    const delta = red(actual.tasa - previo.tasa)
    const mejora = ind.subeEsBueno ? delta >= 0 : delta <= 0

    return {
      ...ind,
      valorTexto: ind.texto(noviembre),
      tasaTexto: ind.tasaTexto(actual.tasa),
      previoTexto: ind.texto(historico[historico.length - 1]),
      delta,
      tendencia: delta === 0
        ? 'Igual que octubre'
        : `${delta > 0 ? '▲' : '▼'} ${Math.abs(delta)} frente a octubre`,
      tendenciaBg: delta === 0 ? tone.gray.bg : mejora ? tone.ok.bg : tone.bad.bg,
      tendenciaFg: delta === 0 ? tone.gray.fg : mejora ? tone.ok.fg : tone.bad.fg,
      barras: serie.map((s) => ({
        ...s,
        /* Un 3 % de alto deja ver la barra del mes que cerró en cero: un hueco
           y un cero no son lo mismo. */
        alto: Math.max(3, Math.round((s.valor / tope) * 100)) + '%'
      }))
    }
  })

  /* Lo que los otros tres módulos ya saben y que en una inspección se pregunta. */
  const senales = [
    {
      clave: 'huecos', label: 'Huecos de cobertura', valor: f.personal.huecos.length,
      sub: 'Turnos de enfermería sin nadie asignado esta semana', cta: 'Ver turnos', ir: f.ir.personal
    },
    {
      clave: 'certs', label: 'Certificaciones vencidas', valor: f.personal.vencidas,
      sub: `${f.personal.porVencer} más vencen en menos de 60 días`, cta: 'Ver certificaciones', ir: f.ir.personal
    },
    {
      clave: 'descuadres', label: 'Descuadres de controlados', valor: f.inventario.descuadres,
      sub: 'Diferencias entre el libro y el conteo físico', cta: 'Ver libro', ir: f.ir.inventario
    },
    {
      clave: 'inventario', label: 'Alertas de inventario', valor: f.inventario.nAlertas,
      sub: 'Stock bajo y lotes caducados o por caducar', cta: 'Ver alertas', ir: f.ir.inventario
    },
    {
      clave: 'ingesta', label: 'Ingesta insuficiente', valor: f.cocina.insuficientes.length,
      sub: 'Residentes que hoy comieron poco o nada', cta: 'Ver ingesta', ir: f.ir.cocina
    }
  ].map((s) => ({ ...s, bg: s.valor > 0 ? tone.warn.bg : tone.ok.bg, fg: s.valor > 0 ? tone.warn.fg : tone.ok.fg }))

  // ---------------------------------------------------------------
  // Expedientes
  // ---------------------------------------------------------------

  const marcar = (rid, d) => {
    setExpedientes((prev) => ({
      ...prev,
      [rid]: {
        ...(prev[rid] || {}),
        [d.clave]: { fecha: HOY_ISO, vence: d.vigenciaMeses ? masMeses(HOY_ISO, d.vigenciaMeses) : null }
      }
    }))
    f.anotar({
      modulo: 'Residentes',
      accion: 'Actualizó el expediente',
      detalle: `${f.porId[rid].name} · ${d.nombre}.`
    })
  }

  const expedienteDe = (r) => {
    const guardados = expedientes[r.id] || {}

    const docs = DOCUMENTOS.map((d) => {
      const g = guardados[d.clave]
      const dias = g?.vence ? diasPara(g.vence) : null
      const falta = !g
      const vencido = dias !== null && dias < 0
      const porVencer = dias !== null && dias >= 0 && dias <= AVISO_DOC

      let estado = 'Al corriente'
      let t = tone.ok
      let clase = 'bien'
      if (falta) {
        estado = d.obligatorio ? 'Falta' : 'No otorgada'
        t = d.obligatorio ? tone.bad : tone.gray
        clase = d.obligatorio ? 'mal' : ''
      } else if (vencido) {
        estado = `Vencido hace ${Math.abs(dias)} d`
        t = tone.bad
        clase = 'mal'
      } else if (porVencer) {
        estado = `Vence en ${dias} d`
        t = tone.warn
        clase = 'ojo'
      }

      return {
        ...d, falta, vencido, porVencer, estado, clase, bg: t.bg, fg: t.fg,
        fechaTexto: g ? fechaCorta(g.fecha) : '—',
        venceTexto: g?.vence ? fechaCorta(g.vence) : (g ? 'Sin vencimiento' : '—'),
        marcar: () => marcar(r.id, d)
      }
    })

    const entregados = docs.filter((d) => d.obligatorio && !d.falta).length
    const faltan = docs.filter((d) => d.obligatorio && d.falta).length
    const vencidos = docs.filter((d) => d.vencido).length
    const porVencer = docs.filter((d) => d.porVencer).length
    const pendiente = faltan + vencidos

    let resumen = 'Listo para inspección'
    let t = tone.ok
    let clase = 'bien'
    if (faltan && vencidos) { resumen = `${faltan} sin entregar · ${vencidos} vencido${vencidos > 1 ? 's' : ''}`; t = tone.bad; clase = 'mal' }
    else if (faltan) { resumen = `${faltan} documento${faltan > 1 ? 's' : ''} sin entregar`; t = tone.bad; clase = 'mal' }
    else if (vencidos) { resumen = `${vencidos} documento${vencidos > 1 ? 's' : ''} vencido${vencidos > 1 ? 's' : ''}`; t = tone.bad; clase = 'mal' }
    else if (porVencer) { resumen = `${porVencer} por vencer`; t = tone.warn; clase = 'ojo' }

    return {
      rid: r.id, nombre: r.name, habitacion: r.room, exp: r.exp, ini: ini(r.name),
      docs, entregados, obligatorios: OBLIGATORIOS, faltan, vencidos, porVencer, pendiente,
      pct: Math.round((entregados / OBLIGATORIOS) * 100),
      resumen, clase, bg: t.bg, fg: t.fg,
      abierto: verRid === r.id,
      abrir: () => setVerRid((x) => (x === r.id ? null : r.id)),
      exportar: () => exportarExpediente(r)
    }
  }

  const fichas = f.todos.map(expedienteDe)
  const conPendientes = fichas.filter((e) => e.pendiente > 0).length
  const listos = fichas.length - conPendientes
  const porVencerTotal = fichas.reduce((n, e) => n + e.porVencer, 0)

  function exportarExpediente(r) {
    const e = expedienteDe(r)
    const evo = f.evoluciones[r.id]
    const dieta = f.cocina.dietaDe[r.id]

    imprimir(`Expediente ${r.exp} · ${r.name}`, htmlExpediente({
      residente: r,
      dieta: dieta
        ? `${dieta.etiqueta}${dieta.consistencia !== 'Normal' ? ` · consistencia ${dieta.consistencia.toLowerCase()}` : ''}`
        : (r.dieta || 'Sin indicación registrada'),
      escalas: [
        { name: 'Barthel (AVD)', score: r.barthel, interp: 'Dependencia ' + depLabel(r.barthel).toLowerCase() },
        { name: 'Norton', score: r.norton, interp: nortonLabel(r.norton) },
        { name: 'Tinetti', score: r.tinetti, interp: tinettiLabel(r.tinetti) }
      ],
      meds: meds.filter((m) => m.r === r.id)
        .map((m) => ({ ...m, time: m.time === 'PRN' ? 'Según necesidad' : m.time + ' h' })),
      nota: evo?.nota || r.nota,
      firma: evo?.firma || 'Firmada por Dra. Ana Morales · Céd. Prof. ••••••• · 8 nov 2026, 11:20 · Registro inmutable',
      documentos: e.docs,
      sello, quien: USUARIO.nombre, cuando: sello
    }))

    f.anotar({
      modulo: 'Residentes',
      accion: 'Exportó el expediente en PDF',
      detalle: `${r.name} · expediente ${r.exp}.`
    })
  }

  const exportarCaratula = () => {
    imprimir('Carátula de inspección · 9 nov 2026', htmlCaratula({
      corte: sello,
      transcurridos: TRANSCURRIDOS_NOVIEMBRE, diasMes: DIAS_NOVIEMBRE,
      indicadores: tarjetas.map((t) => ({
        titulo: t.titulo, valorTexto: t.valorTexto, previoTexto: t.previoTexto, tasaTexto: t.tasaTexto
      })),
      expedientes: fichas,
      personal: {
        total: f.personal.personal.length,
        dentro: f.personal.dentro,
        huecos: f.personal.huecos.length,
        vencidas: f.personal.vencidas,
        porVencer: f.personal.porVencer
      },
      controlados: f.inventario.descuadres,
      sello, quien: USUARIO.nombre, cuando: sello
    }))

    f.anotar({
      modulo: 'Sistema',
      accion: 'Exportó la carátula de inspección',
      detalle: `Corte al ${sello} · NOM-031-SSA3-2012.`
    })
  }

  // ---------------------------------------------------------------
  // Bitácora
  // ---------------------------------------------------------------

  /* El libro de controlados no se duplica en la bitácora: ya es un registro
     legal con hora, responsable, testigo y folio, así que se lee de ahí. */
  const deControlados = f.inventario.libro.map((m) => ({
    id: 'k-' + m.id, fecha: m.fecha, hora: m.hora,
    quien: m.responsable, rol: ROL_DE[m.responsable] || 'Enfermería', modulo: 'Inventario',
    accion: `${m.tipo} en el libro de controlados`,
    detalle: `${m.articulo} · ${m.deltaTexto} ${m.unidad}` +
      `${m.persona !== '—' ? ` · ${m.persona}` : ''} · folio ${m.folio} · testigo ${m.testigo}.`
  }))

  /* El reloj del prototipo está parado en las 09:41, así que todo lo que se
     haga en la sesión comparte hora. El índice desempata: las dos listas se
     juntan de más antigua a más reciente y lo último entrado queda arriba. */
  const todasEntradas = [...f.bitacora, ...deControlados.slice().reverse()]
    .map((e, i) => ({ ...e, i, orden: `${e.fecha}T${e.hora}`, fechaTexto: fechaCorta(e.fecha) }))
    .sort((a, b) => b.orden.localeCompare(a.orden) || b.i - a.i)

  const cuentaPorModulo = {}
  todasEntradas.forEach((e) => { cuentaPorModulo[e.modulo] = (cuentaPorModulo[e.modulo] || 0) + 1 })

  const filtros = [
    { id: 'todos', label: 'Todo', n: todasEntradas.length },
    ...Object.keys(cuentaPorModulo).sort().map((m) => ({ id: m, label: m, n: cuentaPorModulo[m] }))
  ].map((x) => ({ ...x, activo: filtro === x.id, ir: () => setFiltro(x.id) }))

  const entradas = filtro === 'todos' ? todasEntradas : todasEntradas.filter((e) => e.modulo === filtro)
  const hoyEnBitacora = todasEntradas.filter((e) => e.fecha === HOY_ISO).length

  const exportarBitacora = () => {
    imprimir('Bitácora de auditoría', htmlBitacora({
      subtitulo: filtro === 'todos'
        ? `${entradas.length} movimientos · corte al ${sello}`
        : `Módulo ${filtro} · ${entradas.length} movimientos · corte al ${sello}`,
      entradas, sello, quien: USUARIO.nombre, cuando: sello
    }))
  }

  // ---------------------------------------------------------------
  // Financieros
  // ---------------------------------------------------------------

  const cuentas = billsRaw.map((b) => {
    const saldo = b.amount - b.paid
    let estado = 'Pagada'
    let t = tone.ok
    if (b.late) { estado = 'Vencida · pago parcial'; t = tone.bad }
    else if (saldo > 0) { estado = `Pendiente · ${b.due}`; t = tone.warn }
    return {
      id: b.id, nombre: f.porId[b.r].name, habitacion: f.porId[b.r].room,
      monto: b.amount, pagado: b.paid, saldo, vencida: !!b.late,
      montoTexto: money(b.amount), pagadoTexto: money(b.paid), saldoTexto: money(saldo),
      estado, bg: t.bg, fg: t.fg,
      cfdi: !!f.cfdi[b.id]
    }
  })

  const facturado = cuentas.reduce((s, c) => s + c.monto, 0)
  const cobrado = cuentas.reduce((s, c) => s + c.pagado, 0)
  const porCobrar = facturado - cobrado
  const vencidas = cuentas.filter((c) => c.vencida)
  const carteraVencida = vencidas.reduce((s, c) => s + c.saldo, 0)
  const timbradas = cuentas.filter((c) => c.cfdi).length

  const serieFinanciera = [...historico, { ...noviembre, facturado, cobrado }].map((m) => ({
    id: m.id, mes: m.mes, nombre: m.nombre, enCurso: !!m.enCurso,
    facturado: m.facturado, cobrado: m.cobrado,
    facturadoTexto: money(m.facturado), cobradoTexto: money(m.cobrado),
    pct: Math.round((m.cobrado / m.facturado) * 100)
  }))
  const topeFinanciero = Math.max(...serieFinanciera.map((m) => m.facturado))
  const finanzas = serieFinanciera.map((m) => ({
    ...m,
    altoFacturado: Math.round((m.facturado / topeFinanciero) * 100) + '%',
    altoCobrado: Math.round((m.cobrado / topeFinanciero) * 100) + '%'
  }))

  // ---------------------------------------------------------------

  const subtabs = [
    ['indicadores', 'Indicadores', 0],
    ['expedientes', 'Expedientes', conPendientes],
    ['bitacora', 'Bitácora de auditoría', 0],
    ['financieros', 'Financieros', vencidas.length]
  ].map(([id, label, aviso]) => ({ id, label, aviso, activo: sub === id, ir: () => setSub(id) }))

  return {
    sub, subtabs,
    nAlertas: conPendientes + vencidas.length,
    // Indicadores
    tarjetas, senales, meses, noviembre,
    transcurridos: TRANSCURRIDOS_NOVIEMBRE, diasMes: DIAS_NOVIEMBRE,
    // Expedientes
    fichas, conPendientes, listos, porVencerTotal, totalFichas: fichas.length,
    exportarCaratula,
    // Bitácora
    entradas, filtros, filtro, hoyEnBitacora, totalBitacora: todasEntradas.length,
    exportarBitacora,
    // Financieros
    cuentas, finanzas, timbradas, totalCuentas: cuentas.length,
    facturadoTexto: money(facturado), cobradoTexto: money(cobrado),
    porCobrarTexto: money(porCobrar), carteraVencidaTexto: money(carteraVencida),
    pctCobranza: Math.round((cobrado / facturado) * 100),
    nVencidas: vencidas.length,
    residentesMuestra: residents.length, camas: CAMAS, ocupadas: noviembre.ocupadas
  }
}
