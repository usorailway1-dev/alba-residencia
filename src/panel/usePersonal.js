import { useState } from 'react'
import { tone, ini } from '../data/alba.js'
import { AHORA, HOY_TEXTO, fechaCorta, diasPara, masUnAnio } from '../data/fechas.js'
import {
  AREAS, DIAS, TURNOS, personal, porIdPersonal,
  horarioInicial, asistenciaInicial, entregasIniciales, certificacionesIniciales
} from '../data/personal.js'

const AVISO_VENCIMIENTO = 60 // días de antelación para marcar "por vencer"

/** Convierte 'HH:MM' en minutos, para comparar horas de entrada. */
const enMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function usePersonal(anotar) {
  const [sub, setSub] = useState('calendario')
  const [horario, setHorario] = useState(horarioInicial)
  const [celda, setCelda] = useState(null)        // { pid, dia } con el menú abierto
  const [asistencia, setAsistencia] = useState(asistenciaInicial)
  const [entregas, setEntregas] = useState(entregasIniciales)
  const [certs, setCerts] = useState(certificacionesIniciales)
  const [verFormEntrega, setVerFormEntrega] = useState(false)

  // --- Calendario: filas agrupadas por área ---
  const grupos = AREAS.map((area) => ({
    area,
    gente: personal.filter((p) => p.area === area).map((p) => ({
      ...p, ini: ini(p.name),
      dias: DIAS.map((d) => ({
        dia: d.i,
        clave: horario[p.id][d.i],
        turno: TURNOS[horario[p.id][d.i]],
        abierta: celda?.pid === p.id && celda?.dia === d.i,
        abrir: () => setCelda((c) => (c?.pid === p.id && c?.dia === d.i ? null : { pid: p.id, dia: d.i })),
        asignar: (clave) => {
          setHorario((h) => ({ ...h, [p.id]: h[p.id].map((x, i) => (i === d.i ? clave : x)) }))
          anotar({
            modulo: 'Personal', accion: 'Cambió un turno',
            detalle: `${p.name} · ${d.corto} ${d.num} nov · ${TURNOS[clave].nombre.toLowerCase()}.`
          })
          setCelda(null)
        }
      }))
    }))
  }))

  /* Cobertura: cada turno de cada día necesita al menos una persona de
     Enfermería. Lo demás puede quedar descubierto sin ser crítico. */
  const huecos = []
  DIAS.forEach((d) => {
    ['M', 'V', 'N'].forEach((clave) => {
      const hay = personal.some((p) => p.area === 'Enfermería' && horario[p.id][d.i] === clave)
      if (!hay) huecos.push({ clave: `${d.i}-${clave}`, dia: d, turno: TURNOS[clave] })
    })
  })

  const totalTurnos = personal.reduce(
    (n, p) => n + horario[p.id].filter((c) => c !== 'D').length, 0
  )

  // --- Asistencia de hoy (lunes) ---
  const asistenciaFilas = personal
    .filter((p) => horario[p.id][0] !== 'D')
    .map((p) => {
      const turno = TURNOS[horario[p.id][0]]
      const reg = asistencia[p.id]
      const retardo = reg?.entrada && !reg.entradaAyer &&
        enMinutos(reg.entrada) > enMinutos(turno.inicio) + 10

      let estado = 'Pendiente'
      let t = tone.gray
      if (reg?.salida) { estado = 'Turno cerrado'; t = tone.info }
      else if (reg?.entrada) { estado = retardo ? 'Dentro · con retardo' : 'Dentro'; t = retardo ? tone.warn : tone.ok }

      return {
        ...p, ini: ini(p.name), turno, reg, retardo, estado, bg: t.bg, fg: t.fg,
        entradaTexto: reg?.entrada ? `${reg.entrada}${reg.entradaAyer ? ' (8 nov)' : ''}` : '—',
        salidaTexto: reg?.salida || '—',
        puedeEntrar: !reg?.entrada,
        puedeSalir: !!reg?.entrada && !reg?.salida,
        /* La checada la firma quien entra, no quien tiene la sesión abierta:
           es la persona la que pone el dedo en la tableta de la entrada. */
        registrarEntrada: () => {
          setAsistencia((a) => ({
            ...a, [p.id]: { entrada: AHORA, salida: null, ubicacion: 'Dentro de la residencia', ubicacionOk: true }
          }))
          anotar({
            modulo: 'Personal', quien: p.name, rol: p.rol, accion: 'Registró su entrada',
            detalle: `Turno ${turno.nombre.toLowerCase()} (${turno.horario}) · dentro de la residencia.`
          })
        },
        registrarSalida: () => {
          setAsistencia((a) => ({ ...a, [p.id]: { ...a[p.id], salida: AHORA } }))
          anotar({
            modulo: 'Personal', quien: p.name, rol: p.rol, accion: 'Registró su salida',
            detalle: `Turno ${turno.nombre.toLowerCase()} · entrada a las ${reg?.entrada || '—'}.`
          })
        }
      }
    })

  const dentro = asistenciaFilas.filter((f) => f.reg?.entrada && !f.reg?.salida).length
  const pendientes = asistenciaFilas.filter((f) => !f.reg?.entrada).length
  const incidencias = asistenciaFilas.filter((f) => f.retardo || (f.reg && !f.reg.ubicacionOk)).length

  // --- Certificaciones ---
  const certFilas = certs.map((c) => {
    const p = porIdPersonal[c.pid]
    if (!c.vence) {
      return { ...c, persona: p.name, area: p.area, ini: ini(p.name), estado: 'Sin vencimiento', bg: tone.gray.bg, fg: tone.gray.fg, venceTexto: '—', dias: null, puedeRenovar: false }
    }
    const dias = diasPara(c.vence)
    let estado = 'Vigente'
    let t = tone.ok
    if (dias < 0) { estado = `Vencida hace ${Math.abs(dias)} d`; t = tone.bad }
    else if (dias <= AVISO_VENCIMIENTO) { estado = `Por vencer · ${dias} d`; t = tone.warn }
    return {
      ...c, persona: p.name, area: p.area, ini: ini(p.name),
      estado, bg: t.bg, fg: t.fg, venceTexto: fechaCorta(c.vence), dias,
      puedeRenovar: dias <= AVISO_VENCIMIENTO,
      renovar: () => {
        setCerts((prev) => prev.map((x) => (x.id === c.id ? { ...x, vence: masUnAnio(x.vence) } : x)))
        anotar({
          modulo: 'Personal', accion: 'Renovó una certificación',
          detalle: `${p.name} · ${c.documento} · nueva vigencia al ${fechaCorta(masUnAnio(c.vence))}.`
        })
      }
    }
  })
  const vencidas = certFilas.filter((c) => c.dias !== null && c.dias < 0).length
  const porVencer = certFilas.filter((c) => c.dias !== null && c.dias >= 0 && c.dias <= AVISO_VENCIMIENTO).length

  // --- Entregas de turno ---
  const guardarEntrega = (datos) => {
    setEntregas((prev) => [{
      id: 'e' + (prev.length + 1),
      fecha: HOY_TEXTO, hora: AHORA,
      autor: porIdPersonal[datos.pid].name,
      de: TURNOS[datos.de].nombre, a: TURNOS[datos.a].nombre,
      texto: datos.texto
    }, ...prev])
    anotar({
      modulo: 'Personal', quien: porIdPersonal[datos.pid].name, rol: porIdPersonal[datos.pid].rol,
      accion: 'Firmó una entrega de turno',
      detalle: `De ${TURNOS[datos.de].nombre.toLowerCase()} a ${TURNOS[datos.a].nombre.toLowerCase()}.`
    })
    setVerFormEntrega(false)
  }

  const subtabs = [
    ['calendario', 'Calendario', huecos.length],
    ['asistencia', 'Asistencia', incidencias],
    ['entregas', 'Entregas de turno', 0],
    ['certificaciones', 'Certificaciones', vencidas + porVencer]
  ].map(([id, label, aviso]) => ({
    id, label, aviso,
    activo: sub === id,
    ir: () => { setSub(id); setCelda(null) }
  }))

  return {
    sub, subtabs,
    grupos, huecos, totalTurnos, cerrarCelda: () => setCelda(null),
    asistenciaFilas, dentro, pendientes, incidencias,
    entregas, verFormEntrega,
    abrirFormEntrega: () => setVerFormEntrega(true),
    cerrarFormEntrega: () => setVerFormEntrega(false),
    guardarEntrega,
    certFilas, vencidas, porVencer,
    personal
  }
}
