import { useState } from 'react'
import { tone, ini, byId } from '../data/alba.js'
import { AHORA } from '../data/fechas.js'
import { DIAS } from '../data/personal.js'
import {
  TIEMPOS, DIETAS, ALERGENOS, NIVELES,
  dietasIniciales, menuInicial, ingestaInicial, comprasIniciales, CATEGORIAS_COMPRA
} from '../data/cocina.js'

const porIdNivel = Object.fromEntries(NIVELES.map((n) => [n.id, n]))

/** 'HH:MM' en minutos, para saber qué tiempo de comida ya pasó. */
const enMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function useCocina(anotar) {
  const [sub, setSub] = useState('menu')
  const [dia, setDia] = useState(0)                   // 0 = lunes 9, hoy
  const [menu, setMenu] = useState(menuInicial)
  const [dietas, setDietas] = useState(dietasIniciales)
  const [ingesta, setIngesta] = useState(ingestaInicial)
  const [compras, setCompras] = useState(comprasIniciales)
  const [celda, setCelda] = useState(null)            // { rid, tiempo } con el menú abierto
  const [modal, setModal] = useState(null)            // { tipo, ... } | null

  const cerrarModal = () => setModal(null)
  const cerrarCelda = () => setCelda(null)

  // --- Dietas por residente ---
  const dietaDe = Object.fromEntries(dietas.map((d) => [d.rid, d]))
  const especiales = dietas.filter((d) => !d.etiqueta.startsWith('Normal')).length
  const modificadas = dietas.filter((d) => d.consistencia !== 'Normal')
  const todasBlandas = modificadas.every((d) => d.consistencia === 'Blanda')

  /* Esta frase alimenta la agenda de Inicio, que en el prototipo decía
     "3 dietas especiales · 2 consistencias blandas" como texto fijo. */
  const adjetivo = todasBlandas ? 'bland' : 'modificad'
  const resumenComida =
    `${especiales} dieta${especiales === 1 ? '' : 's'} especial${especiales === 1 ? '' : 'es'} · ` +
    `${modificadas.length} consistencia${modificadas.length === 1 ? '' : 's'} ` +
    `${adjetivo}${modificadas.length === 1 ? 'a' : 'as'}`

  const cuantosCon = (flag) => dietas.filter((d) => d.flags.includes(flag)).length
  const quienesCon = (flag) => dietas.filter((d) => d.flags.includes(flag)).map((d) => byId[d.rid].name)

  const dietaFilas = dietas.map((d) => {
    const r = byId[d.rid]
    return {
      ...d, nombre: r.name, habitacion: r.room, ini: ini(r.name),
      etiquetas: d.flags.map((f) => DIETAS[f].label),
      alergias: d.evitar.map((a) => ALERGENOS[a].label),
      especial: !d.etiqueta.startsWith('Normal'),
      consistenciaBg: d.consistencia === 'Normal' ? tone.gray.bg : tone.info.bg,
      consistenciaFg: d.consistencia === 'Normal' ? tone.gray.fg : tone.info.fg,
      editar: () => setModal({ tipo: 'dieta', rid: d.rid })
    }
  })

  const guardarDieta = (rid, datos) => {
    setDietas((prev) => prev.map((d) => (d.rid === rid ? { ...d, ...datos } : d)))
    anotar({
      modulo: 'Cocina', accion: 'Cambió la indicación dietética',
      detalle: `${byId[rid].name} · ${datos.etiqueta} · consistencia ${datos.consistencia.toLowerCase()}.`
    })
    cerrarModal()
  }

  // --- Menú del día seleccionado ---
  const ahora = enMinutos(AHORA)
  const esHoy = dia === 0

  const tiempoDelMenu = (t) => {
    const m = menu[dia][t.id]
    const servido = esHoy && enMinutos(t.hora) < ahora

    /* Solo se listan los ajustes que hoy le tocan a alguien: si nadie es
       diabético, sobra decir cómo se adapta el plato. */
    const ajustes = Object.entries(m.ajustes)
      .map(([clave, texto]) => {
        const n = clave === 'blanda' ? modificadas.length : cuantosCon(clave)
        const quienes = clave === 'blanda'
          ? modificadas.map((d) => byId[d.rid].name)
          : quienesCon(clave)
        return {
          clave, texto, n, quienes,
          label: clave === 'blanda' ? 'Consistencia modificada' : DIETAS[clave].label
        }
      })
      .filter((a) => a.n > 0)

    const conflictos = m.alergenos.flatMap((a) => dietas
      .filter((d) => d.evitar.includes(a))
      .map((d) => ({
        clave: `${t.id}-${a}-${d.rid}`,
        alergeno: ALERGENOS[a].label,
        nombre: byId[d.rid].name,
        alternativa: m.alternativas[a] || null
      })))

    return {
      ...t, plato: m.plato, ajustes, conflictos,
      sinResolver: conflictos.filter((c) => !c.alternativa),
      servido,
      alergenos: m.alergenos.map((a) => ALERGENOS[a].label),
      editar: () => setModal({ tipo: 'menu', dia, tiempo: t.id })
    }
  }

  const tiemposDelDia = TIEMPOS.map(tiempoDelMenu)
  const diasMenu = DIAS.map((d) => ({ ...d, activo: d.i === dia, ir: () => setDia(d.i) }))

  /* Un alérgeno sin alternativa registrada es lo único que el menú marca en
     rojo: el resto de adaptaciones son trabajo normal de cocina. */
  const pendientesMenu = Object.keys(menu).reduce((n, d) => n + TIEMPOS.filter((t) => {
    const m = menu[d][t.id]
    return m.alergenos.some((a) => dietas.some((x) => x.evitar.includes(a)) && !m.alternativas[a])
  }).length, 0)

  const guardarMenu = (datos) => {
    setMenu((prev) => ({
      ...prev,
      [datos.dia]: {
        ...prev[datos.dia],
        [datos.tiempo]: {
          ...prev[datos.dia][datos.tiempo],
          plato: datos.plato,
          alergenos: datos.alergenos,
          alternativas: datos.alternativas
        }
      }
    }))
    anotar({
      modulo: 'Cocina', accion: 'Cambió el menú',
      detalle: `${DIAS[datos.dia].corto} · ${TIEMPOS.find((t) => t.id === datos.tiempo).nombre.toLowerCase()} · ${datos.plato}.`
    })
    cerrarModal()
  }

  // --- Registro de ingesta (siempre el día de hoy) ---
  const registrar = (rid, tiempoId, nivel) => {
    setIngesta((prev) => ({ ...prev, [`${rid}-${tiempoId}`]: { nivel, hora: AHORA, nota: '' } }))
    anotar({
      modulo: 'Cocina', accion: 'Registró la ingesta',
      detalle: `${byId[rid].name} · ${TIEMPOS.find((t) => t.id === tiempoId).nombre.toLowerCase()} · ` +
        `${porIdNivel[nivel].label.toLowerCase()} (${porIdNivel[nivel].pct} %).`
    })
    setCelda(null)
  }

  const ingestaFilas = dietas.map((d) => {
    const r = byId[d.rid]
    const celdas = TIEMPOS.map((t) => {
      const reg = ingesta[`${d.rid}-${t.id}`]
      const n = reg ? porIdNivel[reg.nivel] : null
      return {
        tiempo: t, reg, nivel: n,
        bg: n ? tone[n.tono].bg : '#F7F9FA',
        fg: n ? tone[n.tono].fg : '#5B6675',
        abierta: celda?.rid === d.rid && celda?.tiempo === t.id,
        abrir: () => setCelda((c) => (c?.rid === d.rid && c?.tiempo === t.id ? null : { rid: d.rid, tiempo: t.id })),
        poner: (nivel) => registrar(d.rid, t.id, nivel)
      }
    })
    const bajos = celdas.filter((c) => c.nivel && c.nivel.pct <= 25).length
    const registrados = celdas.filter((c) => c.reg)
    const media = registrados.length
      ? Math.round(registrados.reduce((s, c) => s + c.nivel.pct, 0) / registrados.length)
      : null
    return {
      ...d, nombre: r.name, habitacion: r.room, ini: ini(r.name),
      celdas, bajos, media,
      avisar: bajos >= 2
    }
  })

  const registrosHoy = Object.keys(ingesta).length
  const insuficientes = ingestaFilas.filter((f) => f.bajos > 0)
  const paraEnfermeria = ingestaFilas.filter((f) => f.avisar)
  const conMedia = ingestaFilas.filter((f) => f.media !== null)
  const mediaDia = conMedia.length
    ? Math.round(conMedia.reduce((s, f) => s + f.media, 0) / conMedia.length)
    : 0

  const siguiente = TIEMPOS.find((t) => enMinutos(t.hora) > ahora)

  // --- Lista de compras ---
  const gruposCompra = CATEGORIAS_COMPRA
    .map((categoria) => ({
      categoria,
      filas: compras.filter((c) => c.categoria === categoria).map((c) => ({
        ...c,
        alternar: () => setCompras((prev) => prev.map((x) => (x.id === c.id ? { ...x, comprado: !x.comprado } : x)))
      }))
    }))
    .filter((g) => g.filas.length > 0)

  const porComprar = compras.filter((c) => !c.comprado).length

  const guardarCompra = (datos) => {
    setCompras((prev) => [...prev, { id: 'q' + (prev.length + 1), ...datos, comprado: false }])
    anotar({
      modulo: 'Cocina', accion: 'Añadió a la lista de compras',
      detalle: `${datos.articulo} · ${datos.cantidad} · ${datos.categoria}.`
    })
    cerrarModal()
  }

  const subtabs = [
    ['menu', 'Menú de la semana', pendientesMenu],
    ['dietas', 'Dietas y consistencias', 0],
    ['ingesta', 'Registro de ingesta', insuficientes.length],
    ['compras', 'Lista de compras', 0]
  ].map(([id, label, aviso]) => ({ id, label, aviso, activo: sub === id, ir: () => { setSub(id); setCelda(null) } }))

  return {
    sub, subtabs,
    nAlertas: pendientesMenu + insuficientes.length,
    // Menú
    diasMenu, tiemposDelDia, diaActual: DIAS[dia], esHoy,
    comensales: dietas.length, especiales, modificadas: modificadas.length, resumenComida,
    pendientesMenu,
    // Dietas
    dietaFilas, guardarDieta, dietaDe,
    // Ingesta
    ingestaFilas, registrosHoy, insuficientes, paraEnfermeria, mediaDia, siguiente,
    cerrarCelda, totalTiempos: TIEMPOS.length * dietas.length,
    // Compras
    gruposCompra, porComprar, totalCompra: compras.length, guardarCompra,
    // Modales
    modal, cerrarModal, guardarMenu,
    menuDe: (d, t) => menu[d][t],
    abrirCompra: () => setModal({ tipo: 'compra' })
  }
}
