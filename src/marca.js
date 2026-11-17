/*
 * El isotipo de Casa Los Olivos: la silueta de una casa, abierta por abajo,
 * con una rama de olivo dentro.
 *
 * Va como SVG en línea y no como imagen por tres razones: pesa unos cientos
 * de bytes, se recolorea desde el código (en la barra lateral va dorado sobre
 * verde y en el PDF impreso verde sobre blanco) y no se pixela al ampliarlo.
 *
 * No es el logo original vectorizado, es un dibujo del mismo trazo. Si algún
 * día llega el SVG del diseñador, se sustituye aquí y las cuatro cosas que lo
 * usan —barra lateral, portal, PDF y favicon— se enteran solas.
 *
 * Las hojas NO llevan las puntas escritas a mano. Se calculan a partir del
 * tallo: cada una nace en un punto de la curva y sale en un ángulo respecto
 * de la tangente, que es como crecen de verdad. Puesto a mano, cada hoja
 * apuntaba a donde se le antojaba y el conjunto parecía un molinillo.
 */

/** Casa abierta por abajo: dos muros y el techo, sin cerrar el piso. */
export const CASA = 'M4.6 29.2V13.1L16 3.4l11.4 9.7v16.1'

/* El tallo, como curva de Bézier cúbica. De aquí salen tanto el trazo que se
   dibuja como la posición y el ángulo de cada hoja. */
const P0 = [10.2, 25.8]
const P1 = [13.4, 22.4]
const P2 = [17.2, 17.8]
const P3 = [21.0, 13.2]

export const TALLO = `M${P0[0]} ${P0[1]}C${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]} ${P3[0]} ${P3[1]}`

/** Punto de la curva en t. */
const punto = (t) => {
  const u = 1 - t
  return [0, 1].map((i) =>
    u * u * u * P0[i] + 3 * u * u * t * P1[i] + 3 * u * t * t * P2[i] + t * t * t * P3[i])
}

/** Tangente unitaria de la curva en t: hacia dónde «mira» la rama ahí. */
const tangente = (t) => {
  const u = 1 - t
  const d = [0, 1].map((i) =>
    3 * u * u * (P1[i] - P0[i]) + 6 * u * t * (P2[i] - P1[i]) + 3 * t * t * (P3[i] - P2[i]))
  const l = Math.hypot(d[0], d[1]) || 1
  return [d[0] / l, d[1] / l]
}

const n = (v) => Number(v.toFixed(2))

/**
 * Una hoja de olivo: un huso entre la base y la punta.
 * `ancho` es cuánto se abre el huso a la mitad; con más de 1.3 deja de
 * parecer hoja de olivo y parece pétalo.
 */
const huso = (bx, by, tx, ty, ancho) => {
  const mx = (bx + tx) / 2
  const my = (by + ty) / 2
  const largo = Math.hypot(tx - bx, ty - by) || 1
  const px = ((ty - by) / largo) * ancho
  const py = ((bx - tx) / largo) * ancho
  return `M${n(bx)} ${n(by)}Q${n(mx + px)} ${n(my + py)} ${n(tx)} ${n(ty)}` +
    `Q${n(mx - px)} ${n(my - py)} ${n(bx)} ${n(by)}Z`
}

/**
 * Coloca una hoja sobre el tallo: nace en `t`, se separa un poco del trazo
 * para que el tallo siga viéndose por debajo, y sale girada `grados` respecto
 * de la tangente. `lado` es +1 hacia arriba-derecha y -1 hacia abajo-izquierda.
 */
const hojaEn = (t, lado, grados, largo, ancho = 1.2, despegue = 0.5) => {
  const [px, py] = punto(t)
  const [tx, ty] = tangente(t)
  const nx = -ty * lado
  const ny = tx * lado
  const bx = px + nx * despegue
  const by = py + ny * despegue
  const a = (grados * Math.PI) / 180 * lado
  const dx = tx * Math.cos(a) - ty * Math.sin(a)
  const dy = tx * Math.sin(a) + ty * Math.cos(a)
  return huso(bx, by, bx + dx * largo, by + dy * largo, ancho)
}

/* Cinco hojas alternando lado. La última sale casi recta, que es la guía de
   la rama; las otras abren unos 50°. */
export const HOJAS = [
  hojaEn(0.14, -1, 52, 5.0),
  hojaEn(0.34, 1, 50, 5.2),
  hojaEn(0.55, -1, 50, 4.9),
  hojaEn(0.76, 1, 48, 4.5, 1.1),
  /* La guía de la rama. Va corta y girada hacia dentro porque, siguiendo la
     tangente, apuntaba justo a la vertiente derecha del techo. */
  hojaEn(0.94, -1, 30, 3.6, 1.0, 0.2),
]

/* Las dos aceitunas cuelgan por debajo del tallo: son lo único del isotipo
   que sigue leyéndose a 22 px, así que van separadas entre sí y del trazo. */
const aceitunaEn = (t, r, caida) => {
  const [px, py] = punto(t)
  const [tx, ty] = tangente(t)
  return { cx: n(px - ty * -caida), cy: n(py + tx * caida), r, t }
}

/* Separadas en `t` y a distinta profundidad: colgando las dos a la misma
   distancia del tallo quedaban alineadas con él y se leían como un bulto. */
export const ACEITUNAS = [
  aceitunaEn(0.16, 1.75, 2.5),
  aceitunaEn(0.54, 1.55, 3.4),
]

/** Los rabillos que atan cada aceituna al tallo. */
export const RABILLOS = ACEITUNAS.map((o) => {
  const [px, py] = punto(o.t)
  return `M${n(px)} ${n(py)}L${n(o.cx)} ${n(o.cy - o.r)}`
})

/**
 * El mismo dibujo como cadena, para el encabezado de los PDF y el favicon,
 * que se arman con texto y no pueden montar un componente de React.
 */
export const svgMarca = ({ tamano = 32, trazo = '#3A4523', relleno = '#C9A86A' }) => `
<svg width="${tamano}" height="${tamano}" viewBox="0 0 32 32" fill="none"
     stroke="${trazo}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true">
  <path d="${CASA}"/>
  <path d="${TALLO}"/>
  ${RABILLOS.map((d) => `<path d="${d}" stroke-width="1.1"/>`).join('')}
  ${HOJAS.map((d) => `<path d="${d}" fill="${relleno}" stroke="${relleno}" stroke-width="0.6"/>`).join('')}
  ${ACEITUNAS.map((o) => `<circle cx="${o.cx}" cy="${o.cy}" r="${o.r}" fill="${relleno}" stroke="none"/>`).join('')}
</svg>`
