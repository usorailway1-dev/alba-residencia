/*
 * Servidor del prototipo de Casa Los Olivos. Solo sirve `dist/` — no hay
 * backend: todo el estado del prototipo vive en el navegador.
 *
 * La carpeta, el paquete y el repositorio siguen llamándose `alba-residencia`,
 * que era el nombre del prototipo antes de adoptar la marca del cliente.
 * Renombrarlos obligaría a reconectar el servicio de Railway, y no vale la
 * pena: lo que se ve en pantalla ya dice Casa Los Olivos.
 *
 * Sin dependencias a propósito (solo `node:*`), para que arranque con un
 * `npm start` aunque no se haya instalado nada más. Hace tres cosas que un
 * servidor de archivos cualquiera no haría:
 *
 *  1. Devuelve `index.html` en las rutas de la SPA, que no existen como
 *     archivo. Sin eso, entrar directo a /familiar daría 404.
 *  2. Escucha en `0.0.0.0` y en `process.env.PORT`, que es lo que Railway
 *     necesita. Escuchando en `localhost` el contenedor arranca pero el
 *     healthcheck nunca conecta y el despliegue se marca como caído.
 *  3. Comprime lo que vale la pena comprimir: el bundle pasa de 372 kB a unos
 *     106 kB, que en un teléfono con datos móviles se nota.
 *
 * A diferencia del portal de Ánfora, este **no lleva contraseña**: los datos
 * son ficticios y no hay nada de ningún cliente. Si algún día se le cargan
 * datos reales, hay que revisar esa decisión antes de volver a desplegar.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { networkInterfaces } from 'node:os'
import { dirname, extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createGzip } from 'node:zlib'

const RAIZ = dirname(fileURLToPath(import.meta.url))
const DIST = join(RAIZ, 'dist')
const INDEX = join(DIST, 'index.html')

/* Las banderas de línea de comandos son solo para local. En Railway se
   configura por variables de entorno y no se le pasa ningún argumento. */
const ARGS = process.argv.slice(2)
const opcion = (nombre) => {
  const i = ARGS.indexOf(`--${nombre}`)
  return i !== -1 && ARGS[i + 1] ? ARGS[i + 1] : ''
}

const PUERTO = Number(process.env.PORT || opcion('puerto')) || 8099
/* Si el puerto lo inyecta el entorno, estamos en un servidor y la URL la
   publica él; si no, es un arranque local y conviene imprimir las dos. */
const ALOJADO = !!process.env.PORT

if (!existsSync(INDEX)) {
  console.error('\nNo arranco: falta `dist/`. Genera el build primero:\n\n  npm run build\n')
  process.exit(1)
}

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

/* Solo texto: el PNG y el woff2 ya vienen comprimidos y pasarlos por gzip
   gasta CPU para dejarlos igual o un poco más grandes. */
const COMPRIMIBLES = new Set(['.html', '.js', '.css', '.json', '.txt', '.svg'])

function enviar(req, res, archivo) {
  const ext = extname(archivo).toLowerCase()
  const cabeceras = {
    'Content-Type': TIPOS[ext] || 'application/octet-stream',
    // Vite pone un hash en cada archivo de `assets/`, así que esos se pueden
    // cachear para siempre. El index.html nunca.
    'Cache-Control': archivo.includes(`${sep}assets${sep}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    // Sin contraseña delante, al menos que no acabe en un buscador.
    'X-Robots-Tag': 'noindex, nofollow',
  }

  const aceptaGzip = (req.headers['accept-encoding'] || '').includes('gzip')
  if (aceptaGzip && COMPRIMIBLES.has(ext)) {
    res.writeHead(200, { ...cabeceras, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' })
    return createReadStream(archivo).pipe(createGzip()).pipe(res)
  }

  res.writeHead(200, cabeceras)
  createReadStream(archivo).pipe(res)
}

/** La IP de la red local, para abrir el portal familiar en un teléfono. */
function ipDeLaRed() {
  for (const tarjetas of Object.values(networkInterfaces())) {
    for (const t of tarjetas || []) {
      if (t.family === 'IPv4' && !t.internal) return t.address
    }
  }
  return null
}

createServer((req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)

  /* El healthcheck de Railway. Va aparte y no toca el disco: si `dist/`
     faltara, el proceso ya se habría caído al arrancar. */
  if (ruta === '/salud') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    return res.end('ok')
  }

  // `normalize` + el prefijo obligatorio evitan salirse de `dist/` con "..".
  const candidato = normalize(join(DIST, ruta))
  if (candidato.startsWith(DIST) && ruta !== '/' && existsSync(candidato) && statSync(candidato).isFile()) {
    return enviar(req, res, candidato)
  }

  /* Las rutas de la SPA ("/", "/familiar") no existen como archivo: se
     devuelve el index y React Router decide qué pintar. */
  enviar(req, res, INDEX)
}).listen(PUERTO, '0.0.0.0', () => {
  if (ALOJADO) {
    console.log(`Casa Los Olivos escuchando en el puerto ${PUERTO}.`)
    return
  }
  const ip = ipDeLaRed()
  console.log(`\nCasa Los Olivos escuchando en:\n`)
  console.log(`  Panel            http://localhost:${PUERTO}/`)
  console.log(`  Portal familiar  http://localhost:${PUERTO}/familiar`)
  if (ip) {
    console.log(`\n  Desde un teléfono en la misma red (el portal familiar se ve mejor ahí):`)
    console.log(`  http://${ip}:${PUERTO}/familiar\n`)
  } else {
    console.log('')
  }
})
