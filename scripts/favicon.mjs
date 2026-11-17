/*
 * Genera `public/favicon.svg` a partir del mismo trazo que usa la aplicación,
 * para no acabar con un isotipo en el código y otro distinto en la pestaña
 * del navegador.
 *
 *   npm run favicon
 *
 * En la pestaña el isotipo va sobre el cuadro verde y no suelto: a 16 px una
 * silueta de línea fina se deshace, y el contraste del fondo la salva.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CASA, TALLO, HOJAS, ACEITUNAS } from '../src/marca.js'
import { VERDE, DORADO } from '../src/config.js'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7" fill="${VERDE}"/>
  <g transform="translate(16 16) scale(0.78) translate(-16 -16)"
     fill="none" stroke="${DORADO}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
    <path d="${CASA}"/>
    <path d="${TALLO}"/>
${HOJAS.map((d) => `    <path d="${d}" fill="${DORADO}" stroke="${DORADO}" stroke-width="0.9"/>`).join('\n')}
${ACEITUNAS.map((o) => `    <circle cx="${o.cx}" cy="${o.cy}" r="${o.r}" fill="${DORADO}" stroke="none"/>`).join('\n')}
  </g>
</svg>
`

mkdirSync(join(RAIZ, 'public'), { recursive: true })
writeFileSync(join(RAIZ, 'public', 'favicon.svg'), svg)
console.log('public/favicon.svg regenerado desde src/marca.js')
