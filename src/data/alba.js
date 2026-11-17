// Modelo de datos del prototipo de Casa Los Olivos — datos ficticios de ejemplo.
// Extraído literalmente de renderVals() en diseno-original/Main.dc.html
// y diseno-original/PortalFamiliar.dc.html.
//
// Los residentes, el personal y las cuentas son inventados: el prototipo
// original hablaba de una "Residencia Los Álamos" igual de ficticia. Lo único
// que cambió al adoptar la marca de Casa Los Olivos fue el nombre y la paleta.

export const tone = {
  ok:   { bg: '#E8EEDB', fg: '#4C6B27' },
  warn: { bg: '#FBF0D5', fg: '#8A5300' },
  bad:  { bg: '#FBE7E3', fg: '#B42318' },
  info: { bg: '#E9ECF2', fg: '#3C5578' },
  gray: { bg: '#EEEBE0', fg: '#474A3A' }
}

export const money = (n) => '$' + n.toLocaleString('es-MX') + ' MXN'

export const ini = (n) => n.split(' ').slice(0, 2).map((w) => w[0]).join('')

export const depLabel = (b) =>
  b >= 91 ? 'Leve' : b >= 61 ? 'Moderada-leve' : b >= 41 ? 'Moderada' : b >= 21 ? 'Severa' : 'Total'

/* Las interpretaciones de Norton y Tinetti estaban dentro de renderVals(); se
   sacaron aquí porque el expediente en PDF las necesita igual que la ficha, y
   dos copias de los mismos cortes acabarían separándose. */
export const nortonLabel = (n) =>
  n <= 12 ? 'Riesgo alto de úlceras' : n <= 14 ? 'Riesgo medio de úlceras' : 'Riesgo bajo de úlceras'

export const tinettiLabel = (t) =>
  t < 19 ? 'Riesgo alto de caída' : t <= 24 ? 'Riesgo moderado de caída' : 'Riesgo bajo de caída'

export const residents = [
  {
    id: 'r1', name: 'María Elena Torres Vega', age: 84, room: '101-A', ingreso: 'mar 2024', exp: '0142',
    t: 'ok', estado: 'Estable', barthel: 55, norton: 15, tinetti: 20,
    alergias: 'Penicilina', dx: 'Hipertensión arterial · Diabetes mellitus tipo 2',
    contacto: 'Laura Torres (hija)', tel: '2291', dieta: 'Diabética, baja en sodio',
    nota: 'Paciente estable, glucosa matutina elevada (182 mg/dL). Se ajusta horario de colación y se solicita control capilar preprandial por 3 días.'
  },
  {
    id: 'r2', name: 'José Luis Ramírez Ortiz', age: 79, room: '102-B', ingreso: 'ago 2025', exp: '0167',
    t: 'ok', estado: 'Estable', barthel: 80, norton: 18, tinetti: 24,
    alergias: 'Ninguna conocida', dx: 'EPOC leve · Artrosis de rodilla',
    contacto: 'Jorge Ramírez (hijo)', tel: '5810', dieta: 'Normal',
    nota: 'Sin disnea en reposo. Saturación estable. Continúa con fisioterapia de rodilla dos veces por semana.'
  },
  {
    id: 'r3', name: 'Carmen Ruiz Delgado', age: 91, room: '103-A', ingreso: 'ene 2023', exp: '0098',
    t: 'warn', estado: 'Vigilancia', barthel: 30, norton: 11, tinetti: 12,
    alergias: 'Sulfonamidas', dx: 'Demencia tipo Alzheimer (moderada) · Hipertensión arterial · Insuficiencia cardiaca',
    contacto: 'Patricia Ruiz (hija)', tel: '7734', dieta: 'Hiposódica, consistencia blanda',
    nota: 'Presenta TA 165/95 en toma matutina, sin datos de alarma neurológica. Se indica nueva toma en 2 h y vigilancia de edema. Cambios posturales cada 2 h por riesgo de úlceras.'
  },
  {
    id: 'r4', name: 'Roberto Hernández Campos', age: 87, room: '104-A', ingreso: 'jun 2024', exp: '0151',
    t: 'bad', estado: 'Atención', barthel: 45, norton: 13, tinetti: 10,
    alergias: 'Ibuprofeno', dx: 'Enfermedad de Parkinson · Osteoporosis',
    contacto: 'Silvia Campos (esposa)', tel: '4406', dieta: 'Normal, alta en fibra',
    nota: 'Caída desde su propia altura a las 23:40 al ir al baño. Contusión leve en cadera izquierda, sin deformidad. Febrícula 37.8 °C. Se solicita Rx de cadera y vigilancia nocturna.'
  },
  {
    id: 'r5', name: 'Guadalupe Soto Márquez', age: 82, room: '105-B', ingreso: 'nov 2025', exp: '0173',
    t: 'ok', estado: 'Estable', barthel: 70, norton: 17, tinetti: 21,
    alergias: 'Ninguna conocida', dx: 'Hipotiroidismo · Cataratas bilaterales',
    contacto: 'Ricardo Soto (sobrino)', tel: '9015', dieta: 'Normal',
    nota: 'Buen estado general. Participa en actividades recreativas. Pendiente valoración oftalmológica programada.'
  },
  {
    id: 'r6', name: 'Antonio Medina Flores', age: 76, room: '106-A', ingreso: 'abr 2026', exp: '0188',
    t: 'ok', estado: 'Estable', barthel: 90, norton: 19, tinetti: 26,
    alergias: 'Látex', dx: 'Secuelas de EVC leve · Hipertensión arterial',
    contacto: 'Elena Medina (hija)', tel: '3362', dieta: 'Baja en sodio',
    nota: 'Mejoría en marcha con andadera. Tensión arterial en metas. Continúa rehabilitación.'
  }
]

export const byId = Object.fromEntries(residents.map((r) => [r.id, r]))

export const meds = [
  { id: 'm7', r: 'r5', med: 'Levotiroxina 100 mcg', dose: '1 tableta', via: 'Oral', time: '07:00' },
  { id: 'm1', r: 'r1', med: 'Metformina 850 mg', dose: '1 tableta', via: 'Oral', time: '08:00' },
  { id: 'm2', r: 'r1', med: 'Losartán 50 mg', dose: '1 tableta', via: 'Oral', time: '08:00' },
  { id: 'm3', r: 'r2', med: 'Salbutamol 100 mcg', dose: '2 disparos', via: 'Inhalada', time: '08:00' },
  { id: 'm4', r: 'r3', med: 'Donepezilo 10 mg', dose: '1 tableta', via: 'Oral', time: '08:00' },
  { id: 'm5', r: 'r3', med: 'Furosemida 40 mg', dose: '1 tableta', via: 'Oral', time: '08:00' },
  { id: 'm6', r: 'r4', med: 'Levodopa/Carbidopa 250/25 mg', dose: '1 tableta', via: 'Oral', time: '10:00' },
  { id: 'm8', r: 'r6', med: 'Losartán 50 mg', dose: '1 tableta', via: 'Oral', time: '10:00' },
  { id: 'm9', r: 'r4', med: 'Paracetamol 500 mg', dose: '1 tableta', via: 'Oral', time: 'PRN' }
]

// Dosis ya administradas al cargar el prototipo
export const GIVEN_INICIAL = { m1: '07:58', m2: '07:58', m3: '08:03', m5: '08:10', m7: '07:02' }

export const billsRaw = [
  { id: 'f1', r: 'r1', amount: 26500, paid: 26500 },
  { id: 'f2', r: 'r2', amount: 24000, paid: 24000 },
  { id: 'f3', r: 'r3', amount: 31500, paid: 0, due: 'Vence 10 nov' },
  { id: 'f4', r: 'r4', amount: 29000, paid: 12000, late: true },
  { id: 'f5', r: 'r5', amount: 24000, paid: 24000 },
  { id: 'f6', r: 'r6', amount: 22500, paid: 0, due: 'Vence 15 nov' }
]

// Facturas ya timbradas al cargar el prototipo
export const CFDI_INICIAL = { f1: true, f2: true, f5: true }

// [id, presión, FC, temperatura, glucosa, SpO2] — toma de las 07:00
export const vitalsRaw = [
  ['r1', '132/84', 76, 36.5, 182, 96],
  ['r2', '128/80', 72, 36.7, 98, 94],
  ['r3', '165/95', 88, 36.9, 110, 95],
  ['r4', '118/74', 81, 37.8, 104, 97],
  ['r5', '124/78', 68, 36.4, 92, 98],
  ['r6', '138/86', 70, 36.6, 101, 97]
]

export const agenda = [
  { time: '10:00', title: 'Fisioterapia grupal', where: 'Sala de usos múltiples · 8 residentes' },
  { time: '11:30', title: 'Visita médica · Dra. Morales', where: 'Valoración de 4 residentes' },
  { time: '13:00', title: 'Comida', where: '3 dietas especiales · 2 consistencias blandas' },
  { time: '17:00', title: 'Visita familiar', where: 'Familia Ruiz · Carmen Ruiz (103-A)' }
]

export const modulos = {
  personal: {
    title: 'Personal y turnos',
    desc: 'Programación de turnos rotativos del personal de enfermería, cuidadores, cocina y limpieza, con control de asistencia.',
    items: ['Calendario de turnos y coberturas', 'Registro de entrada y salida con geolocalización', 'Notas de entrega de turno', 'Cédulas, certificaciones y vencimientos']
  },
  inventario: {
    title: 'Inventario',
    desc: 'Control de medicamentos e insumos, incluido lo que aporta cada familia, con descuento automático desde el eMAR.',
    items: ['Existencias por residente y por almacén general', 'Alertas de stock bajo y caducidades', 'Solicitudes de reposición a familias', 'Control de medicamentos controlados']
  },
  cocina: {
    title: 'Cocina y dietas',
    desc: 'Menús y dietas especiales visibles para cocina, con alergias y restricciones de cada residente.',
    items: ['Menú semanal y dietas por residente', 'Consistencias (blanda, picada, licuada)', 'Registro de ingesta por comida', 'Lista de compras']
  },
  reportes: {
    title: 'Reportes e inspecciones',
    desc: 'Indicadores de calidad y documentación lista para inspecciones conforme a la NOM-031-SSA3-2012.',
    items: ['Ocupación, caídas, úlceras e incidentes por mes', 'Expediente exportable en PDF', 'Bitácora de auditoría (quién, qué, cuándo)', 'Reportes financieros']
  }
}

export const titles = {
  inicio: 'Buenos días, Laura',
  residentes: 'Residentes',
  ficha: 'Ficha del residente',
  medicacion: 'Ronda de medicación',
  enfermeria: 'Enfermería',
  facturacion: 'Facturación y cobranza'
}

// ---- Portal familiar ----

export const diaFamiliar = [
  { title: 'Desayunó completo', detail: '08:30 · Avena, fruta y té', dot: '#5A6B32' },
  { title: 'Medicamentos de la mañana', detail: 'Administrados a las 08:10', dot: '#5A6B32' },
  { title: 'Taller de pintura', detail: '10:00 · Sala de usos múltiples', dot: '#3C5578' },
  { title: 'Revisión médica', detail: '11:30 · Dra. Ana Morales', dot: '#9A5B1C' }
]

export const mensajesFamiliar = [
  { who: 'Enf. Laura Pérez', time: '09:15', text: 'Buenos días. Carmen durmió bien y desayunó completo. Le avisamos después de la revisión médica.', align: 'flex-start', bg: '#FFFFFF', fg: '#262A1B' },
  { who: 'Tú', time: '09:20', text: 'Gracias. ¿Necesita que le llevemos algo hoy en la visita?', align: 'flex-end', bg: '#3A4523', fg: '#FFFFFF' },
  { who: 'Enf. Laura Pérez', time: '09:24', text: 'Si pueden, crema hidratante y un suéter ligero. Todo lo demás está cubierto.', align: 'flex-start', bg: '#FFFFFF', fg: '#262A1B' }
]

export const pagosFamiliar = [
  { mes: 'Octubre 2026', monto: '$31,500' },
  { mes: 'Septiembre 2026', monto: '$31,500' },
  { mes: 'Agosto 2026', monto: '$30,000' }
]

export const horariosVisita = ['10:00', '11:00', '12:00', '16:00', '17:00', '18:00']

export const visitaInicial = 'Hoy, 17:00 · Patricia y Daniel Ruiz'

/* Datos para la transferencia SPEI. Ficticios, pero con la forma real: una
   CLABE son 18 dígitos (3 banco + 3 plaza + 11 cuenta + 1 verificador). */
export const datosSpei = {
  beneficiario: 'Casa Los Olivos S.A. de C.V.',
  banco: 'BBVA México',
  clabe: '012180012345678904',
  referencia: 'ALB-103A-NOV26',
  concepto: 'Mensualidad noviembre 2026',
  monto: '$31,500.00 MXN'
}
