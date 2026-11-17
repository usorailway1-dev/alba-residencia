/*
 * Comprueba que la rama de olivo quepa dentro de la casa.
 *
 * Mirar el dibujo a ojo no basta: a 54 px una hoja que asoma dos décimas por
 * encima del techo no se ve, pero en el PDF a tamaño grande sí. Esto mide la
 * distancia de cada punto del trazo a los cuatro lados de la casa.
 *
 *   npm run verificar:marca
 */
import { CASA, TALLO, HOJAS, ACEITUNAS, RABILLOS } from '../src/marca.js'

/** Holgura mínima al trazo de la casa, en unidades del viewBox de 32. */
const MARGEN = 0.9

/* Los cuatro lados: muro izquierdo, vertiente izquierda, vertiente derecha y
   muro derecho. La casa está abierta por abajo, así que no hay piso. */
const LADOS = [
  { nombre: 'muro izquierdo', a: [4.6, 13.1], b: [4.6, 29.2] },
  { nombre: 'techo izquierdo', a: [4.6, 13.1], b: [16, 3.4] },
  { nombre: 'techo derecho', a: [16, 3.4], b: [27.4, 13.1] },
  { nombre: 'muro derecho', a: [27.4, 13.1], b: [27.4, 29.2] },
]

/** Distancia de un punto al segmento, no a la recta infinita. */
const distancia = (p, { a, b }) => {
  const vx = b[0] - a[0]
  const vy = b[1] - a[1]
  const wx = p[0] - a[0]
  const wy = p[1] - a[1]
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)))
  return Math.hypot(wx - t * vx, wy - t * vy)
}

/** Saca todos los pares de coordenadas de una ruta SVG. */
const puntos = (d) => {
  const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
  const salida = []
  for (let i = 0; i + 1 < n.length; i += 2) salida.push([n[i], n[i + 1]])
  return salida
}

const aRevisar = [
  ...HOJAS.flatMap((d, i) => puntos(d).map((p) => [`hoja ${i + 1}`, p])),
  ...RABILLOS.flatMap((d, i) => puntos(d).map((p) => [`rabillo ${i + 1}`, p])),
  ...puntos(TALLO).map((p) => ['tallo', p]),
  /* De cada aceituna se revisan los cuatro extremos del círculo. */
  ...ACEITUNAS.flatMap((o, i) => [
    [o.cx - o.r, o.cy], [o.cx + o.r, o.cy], [o.cx, o.cy - o.r], [o.cx, o.cy + o.r],
  ].map((p) => [`aceituna ${i + 1}`, p])),
]

let fallos = 0
let minimo = { d: Infinity }

for (const [quien, p] of aRevisar) {
  for (const lado of LADOS) {
    const d = distancia(p, lado)
    if (d < minimo.d) minimo = { d, quien, lado: lado.nombre, p }
    if (d < MARGEN) {
      console.log(`MAL  ${quien} en (${p[0]}, ${p[1]}) queda a ${d.toFixed(2)} del ${lado.nombre}`)
      fallos++
    }
  }
  if (p[1] > 29.2) { console.log(`MAL  ${quien} se sale por abajo (y=${p[1]})`); fallos++ }
}

/* Las aceitunas tienen que verse como dos, no como un bulto: si se tocan, a
   54 px se funden en una mancha y la rama pierde lo que la hace reconocible. */
/* 1.5 unidades del viewBox de 32 son unos 2.5 px cuando el isotipo se dibuja
   a 54 px en la barra lateral: por debajo de eso el antialiasing cierra el
   hueco y las dos aceitunas se ven como una sola. */
const SEPARACION = 1.5
for (let i = 0; i < ACEITUNAS.length; i++) {
  for (let j = i + 1; j < ACEITUNAS.length; j++) {
    const a = ACEITUNAS[i]
    const b = ACEITUNAS[j]
    const hueco = Math.hypot(a.cx - b.cx, a.cy - b.cy) - a.r - b.r
    if (hueco < SEPARACION) {
      console.log(`MAL  las aceitunas ${i + 1} y ${j + 1} dejan ${hueco.toFixed(2)} de hueco (mínimo ${SEPARACION})`)
      fallos++
    } else {
      console.log(`OK   las aceitunas ${i + 1} y ${j + 1} dejan ${hueco.toFixed(2)} de hueco`)
    }
  }
}

console.log(`\nPunto más justo: ${minimo.quien} a ${minimo.d.toFixed(2)} del ${minimo.lado} (mínimo ${MARGEN}).`)
console.log(fallos === 0 ? 'La rama cabe entera dentro de la casa.' : `\n${fallos} puntos fuera de holgura.`)
process.exit(fallos === 0 ? 0 : 1)
