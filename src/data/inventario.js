/*
 * Módulo "Inventario". Igual que "Personal y turnos", estos datos NO vienen del
 * prototipo de Claude Design: ahí solo estaba la tarjeta punteada con las
 * cuatro funciones prometidas. Esto es invención fiel a esas cuatro líneas.
 *
 * El enganche con el resto de la app es `medId`: ata un artículo a una línea de
 * la ronda de medicación, y administrar esa dosis en el eMAR descuenta `porToma`
 * unidades. Por eso la vista de Medicación ya decía "el inventario se descuenta
 * automáticamente": aquí es donde eso ocurre de verdad.
 *
 * Campos:
 *   rid      residente dueño del botiquín, o null si es del almacén general
 *   porDia   consumo diario estimado, para calcular los días de cobertura
 *   porToma  unidades que se descuentan por cada administración
 *   minimo   punto de reorden: en o por debajo de esto, es "stock bajo"
 */

/** Días de antelación con que se avisa de una caducidad. */
export const AVISO_CADUCIDAD = 30

export const articulosIniciales = [
  // --- Botiquín individual: lo aporta la familia y se descuenta desde el eMAR ---
  { id: 'i1', nombre: 'Metformina 850 mg', tipo: 'Medicamento', rid: 'r1', medId: 'm1', unidad: 'dosis', existencias: 5, minimo: 6, porDia: 2, porToma: 1, lote: 'MF-4421', caducidad: '2027-03-31' },
  { id: 'i2', nombre: 'Losartán 50 mg', tipo: 'Medicamento', rid: 'r1', medId: 'm2', unidad: 'dosis', existencias: 46, minimo: 10, porDia: 1, porToma: 1, lote: 'LS-8820', caducidad: '2027-08-31' },
  { id: 'i3', nombre: 'Salbutamol 100 mcg', tipo: 'Medicamento', rid: 'r2', medId: 'm3', unidad: 'disparos', existencias: 112, minimo: 40, porDia: 4, porToma: 2, lote: 'SB-2217', caducidad: '2027-05-31' },
  { id: 'i4', nombre: 'Donepezilo 10 mg', tipo: 'Medicamento', rid: 'r3', medId: 'm4', unidad: 'dosis', existencias: 34, minimo: 10, porDia: 1, porToma: 1, lote: 'DN-1190', caducidad: '2027-01-31' },
  { id: 'i5', nombre: 'Furosemida 40 mg', tipo: 'Medicamento', rid: 'r3', medId: 'm5', unidad: 'dosis', existencias: 22, minimo: 10, porDia: 1, porToma: 1, lote: 'FR-6042', caducidad: '2027-02-28' },
  { id: 'i6', nombre: 'Levodopa/Carbidopa 250/25 mg', tipo: 'Medicamento', rid: 'r4', medId: 'm6', unidad: 'dosis', existencias: 7, minimo: 6, porDia: 3, porToma: 1, lote: 'LC-7731', caducidad: '2026-12-31' },
  { id: 'i7', nombre: 'Levotiroxina 100 mcg', tipo: 'Medicamento', rid: 'r5', medId: 'm7', unidad: 'dosis', existencias: 12, minimo: 10, porDia: 1, porToma: 1, lote: 'LV-3358', caducidad: '2027-06-30' },
  { id: 'i8', nombre: 'Losartán 50 mg', tipo: 'Medicamento', rid: 'r6', medId: 'm8', unidad: 'dosis', existencias: 51, minimo: 10, porDia: 1, porToma: 1, lote: 'LS-8820', caducidad: '2027-08-31' },
  { id: 'i9', nombre: 'Paracetamol 500 mg', tipo: 'Medicamento', rid: 'r4', medId: 'm9', unidad: 'dosis', existencias: 24, minimo: 10, porDia: 0, porToma: 1, lote: 'PC-5519', caducidad: '2027-10-31' },

  // --- Almacén general: lo compra la residencia ---
  { id: 'g1', nombre: 'Guantes de nitrilo talla M', tipo: 'Insumo', rid: null, medId: null, unidad: 'piezas', existencias: 1240, minimo: 400, porDia: 160, porToma: 1, lote: 'GN-9901', caducidad: '2028-05-31' },
  { id: 'g2', nombre: 'Pañal para adulto talla M', tipo: 'Insumo', rid: null, medId: null, unidad: 'piezas', existencias: 86, minimo: 120, porDia: 48, porToma: 1, lote: null, caducidad: null },
  { id: 'g3', nombre: 'Gasas estériles 10 × 10 cm', tipo: 'Insumo', rid: null, medId: null, unidad: 'piezas', existencias: 240, minimo: 100, porDia: 18, porToma: 1, lote: 'GE-4417', caducidad: '2027-07-31' },
  { id: 'g4', nombre: 'Tiras reactivas de glucosa', tipo: 'Insumo', rid: null, medId: null, unidad: 'piezas', existencias: 50, minimo: 25, porDia: 12, porToma: 1, lote: 'TR-2291', caducidad: '2026-11-05' },
  { id: 'g5', nombre: 'Solución fisiológica 0.9 % 500 mL', tipo: 'Insumo', rid: null, medId: null, unidad: 'frascos', existencias: 24, minimo: 10, porDia: 3, porToma: 1, lote: 'SF-3304', caducidad: '2026-11-30' },
  { id: 'g6', nombre: 'Jeringas 5 mL', tipo: 'Insumo', rid: null, medId: null, unidad: 'piezas', existencias: 180, minimo: 60, porDia: 22, porToma: 1, lote: 'JR-7780', caducidad: '2028-02-28' },
  { id: 'g7', nombre: 'Alcohol en gel 1 L', tipo: 'Insumo', rid: null, medId: null, unidad: 'frascos', existencias: 14, minimo: 6, porDia: 1, porToma: 1, lote: 'AG-1123', caducidad: '2027-09-30' },
  { id: 'g8', nombre: 'Sonda Foley 16 Fr', tipo: 'Insumo', rid: null, medId: null, unidad: 'piezas', existencias: 8, minimo: 4, porDia: 0, porToma: 1, lote: 'FL-2208', caducidad: '2027-11-30' },
  { id: 'g9', nombre: 'Toallas húmedas', tipo: 'Insumo', rid: null, medId: null, unidad: 'paquetes', existencias: 62, minimo: 30, porDia: 9, porToma: 1, lote: 'TH-5560', caducidad: '2027-12-31' }
]

/* Proveedor único para simplificar: en la app real sería un catálogo. */
export const PROVEEDOR = 'Insumos Médicos del Centro'

export const solicitudesIniciales = [
  { id: 's1', articuloId: 'i1', nombre: 'Metformina 850 mg', destino: 'Familia de María Elena Torres Vega', cantidad: 60, unidad: 'dosis', fecha: '8 nov 2026', estado: 'Enviada', nota: 'Avisada por WhatsApp desde la ronda de las 08:00' },
  { id: 's2', articuloId: 'i7', nombre: 'Levotiroxina 100 mcg', destino: 'Familia de Guadalupe Soto Márquez', cantidad: 30, unidad: 'dosis', fecha: '5 nov 2026', estado: 'Confirmada', nota: 'El sobrino la trae el 10 de noviembre' },
  { id: 's3', articuloId: 'g1', nombre: 'Guantes de nitrilo talla M', destino: `Proveedor · ${PROVEEDOR}`, cantidad: 1000, unidad: 'piezas', fecha: '2 nov 2026', estado: 'Recibida', nota: 'Recibido el 6 nov · factura A-7741' }
]

/*
 * Medicamentos controlados. En México los grupos I a III de la Ley General de
 * Salud exigen receta especial, resguardo bajo llave y libro de control con
 * doble firma. Aquí eso se traduce en: nadie registra una salida solo, y el
 * libro se concilia contra el conteo físico.
 */
export const controladosIniciales = [
  {
    id: 'k1', nombre: 'Clonazepam 2 mg', grupo: 'Grupo III', rid: 'r3', unidad: 'tabletas',
    resguardo: 'Caja fuerte · Control de enfermería',
    indicacion: 'Insomnio de conciliación · en retiro gradual indicado por neurología',
    conteo: '9 nov 2026, 08:00', descuadre: 0
  },
  {
    id: 'k2', nombre: 'Tramadol/Paracetamol 37.5/325 mg', grupo: 'Grupo III', rid: 'r4', unidad: 'tabletas',
    resguardo: 'Caja fuerte · Control de enfermería',
    indicacion: 'Dolor por contusión de cadera · máximo 2 al día',
    conteo: '9 nov 2026, 08:00', descuadre: 1
  },
  {
    id: 'k3', nombre: 'Morfina 10 mg / 2 mL', grupo: 'Grupo I', rid: null, unidad: 'ampolletas',
    resguardo: 'Caja fuerte · doble llave (dirección y enfermería)',
    indicacion: 'Botiquín de cuidados paliativos · no asignado a un residente',
    conteo: '9 nov 2026, 08:00', descuadre: 0
  }
]

/* El saldo del libro se calcula sumando los movimientos, no se guarda aparte:
   así el número de la pantalla siempre es el que sale de las firmas. */
export const movimientosIniciales = [
  { id: 'mv1', kid: 'k3', fecha: '2026-10-15', hora: '10:20', tipo: 'Entrada', delta: 6, rid: null, responsable: 'Laura Pérez Mendoza', testigo: 'Norma Jiménez Castro', folio: 'Receta especial 1004-A' },
  { id: 'mv2', kid: 'k1', fecha: '2026-10-28', hora: '12:05', tipo: 'Entrada', delta: 15, rid: 'r3', responsable: 'Miguel Ángel Rosas Díaz', testigo: 'Laura Pérez Mendoza', folio: 'Receta especial 884-C' },
  { id: 'mv3', kid: 'k2', fecha: '2026-11-02', hora: '11:00', tipo: 'Entrada', delta: 20, rid: 'r4', responsable: 'Laura Pérez Mendoza', testigo: 'Norma Jiménez Castro', folio: 'Receta especial 1182-B' },
  { id: 'mv4', kid: 'k1', fecha: '2026-11-08', hora: '21:30', tipo: 'Salida', delta: -1, rid: 'r3', responsable: 'Miguel Ángel Rosas Díaz', testigo: 'Juan Carlos Beltrán Ruiz', folio: 'Receta especial 884-C' },
  { id: 'mv5', kid: 'k2', fecha: '2026-11-08', hora: '23:55', tipo: 'Salida', delta: -1, rid: 'r4', responsable: 'Norma Jiménez Castro', testigo: 'Esperanza Núñez Solís', folio: 'Receta especial 1182-B' },
  { id: 'mv6', kid: 'k2', fecha: '2026-11-09', hora: '07:40', tipo: 'Salida', delta: -1, rid: 'r4', responsable: 'Laura Pérez Mendoza', testigo: 'Rosa María Aguilar Pineda', folio: 'Receta especial 1182-B' }
]
