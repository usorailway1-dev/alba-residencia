import { useState } from 'react'
import { tone, ini, byId } from '../data/alba.js'
import { AHORA, HOY_ISO, HOY_TEXTO, fechaCorta, diasPara } from '../data/fechas.js'
import { personal } from '../data/personal.js'
import {
  AVISO_CADUCIDAD, PROVEEDOR,
  articulosIniciales, solicitudesIniciales, controladosIniciales, movimientosIniciales
} from '../data/inventario.js'

/* Cuánto se pide al reponer: un mes de consumo para un medicamento y dos
   semanas para un insumo, nunca menos del doble del mínimo. */
const sugerir = (a) => {
  const dias = a.medId ? 30 : 14
  return Math.max(a.minimo * 2, a.porDia * dias)
}

/** 5 dosis a 2 al día → "2.5 días". Se recorta el ".0" de los enteros. */
const coberturaTexto = (a) => {
  if (!a.porDia) return 'Según necesidad'
  return `${Number((a.existencias / a.porDia).toFixed(1))} días`
}

export function useInventario(anotar) {
  const [sub, setSub] = useState('existencias')
  const [articulos, setArticulos] = useState(articulosIniciales)
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales)
  const [controlados, setControlados] = useState(controladosIniciales)
  const [movimientos, setMovimientos] = useState(movimientosIniciales)
  const [modal, setModal] = useState(null)   // { tipo: 'entrada' | 'movimiento' } | null

  const cerrarModal = () => setModal(null)
  const cambiar = (id, cambio) => setArticulos((prev) => prev.map((a) => (a.id === id ? { ...a, ...cambio } : a)))

  /** Lo llama el eMAR al administrar una dosis: ahí es donde se descuenta. */
  const descontarPorMed = (medId) => setArticulos((prev) => prev.map((a) => (
    a.medId === medId ? { ...a, existencias: Math.max(0, a.existencias - a.porToma) } : a
  )))

  // --- Solicitudes de reposición ---
  const solicitar = (a) => {
    const destino = a.rid ? `Familia de ${byId[a.rid].name}` : `Proveedor · ${PROVEEDOR}`
    setSolicitudes((prev) => [{
      id: 's' + (prev.length + 1),
      articuloId: a.id, nombre: a.nombre, destino,
      cantidad: sugerir(a), unidad: a.unidad,
      fecha: HOY_TEXTO, estado: 'Enviada',
      nota: a.rid ? 'Solicitada desde inventario' : 'Pedido abierto, sin confirmar'
    }, ...prev])
    anotar({
      modulo: 'Inventario', accion: 'Solicitó una reposición',
      detalle: `${a.nombre} · ${sugerir(a)} ${a.unidad} · ${destino}.`
    })
  }

  const pendienteDe = (articuloId) => solicitudes.find((s) => s.articuloId === articuloId && s.estado !== 'Recibida')

  const recibir = (s) => {
    setSolicitudes((prev) => prev.map((x) => (
      x.id === s.id ? { ...x, estado: 'Recibida', nota: `Recibida el ${HOY_TEXTO} · registró L. Pérez` } : x
    )))
    setArticulos((prev) => prev.map((a) => (
      a.id === s.articuloId ? { ...a, existencias: a.existencias + s.cantidad } : a
    )))
    anotar({
      modulo: 'Inventario', accion: 'Registró una recepción',
      detalle: `${s.nombre} · +${s.cantidad} ${s.unidad} · ${s.destino}.`
    })
  }

  /* Retirar un lote caducado y pedir el repuesto es un solo gesto: lo que se
     retira hay que reponerlo, y así no queda el hueco sin registrar. */
  const retirarLote = (a) => {
    cambiar(a.id, { existencias: 0, lote: null, caducidad: null, retirado: `Lote ${a.lote} retirado el ${HOY_TEXTO}` })
    anotar({
      modulo: 'Inventario', accion: 'Retiró un lote caducado',
      detalle: `${a.nombre} · lote ${a.lote} · ${a.existencias} ${a.unidad} dados de baja.`
    })
    if (!pendienteDe(a.id)) solicitar(a)
  }

  const guardarEntrada = (datos) => {
    const a = articulos.find((x) => x.id === datos.articuloId)
    cambiar(a.id, {
      existencias: a.existencias + Number(datos.cantidad),
      lote: datos.lote || a.lote,
      caducidad: datos.caducidad || a.caducidad,
      retirado: null
    })
    anotar({
      modulo: 'Inventario', accion: 'Registró una entrada',
      detalle: `${a.nombre} · +${datos.cantidad} ${a.unidad}` +
        `${datos.lote ? ` · lote ${datos.lote}` : ''}.`
    })
    cerrarModal()
  }

  // --- Filas de existencias ---
  const fila = (a) => {
    const dias = a.caducidad ? diasPara(a.caducidad) : null
    const caducado = dias !== null && dias < 0
    const porCaducar = dias !== null && dias >= 0 && dias <= AVISO_CADUCIDAD
    const bajo = a.existencias <= a.minimo

    let estado = 'En existencia'
    let t = tone.ok
    if (caducado) { estado = `Caducado hace ${Math.abs(dias)} d`; t = tone.bad }
    else if (a.existencias === 0) { estado = 'Agotado'; t = tone.bad }
    else if (bajo) { estado = 'Stock bajo'; t = tone.warn }
    else if (porCaducar) { estado = `Caduca en ${dias} d`; t = tone.warn }

    const sol = pendienteDe(a.id)
    return {
      ...a, dias, caducado, porCaducar, bajo,
      estado, bg: t.bg, fg: t.fg,
      persona: a.rid ? byId[a.rid].name : null,
      habitacion: a.rid ? byId[a.rid].room : null,
      caducidadTexto: a.caducidad ? fechaCorta(a.caducidad) : 'Sin caducidad',
      cobertura: coberturaTexto(a),
      // La barra se llena al doble del mínimo: ahí es donde deja de preocupar.
      barraPct: Math.min(100, Math.round(a.existencias / Math.max(1, a.minimo * 2) * 100)) + '%',
      barraColor: (caducado || a.existencias === 0) ? '#B42318' : bajo ? '#9A5B1C' : t.fg,
      sugerido: sugerir(a),
      solicitud: sol,
      solicitar: () => solicitar(a),
      retirarLote: () => retirarLote(a)
    }
  }

  const filas = articulos.map(fila)

  /* Botiquines agrupados por residente, en el orden del catálogo de residentes. */
  const grupos = []
  filas.filter((f) => f.rid).forEach((f) => {
    let g = grupos.find((x) => x.rid === f.rid)
    if (!g) {
      g = { rid: f.rid, persona: f.persona, habitacion: f.habitacion, ini: ini(f.persona), filas: [] }
      grupos.push(g)
    }
    g.filas.push(f)
  })
  const general = filas.filter((f) => !f.rid)

  const bajos = filas.filter((f) => f.bajo && !f.caducado)
  const caducidades = filas.filter((f) => f.caducado || f.porCaducar)
  const nAlertas = bajos.length + caducidades.length

  /* Aviso de la vista de Medicación: solo medicamentos, que es lo que importa
     en plena ronda. Con los datos de muestra sale una sola línea. */
  const avisoMedicacion = bajos.filter((f) => f.medId).map((f) => {
    const frase = `${f.nombre}: quedan ${f.existencias} ${f.unidad} (${f.cobertura}).`
    if (!f.solicitud) return `${frase} Falta pedir la reposición.`
    if (!f.rid) return `${frase} Pedido al proveedor el ${f.solicitud.fecha}.`
    return `${frase} Se generó solicitud de reposición a la familia de ${byId[f.rid].name}.`
  })

  // --- Solicitudes para la tabla ---
  const estadoSolicitud = { Enviada: tone.warn, Confirmada: tone.info, Recibida: tone.ok }
  const solicitudFilas = solicitudes.map((s) => ({
    ...s,
    bg: estadoSolicitud[s.estado].bg, fg: estadoSolicitud[s.estado].fg,
    puedeRecibir: s.estado !== 'Recibida',
    recibir: () => recibir(s)
  }))
  const pendientes = solicitudes.filter((s) => s.estado !== 'Recibida').length

  /* --- Controlados: el saldo sale del libro, no de un campo aparte ---
     Ni `ajustar` ni `guardarMovimiento` llaman a `anotar`: el libro ya es un
     registro con fecha, hora, responsable, testigo y folio, y la bitácora de
     Reportes lo lee tal cual. Anotarlo además lo duplicaría. */
  const ordenados = [...movimientos].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
  const saldos = {}
  const conSaldo = ordenados.map((m) => {
    saldos[m.kid] = (saldos[m.kid] || 0) + m.delta
    return { ...m, saldo: saldos[m.kid] }
  })

  const porIdControlado = Object.fromEntries(controlados.map((k) => [k.id, k]))
  const libro = [...conSaldo].reverse().map((m) => ({
    ...m,
    articulo: porIdControlado[m.kid].nombre,
    unidad: porIdControlado[m.kid].unidad,
    persona: m.rid ? byId[m.rid].name : '—',
    fechaTexto: fechaCorta(m.fecha),
    deltaTexto: (m.delta > 0 ? '+' : '−') + Math.abs(m.delta),
    deltaFg: m.delta > 0 ? tone.ok.fg : m.tipo === 'Ajuste' ? tone.bad.fg : '#262A1B'
  }))

  const ajustar = (k) => {
    setMovimientos((prev) => [...prev, {
      id: 'mv' + (prev.length + 1), kid: k.id, fecha: HOY_ISO, hora: AHORA,
      tipo: 'Ajuste', delta: -k.descuadre, rid: k.rid,
      responsable: 'Laura Pérez Mendoza', testigo: 'Norma Jiménez Castro',
      folio: 'Acta de descuadre'
    }])
    setControlados((prev) => prev.map((x) => (x.id === k.id ? { ...x, descuadre: 0, conteo: `${HOY_TEXTO}, ${AHORA}` } : x)))
  }

  const tarjetas = controlados.map((k) => ({
    ...k,
    saldo: saldos[k.id] || 0,
    fisico: (saldos[k.id] || 0) - k.descuadre,
    persona: k.rid ? byId[k.rid].name : 'Botiquín de la residencia',
    habitacion: k.rid ? byId[k.rid].room : null,
    movimientos: libro.filter((m) => m.kid === k.id).length,
    ajustar: () => ajustar(k)
  }))
  const descuadres = controlados.filter((k) => k.descuadre !== 0).length

  const guardarMovimiento = (datos) => {
    const signo = datos.tipo === 'Entrada' ? 1 : -1
    setMovimientos((prev) => [...prev, {
      id: 'mv' + (prev.length + 1), kid: datos.kid, fecha: HOY_ISO, hora: AHORA,
      tipo: datos.tipo, delta: signo * Number(datos.cantidad),
      rid: porIdControlado[datos.kid].rid,
      responsable: datos.responsable, testigo: datos.testigo, folio: datos.folio
    }])
    cerrarModal()
  }

  const subtabs = [
    ['existencias', 'Existencias', 0],
    ['alertas', 'Alertas', nAlertas],
    ['reposiciones', 'Reposiciones', pendientes],
    ['controlados', 'Controlados', descuadres]
  ].map(([id, label, aviso]) => ({ id, label, aviso, activo: sub === id, ir: () => setSub(id) }))

  return {
    sub, subtabs,
    grupos, general, totalRef: filas.length,
    nBajos: bajos.length, nCaducidad: caducidades.length,
    bajos, caducidades, nAlertas,
    solicitudes: solicitudFilas, pendientes,
    tarjetas, libro, descuadres,
    articulos: filas, controlados, personal,
    saldoDe: (kid) => saldos[kid] || 0,
    modal, cerrarModal,
    abrirEntrada: () => setModal({ tipo: 'entrada' }),
    abrirMovimiento: () => setModal({ tipo: 'movimiento' }),
    guardarEntrada, guardarMovimiento,
    irAlertas: () => setSub('alertas'),
    descontarPorMed, avisoMedicacion
  }
}
