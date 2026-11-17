/*
 * Módulo "Personal y turnos". Estos datos NO vienen del prototipo de Claude
 * Design: ahí solo existía la tarjeta punteada con las cuatro funciones
 * prometidas. Todo lo de este archivo es invención fiel a esas cuatro líneas.
 *
 * "Hoy" en el prototipo es el lunes 9 de noviembre de 2026, 09:41.
 */

/* Los turnos reutilizan la paleta de estados (ok / info / gray). El nocturno
   necesitaba un cuarto color: es el morado que ya figura entre las opciones de
   acento del prototipo (#6B4F96), rebajado para fondo de etiqueta. */
export const TURNOS = {
  M: { clave: 'M', nombre: 'Matutino', horario: '07:00–15:00', inicio: '07:00', bg: '#E8EEDB', fg: '#4C6B27' },
  V: { clave: 'V', nombre: 'Vespertino', horario: '15:00–23:00', inicio: '15:00', bg: '#E9ECF2', fg: '#3C5578' },
  N: { clave: 'N', nombre: 'Nocturno', horario: '23:00–07:00', inicio: '23:00', bg: '#EDE8F0', fg: '#5F4473' },
  D: { clave: 'D', nombre: 'Descanso', horario: '—', inicio: null, bg: '#EEEBE0', fg: '#6A6C5A' }
}
export const CLAVES_TURNO = ['M', 'V', 'N', 'D']

export const DIAS = [
  { i: 0, corto: 'Lun', num: 9, hoy: true },
  { i: 1, corto: 'Mar', num: 10 },
  { i: 2, corto: 'Mié', num: 11 },
  { i: 3, corto: 'Jue', num: 12 },
  { i: 4, corto: 'Vie', num: 13 },
  { i: 5, corto: 'Sáb', num: 14 },
  { i: 6, corto: 'Dom', num: 15 }
]

export const AREAS = ['Enfermería', 'Cuidadores', 'Cocina', 'Limpieza']

/* `turnoBase` es el turno habitual y `descanso` el día libre de la semana.
   Las tres enfermeras descansan en días distintos, lo que deja tres huecos de
   cobertura a propósito: el calendario los detecta y los marca. */
export const personal = [
  { id: 'p1', name: 'Laura Pérez Mendoza', rol: 'Enfermera', area: 'Enfermería', turnoBase: 'M', descanso: 2, tel: '2284', antiguedad: 'Desde mar 2021' },
  { id: 'p2', name: 'Miguel Ángel Rosas Díaz', rol: 'Enfermero', area: 'Enfermería', turnoBase: 'V', descanso: 3, tel: '5517', antiguedad: 'Desde ago 2023' },
  { id: 'p3', name: 'Norma Jiménez Castro', rol: 'Enfermera', area: 'Enfermería', turnoBase: 'N', descanso: 4, tel: '9042', antiguedad: 'Desde ene 2022' },
  { id: 'p4', name: 'Rosa María Aguilar Pineda', rol: 'Cuidadora', area: 'Cuidadores', turnoBase: 'M', descanso: 5, tel: '3370', antiguedad: 'Desde jun 2020' },
  { id: 'p5', name: 'Juan Carlos Beltrán Ruiz', rol: 'Cuidador', area: 'Cuidadores', turnoBase: 'V', descanso: 6, tel: '8129', antiguedad: 'Desde feb 2024' },
  { id: 'p6', name: 'Esperanza Núñez Solís', rol: 'Cuidadora', area: 'Cuidadores', turnoBase: 'N', descanso: 0, tel: '6655', antiguedad: 'Desde sep 2022' },
  { id: 'p7', name: 'Martha Elena Ocampo Vera', rol: 'Cocinera', area: 'Cocina', turnoBase: 'M', descanso: 1, tel: '4418', antiguedad: 'Desde nov 2019' },
  { id: 'p8', name: 'Gerardo Salinas Pacheco', rol: 'Auxiliar de cocina', area: 'Cocina', turnoBase: 'V', descanso: 2, tel: '7703', antiguedad: 'Desde abr 2025' },
  { id: 'p9', name: 'Alicia Ferrer Domínguez', rol: 'Intendencia', area: 'Limpieza', turnoBase: 'M', descanso: 3, tel: '2096', antiguedad: 'Desde jul 2023' },
  { id: 'p10', name: 'Raúl Contreras Mejía', rol: 'Intendencia', area: 'Limpieza', turnoBase: 'V', descanso: 4, tel: '5831', antiguedad: 'Desde oct 2024' }
]

export const porIdPersonal = Object.fromEntries(personal.map((p) => [p.id, p]))

export const horarioInicial = () => Object.fromEntries(
  personal.map((p) => [p.id, DIAS.map((d) => (d.i === p.descanso ? 'D' : p.turnoBase))])
)

/* Checadas del lunes. Norma cerró su nocturno a las 07:03; los vespertinos aún
   no entran. Alicia llegó tarde y fuera del perímetro: dos avisos distintos. */
export const asistenciaInicial = {
  p3: { entrada: '22:51', entradaAyer: true, salida: '07:03', ubicacion: 'Dentro de la residencia', ubicacionOk: true },
  p1: { entrada: '06:52', salida: null, ubicacion: 'Dentro de la residencia', ubicacionOk: true },
  p4: { entrada: '06:58', salida: null, ubicacion: 'Dentro de la residencia', ubicacionOk: true },
  p7: { entrada: '07:05', salida: null, ubicacion: 'Dentro de la residencia', ubicacionOk: true },
  p9: { entrada: '07:22', salida: null, ubicacion: 'A 340 m del perímetro', ubicacionOk: false }
}

export const entregasIniciales = [
  {
    id: 'e1', fecha: '9 nov 2026', hora: '07:00', de: 'Nocturno', a: 'Matutino', autor: 'Norma Jiménez Castro',
    texto: 'Roberto Hernández (104-A) presentó caída a las 23:40 al ir al baño: contusión leve en cadera izquierda y febrícula de 37.8 °C. Se vigiló cada hora, sin cambios neurológicos. Pendiente la Rx de cadera. Carmen Ruiz durmió fragmentado; se hicieron cambios posturales cada 2 h.'
  },
  {
    id: 'e2', fecha: '8 nov 2026', hora: '23:00', de: 'Vespertino', a: 'Nocturno', autor: 'Miguel Ángel Rosas Díaz',
    texto: 'Medicación de las 20:00 completa. María Elena Torres con glucosa de 168 mg/dL antes de cenar; se ajustó la colación nocturna. Guadalupe Soto participó en el taller de lectura, buen ánimo.'
  },
  {
    id: 'e3', fecha: '8 nov 2026', hora: '15:00', de: 'Matutino', a: 'Vespertino', autor: 'Laura Pérez Mendoza',
    texto: 'La Dra. Morales valoró a 4 residentes. Antonio Medina avanza con andadera sin apoyo. Falta reponer Metformina 850 mg: quedan 5 dosis y ya se avisó a la familia de María Elena Torres.'
  }
]

export const certificacionesIniciales = [
  { id: 'c1', pid: 'p1', documento: 'Cédula profesional', numero: '8472913', vence: null },
  { id: 'c2', pid: 'p1', documento: 'RCP y primeros auxilios', numero: 'RCP-2024-1180', vence: '2027-02-20' },
  { id: 'c3', pid: 'p2', documento: 'Cédula profesional', numero: '9153640', vence: null },
  { id: 'c4', pid: 'p2', documento: 'RCP y primeros auxilios', numero: 'RCP-2023-0742', vence: '2026-12-05' },
  { id: 'c5', pid: 'p3', documento: 'Cédula profesional', numero: '7628104', vence: null },
  { id: 'c6', pid: 'p3', documento: 'RCP y primeros auxilios', numero: 'RCP-2022-0391', vence: '2026-10-28' },
  { id: 'c7', pid: 'p4', documento: 'Atención gerontológica', numero: 'AG-2025-214', vence: '2027-06-30' },
  { id: 'c8', pid: 'p5', documento: 'Atención gerontológica', numero: 'AG-2024-158', vence: '2026-12-20' },
  { id: 'c9', pid: 'p6', documento: 'Atención gerontológica', numero: 'AG-2025-266', vence: '2027-08-10' },
  { id: 'c10', pid: 'p7', documento: 'Manejo higiénico de alimentos (NOM-251)', numero: 'MH-2025-091', vence: '2027-04-18' },
  { id: 'c11', pid: 'p8', documento: 'Manejo higiénico de alimentos (NOM-251)', numero: 'MH-2024-063', vence: '2026-11-30' },
  { id: 'c12', pid: 'p9', documento: 'Manejo de RPBI', numero: 'RPBI-2025-038', vence: '2027-05-22' },
  { id: 'c13', pid: 'p10', documento: 'Manejo de RPBI', numero: 'RPBI-2025-047', vence: '2027-09-03' }
]
