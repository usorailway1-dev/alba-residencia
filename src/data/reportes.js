/*
 * Módulo "Reportes e inspecciones". Como los otros tres módulos de Gestión,
 * nada de esto viene del prototipo de Claude Design: ahí solo había la tarjeta
 * punteada con cuatro líneas, que son las cuatro sub-pestañas:
 *   · Ocupación, caídas, úlceras e incidentes por mes
 *   · Expediente exportable en PDF
 *   · Bitácora de auditoría (quién, qué, cuándo)
 *   · Reportes financieros
 *
 * El mes en curso NO está en este archivo: se cuenta solo con lo que haya en
 * la app (ingresos, incidentes reportados, facturas, dosis administradas).
 * Aquí vive únicamente el histórico de meses ya cerrados, que es lo que un
 * sistema real traería de la base de datos.
 */

export const CAMAS = 48

/* Noviembre va por el día 9 de 30. Comparar un mes a medias contra meses
   completos engaña, así que los indicadores se normalizan por días-residente
   y el mes en curso siempre se marca como tal. */
export const DIAS_NOVIEMBRE = 30
export const TRANSCURRIDOS_NOVIEMBRE = 9

/*
 * `incidentes` es el total del mes y las caídas y las úlceras son un
 * subconjunto suyo: un mes con 3 caídas y 5 incidentes tuvo 2 incidentes de
 * otro tipo (error de medicación, lesión, alteración de conducta).
 *
 * Lo financiero sigue la escala de las facturas que trae el prototipo: seis
 * cuentas que suman $157,500 al mes, no las 42 camas ocupadas. La pestaña de
 * financieros lo dice en pantalla para que nadie lea mal el total.
 */
export const historico = [
  { id: 'jun', mes: 'Jun', nombre: 'Junio 2026', dias: 30, ocupadas: 39, caidas: 3, ulceras: 1, incidentes: 5, facturado: 150000, cobrado: 150000 },
  { id: 'jul', mes: 'Jul', nombre: 'Julio 2026', dias: 31, ocupadas: 40, caidas: 2, ulceras: 0, incidentes: 4, facturado: 152500, cobrado: 146000 },
  { id: 'ago', mes: 'Ago', nombre: 'Agosto 2026', dias: 31, ocupadas: 41, caidas: 4, ulceras: 1, incidentes: 6, facturado: 155000, cobrado: 155000 },
  { id: 'sep', mes: 'Sep', nombre: 'Septiembre 2026', dias: 30, ocupadas: 41, caidas: 2, ulceras: 0, incidentes: 3, facturado: 155000, cobrado: 148500 },
  { id: 'oct', mes: 'Oct', nombre: 'Octubre 2026', dias: 31, ocupadas: 42, caidas: 3, ulceras: 0, incidentes: 5, facturado: 157500, cobrado: 151000 }
]

/* Lo que el prototipo ya daba por hecho de noviembre antes de que nadie toque
   la app: la caída de Roberto Hernández del día 8 por la noche. */
export const BASE_NOVIEMBRE = { caidas: 1, ulceras: 0, incidentes: 1 }

/*
 * Expediente del residente según la NOM-031-SSA3-2012. `vigenciaMeses` marca
 * los documentos que caducan: una valoración geriátrica de hace tres años no
 * sirve en una inspección aunque esté en la carpeta.
 */
export const DOCUMENTOS = [
  { clave: 'contrato', nombre: 'Contrato de prestación de servicios', nota: 'Firmado por el residente o por su representante legal.', obligatorio: true },
  { clave: 'responsiva', nombre: 'Carta responsiva del familiar', nota: 'Familiar responsable y autorización de traslado en urgencia.', obligatorio: true },
  { clave: 'consentimiento', nombre: 'Consentimiento informado', nota: 'Atención, cuidados y uso de sujeción si llegara a indicarse.', obligatorio: true },
  { clave: 'historia', nombre: 'Historia clínica de ingreso', nota: 'Con certificado médico y laboratorios del ingreso.', obligatorio: true },
  { clave: 'valoracion', nombre: 'Valoración geriátrica integral', nota: 'Barthel, Norton y Tinetti. Se repite cada año.', obligatorio: true, vigenciaMeses: 12 },
  { clave: 'plan', nombre: 'Plan de atención individualizado', nota: 'Se revisa cada seis meses y tras cualquier cambio de salud.', obligatorio: true, vigenciaMeses: 6 },
  { clave: 'vacunacion', nombre: 'Esquema de vacunación', nota: 'Influenza y neumococo al corriente.', obligatorio: true, vigenciaMeses: 12 },
  { clave: 'evolucion', nombre: 'Notas de evolución', nota: 'Médicas y de enfermería, firmadas y foliadas.', obligatorio: true },
  { clave: 'dieta', nombre: 'Indicación dietética vigente', nota: 'Dieta, consistencia y alergias alimentarias.', obligatorio: true },
  { clave: 'voluntades', nombre: 'Voluntad anticipada', nota: 'Opcional: solo si el residente decidió otorgarla.', obligatorio: false }
]

export const OBLIGATORIOS = DOCUMENTOS.filter((d) => d.obligatorio).length

const doc = (fecha, vence = null) => ({ fecha, vence })

/*
 * Tres situaciones puestas a propósito, que son justo las que encuentra un
 * inspector:
 *   · Roberto Hernández (r4) tiene el plan de atención vencido desde el 4 nov,
 *     y encima se cayó el día 8: es el expediente que hay que rehacer ya.
 *   · Guadalupe Soto (r5) tiene la valoración geriátrica a 12 días de vencer.
 *   · Antonio Medina (r6) ingresó en abril y nunca entregó el esquema de
 *     vacunación.
 * La voluntad anticipada falta en cuatro expedientes y no pasa nada: es
 * opcional y no cuenta para el porcentaje.
 */
export const expedientesIniciales = {
  r1: {
    contrato: doc('2024-03-05'), responsiva: doc('2024-03-05'), consentimiento: doc('2024-03-05'),
    historia: doc('2024-03-06'), valoracion: doc('2026-03-10', '2027-03-10'),
    plan: doc('2026-09-01', '2027-03-01'), vacunacion: doc('2026-10-08', '2027-10-08'),
    evolucion: doc('2026-11-08'), dieta: doc('2026-10-15'), voluntades: doc('2024-04-02')
  },
  r2: {
    contrato: doc('2025-08-18'), responsiva: doc('2025-08-18'), consentimiento: doc('2025-08-18'),
    historia: doc('2025-08-19'), valoracion: doc('2026-08-20', '2027-08-20'),
    plan: doc('2026-08-25', '2027-02-25'), vacunacion: doc('2026-10-08', '2027-10-08'),
    evolucion: doc('2026-11-07'), dieta: doc('2026-09-30')
  },
  r3: {
    contrato: doc('2023-01-16'), responsiva: doc('2023-01-16'), consentimiento: doc('2023-01-16'),
    historia: doc('2023-01-17'), valoracion: doc('2026-01-16', '2027-01-16'),
    plan: doc('2026-06-02', '2026-12-02'), vacunacion: doc('2026-10-08', '2027-10-08'),
    evolucion: doc('2026-11-08'), dieta: doc('2026-11-01'), voluntades: doc('2023-02-10')
  },
  r4: {
    contrato: doc('2024-06-11'), responsiva: doc('2024-06-11'), consentimiento: doc('2024-06-11'),
    historia: doc('2024-06-12'), valoracion: doc('2026-06-15', '2027-06-15'),
    plan: doc('2026-05-04', '2026-11-04'), vacunacion: doc('2026-10-08', '2027-10-08'),
    evolucion: doc('2026-11-09'), dieta: doc('2026-11-09')
  },
  r5: {
    contrato: doc('2025-11-21'), responsiva: doc('2025-11-21'), consentimiento: doc('2025-11-21'),
    historia: doc('2025-11-22'), valoracion: doc('2025-11-21', '2026-11-21'),
    plan: doc('2026-05-30', '2026-11-30'), vacunacion: doc('2026-10-08', '2027-10-08'),
    evolucion: doc('2026-11-06'), dieta: doc('2026-09-12')
  },
  r6: {
    contrato: doc('2026-04-22'), responsiva: doc('2026-04-22'), consentimiento: doc('2026-04-22'),
    historia: doc('2026-04-23'), valoracion: doc('2026-04-28', '2027-04-28'),
    plan: doc('2026-10-05', '2027-04-05'),
    evolucion: doc('2026-11-05'), dieta: doc('2026-05-02')
  }
}

/* Quién usa la app. El prototipo saluda con "Buenos días, Laura" y firma el
   eMAR como "L. Pérez": es la enfermera p1 del módulo de Personal. */
export const USUARIO = { nombre: 'Laura Pérez Mendoza', rol: 'Enfermera' }

export const MODULOS_BITACORA = [
  'Residentes', 'Medicación', 'Enfermería', 'Inventario', 'Cocina', 'Personal', 'Facturación', 'Sistema'
]

/*
 * Lo que pasó antes de que Jorge abra la app. De aquí en adelante, cada acción
 * que se haga en cualquier módulo se anota sola (usePanel reparte `anotar`).
 * Los movimientos de controlados no se repiten aquí: la bitácora los lee del
 * libro del módulo de Inventario, que ya es un registro con hora, responsable,
 * testigo y folio.
 */
export const bitacoraInicial = [
  { id: 'b1', fecha: '2026-11-01', hora: '09:12', quien: 'Mónica Bernal Arce', rol: 'Administración', modulo: 'Facturación', accion: 'Timbró 3 CFDI 4.0', detalle: 'Mensualidades de noviembre de María Elena Torres, José Luis Ramírez y Guadalupe Soto.' },
  { id: 'b2', fecha: '2026-11-08', hora: '11:20', quien: 'Dra. Ana Morales', rol: 'Médica', modulo: 'Residentes', accion: 'Firmó nota de evolución', detalle: 'Carmen Ruiz Delgado (103-A). Céd. Prof. ••••••• · registro inmutable.' },
  { id: 'b3', fecha: '2026-11-08', hora: '23:48', quien: 'Norma Jiménez Castro', rol: 'Enfermera', modulo: 'Residentes', accion: 'Reportó incidente', detalle: 'Caída de Roberto Hernández Campos a las 23:40 en el baño de 104-A. Contusión leve en cadera izquierda.' },
  { id: 'b4', fecha: '2026-11-09', hora: '06:48', quien: 'Laura Pérez Mendoza', rol: 'Enfermera', modulo: 'Sistema', accion: 'Inició sesión', detalle: 'Panel web · equipo de la estación de enfermería.' },
  { id: 'b5', fecha: '2026-11-09', hora: '07:00', quien: 'Laura Pérez Mendoza', rol: 'Enfermera', modulo: 'Enfermería', accion: 'Registró signos vitales', detalle: 'Toma de las 07:00 de los 6 residentes de la muestra.' },
  { id: 'b6', fecha: '2026-11-09', hora: '08:10', quien: 'Laura Pérez Mendoza', rol: 'Enfermera', modulo: 'Medicación', accion: 'Cerró 5 dosis de la ronda matutina', detalle: 'Levotiroxina, Metformina, Losartán, Salbutamol y Furosemida.' },
  { id: 'b7', fecha: '2026-11-09', hora: '09:05', quien: 'Martha Elena Ocampo Vera', rol: 'Cocinera', modulo: 'Cocina', accion: 'Registró la ingesta del desayuno', detalle: '6 residentes. Roberto Hernández comió poco: náusea leve y dolor de cadera.' }
]
