/*
 * Fechas del prototipo. "Hoy" es el lunes 9 de noviembre de 2026, 09:41, y
 * todas las pantallas parten de ese instante para que los datos de muestra
 * cuadren entre sí: turnos, checadas, vencimientos de cédulas y caducidades
 * de inventario.
 *
 * Las fechas se parten como cadena en vez de usar `new Date(iso)`, que
 * interpreta el ISO corto en UTC y en México acaba mostrando el día anterior.
 */

export const HOY_ISO = '2026-11-09'
export const HOY_TEXTO = '9 nov 2026'
export const AHORA = '09:41'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** '2026-10-28' → '28 oct 2026'. */
export const fechaCorta = (iso) => {
  const [a, m, d] = iso.split('-')
  return `${Number(d)} ${MESES[Number(m) - 1]} ${a}`
}

const aUTC = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  return Date.UTC(a, m - 1, d)
}

/** Días entre hoy (9 nov 2026) y la fecha dada. Negativo = ya pasó. */
export const diasPara = (iso) => Math.round((aUTC(iso) - aUTC(HOY_ISO)) / 86400000)

/**
 * Suma meses a una fecha ISO. Se usa para la vigencia de los documentos del
 * expediente: la valoración geriátrica dura 12 meses y el plan de atención 6.
 * Aquí sí vale `Date`, porque el desbordamiento de mes (31 ene + 1 mes) hay
 * que resolverlo igual que lo haría el calendario.
 */
export const masMeses = (iso, n) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1 + n, d)).toISOString().slice(0, 10)
}

/** Suma un año a una fecha ISO, para renovar una certificación. */
export const masUnAnio = (iso) => masMeses(iso, 12)
