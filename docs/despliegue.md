# Desplegar Alba en Railway

Alba es una aplicación de una sola página: no hay backend ni base de datos. Lo único que corre
en el servidor es `server.js`, que sirve `dist/` y devuelve `index.html` en las rutas de la SPA.

**La URL va a quedar abierta, sin contraseña.** Es una decisión tomada a propósito: todos los
datos son ficticios (residencia inventada, seis residentes inventados, diez empleados
inventados) y no hay nada de ningún cliente. Lo único que se hace es mantenerlo fuera de los
buscadores, con `robots.txt` y la cabecera `X-Robots-Tag: noindex`.

> Si algún día se le cargan datos reales —de Diltex, de Ánfora o de quien sea— **hay que poner
> contraseña antes de volver a desplegar**. El patrón está hecho y probado en
> `portal-incentivos-anfora/server.js`: Basic Auth con `PORTAL_PASSWORD`, `timingSafeEqual` y
> el servidor cayéndose si falta la variable.

## Paso 1 — subir a GitHub

El repositorio local ya está creado y con el primer commit hecho. Falta conectarlo:

```powershell
cd "C:\Users\PC\Documents\Devol\Claude Code\alba-residencia"
git remote add origin https://github.com/<tu-usuario>/alba-residencia.git
git branch -M main
git push -u origin main
```

Crea el repositorio en <https://github.com/new>, sin marcar «Add a README» (ya hay uno).
Privado o público da igual aquí, porque no hay datos de nadie; privado por costumbre.

## Paso 2 — crear el servicio en Railway

1. <https://railway.app> → **New Project** → **Deploy from GitHub repo**.
2. Elige `alba-residencia`. Railway lee `railway.json`, ve que hay un `Dockerfile` y no hay
   que configurar ni build ni start command.
3. **No hace falta añadir ninguna variable de entorno.** `PORT` la inyecta Railway sola; no la
   pongas a mano.
4. **Settings → Networking → Generate Domain** para obtener la URL pública.

El primer build tarda un par de minutos. Los siguientes van más rápido por la caché de capas
de Docker. A partir de ahí, cada `git push` a `main` redespliega solo.

## Cómo se comprueba que quedó bien

```powershell
$url = "https://<tu-dominio>.up.railway.app"
(Invoke-WebRequest "$url/salud").StatusCode       # 200, y el cuerpo dice "ok"
(Invoke-WebRequest "$url/").StatusCode            # 200 — el panel
(Invoke-WebRequest "$url/familiar").StatusCode    # 200 — el portal familiar
(Invoke-WebRequest "$url/robots.txt").Content     # Disallow: /
```

Lo que más se rompe al desplegar una SPA es la tercera: si `/familiar` da **404**, es que el
fallback a `index.html` no está funcionando y Railway está sirviendo los archivos por su
cuenta en vez de pasar por `server.js`.

Y una prueba que vale la pena hacer a mano: abre `/familiar` **en un teléfono de verdad**. Esa
pantalla está diseñada a 390×844 y es donde mejor se ve el trabajo.

## Probarlo en local igual que en Railway

```powershell
npm run build
$env:PORT = "8077"; npm start
```

Con `PORT` puesta, el servidor se comporta como en el contenedor (escucha en `0.0.0.0` e
imprime una sola línea). Sin `PORT`, arranca en el 8099 e imprime además la IP de tu red local,
para abrir el portal familiar en el teléfono sin desplegar nada:

```powershell
npm run build
npm start
# Panel            http://localhost:8099/
# Portal familiar  http://localhost:8099/familiar
# Desde un teléfono en la misma red: http://192.168.x.x:8099/familiar
```

`npm run dev` sigue siendo lo de siempre para trabajar: Vite en el 5180, con recarga en
caliente.

## Decisiones que conviene conocer

- **`0.0.0.0` y no `localhost`.** Railway necesita que el proceso escuche en todas las
  interfaces; con `localhost` el contenedor arranca pero el healthcheck nunca conecta y el
  despliegue se marca como caído. El efecto secundario en local es bueno: el portal familiar
  se puede abrir desde un teléfono de la misma red.
- **`/salud` para el healthcheck**, declarado en `railway.json`. No toca el disco: si faltara
  `dist/`, el proceso ya se habría caído al arrancar.
- **Dockerfile y no Nixpacks**, igual que en el portal de Ánfora. Nixpacks decide por su
  cuenta si instala las devDependencies, y aquí el build depende de ellas (`vite` y
  `@vitejs/plugin-react`). La segunda etapa no instala **nada**: `server.js` solo usa módulos
  `node:*`, así que la imagen final es `dist/` más un archivo.
- **Compresión en el propio servidor.** Sin dependencias, con `node:zlib`: el bundle pasa de
  372 kB a unos 106 kB. Solo se comprime texto; el PNG y el woff2 ya vienen comprimidos.
- **Caché**: los archivos de `assets/` llevan hash en el nombre, así que van con `immutable` a
  un año; el `index.html` va con `no-cache` para que un redespliegue se vea sin vaciar caché.
- **El estado no sobrevive a una recarga.** Todo vive en memoria del navegador: lo que Jorge
  capture en la demo (incidentes, turnos, ingesta) desaparece al refrescar, y cada persona que
  entre a la URL ve el prototipo desde el principio. Para una demo es lo que se quiere.
