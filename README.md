# Alba — Residencia Los Álamos

Web real (Vite + React) portada del prototipo de Claude Design **"Prototipo App Hospedaje Geriátrico"**.
Datos ficticios de ejemplo, sin backend ni persistencia: el estado vive en memoria y se reinicia al recargar.

## Arrancar

**Para enseñarlo / dejarlo corriendo** (build de producción, puerto 8099):

```bash
npm install
npm run build
npm start                 # http://localhost:8099
```

`server.js` no tiene dependencias (solo `node:*`) y escucha únicamente en `127.0.0.1`.
Para cambiar el puerto: `npm start -- --puerto 9000`, o la variable `PORT`.

**Para desarrollar** (recarga en caliente, puerto 5180):

```bash
npm run dev
```

## Rutas

| Ruta | Lienzo original | Descripción |
|---|---|---|
| `/` | `Main.dc.html` (1440×1080) | Panel de escritorio para el personal |
| `/familiar` | `PortalFamiliar.dc.html` (390×844) | Portal móvil para familiares |

Son rutas de una SPA: no existen como archivo en disco, así que `server.js` devuelve
`index.html` para cualquier ruta desconocida. Sin eso, entrar directo a `/familiar`
daría un 404.

La pastilla "Panel · Portal familiar" salta entre las dos. **No es parte del diseño**:
existe solo para demostrar ambas pantallas desde una misma web. Flota abajo a la derecha
en el panel y va encima del teléfono en el portal (en 390 px cualquier elemento flotante
acaba tapando las pestañas o el botón "Enviar"). Para quitarla, borra `src/Switcher.jsx`
y sus usos en `src/App.jsx` y `src/familiar/PortalFamiliar.jsx`.

## Estructura

```
diseno-original/        Los .dc.html de Claude Design + los dos .md de lineamientos (referencia)
src/
  config.js             Props configurables del prototipo (color de acento, vista inicial)
  data/alba.js          Modelo de datos completo: residentes, eMAR, facturación, signos, módulos
  data/fechas.js        "Hoy" del prototipo (9 nov 2026) y las cuentas de días
  data/personal.js      Plantilla, turnos, asistencia y certificaciones (módulo nuevo)
  data/inventario.js    Artículos, solicitudes y libro de controlados (módulo nuevo)
  data/cocina.js        Menú de la semana, dietas, ingesta y lista de compras (módulo nuevo)
  data/reportes.js      Histórico de meses cerrados, expediente NOM-031 y bitácora previa (módulo nuevo)
  panel/
    usePanel.js         Port 1:1 de renderVals() de Main.dc.html — toda la lógica derivada
    usePersonal.js      Lógica del módulo Personal y turnos (diseño nuevo, no viene del .dc.html)
    useInventario.js    Lógica del módulo Inventario (ídem). Vive bajo usePanel: el eMAR descuenta aquí
    useCocina.js        Lógica del módulo Cocina y dietas (ídem). También bajo usePanel: la agenda lee de aquí
    useReportes.js      Lógica del módulo Reportes (ídem) + useBitacora(), el registro que alimentan los demás
    documentos.js       Arma los PDF (expediente, carátula, bitácora) y los manda a imprimir
    Panel.jsx           Layout + conmutación de vistas
    Sidebar.jsx         Barra lateral con insignia de dosis retrasadas
    Header.jsx          Título dinámico, buscador, notificaciones
    modales/            Modal base, campos reutilizables y los seis formularios
    vistas/             Inicio · Residentes · Ficha · Medicación · Enfermería · Facturación · ModuloPorPrototipar
    vistas/personal/    Calendario · Asistencia · Entregas · Certificaciones
    vistas/inventario/  Existencias · Alertas · Reposiciones · Controlados
    vistas/cocina/      Menú · Dietas · Ingesta · Compras
    vistas/reportes/    Indicadores · Expedientes · Bitácora · Financieros
  familiar/
    PortalFamiliar.jsx  Las 4 pestañas (Hoy, Mensajes, Pagos, Visitas)
```

Los estilos son **inline**, transcritos literalmente del `.dc.html` para conservar colores,
tamaños y espaciado. Lo global (fuente Figtree, `body`, tablas) está en `index.html`.

## Interactividad

### Heredada del prototipo

- Menú lateral cambia de vista; la insignia roja muestra las dosis retrasadas en vivo.
- Filtros de residentes (Todos / Atención / Vigilancia / Estables) y "Ver ficha" ↔ "← Volver".
- **Administrar** en el eMAR registra hora (09:41) y enfermera, sube el contador de la ronda
  y baja la insignia del menú.
- **Emitir CFDI** marca la factura como timbrada.
- Portal familiar: pestañas y elección de horario de visita.

### Añadida después (el prototipo los dejaba inertes)

El `.dc.html` original tenía diez controles sin `onClick`. Todos quedaron conectados, y lo
que capturan **sí se guarda** en memoria, como el resto del prototipo:

| Control | Efecto visible |
|---|---|
| **Reportar incidente** (Inicio y Ficha) | Nueva tarjeta al inicio de "Alertas que requieren atención"; sube el KPI *Alertas activas*. Desde la ficha, preselecciona al residente |
| **Nueva evolución** (Ficha) | Reemplaza la nota clínica y su línea de firma, con el médico elegido y fecha de hoy |
| **Nuevo ingreso** / **+ Nuevo residente** | Añade el residente a la tabla y sube el KPI *Ocupación* (42 → 43 / 48) |
| **Registrar toma** (dosis PRN) | Muestra "09:41 · L. Pérez", igual que las dosis programadas |
| **Guardar registro** (Enfermería) | Actualiza la fila del residente en la tabla de signos; los valores fuera de rango se resaltan solos. Avisa si faltan campos |
| **Buscador** | Desplegable con residentes y medicamentos; al elegir, abre la ficha o la ronda |
| **Campana** | Desplegable con las alertas activas; al elegir, navega a la ficha correspondiente |

Los modales cierran con Escape o clic fuera, enfocan el primer campo y se envían con Enter.
Están en `src/panel/modales/`.

Y los tres del **portal familiar**:

| Control | Efecto visible |
|---|---|
| **Enviar** (Mensajes) | Añade la burbuja a la conversación con hora propia (09:41, 09:42…) y baja el scroll. El botón se deshabilita y se agrisa con el campo vacío |
| **Confirmar visita** | Actualiza "Próxima visita confirmada" al horario elegido y muestra confirmación |
| **Pagar con transferencia SPEI** | Abre una hoja inferior con CLABE, referencia, beneficiario e importe, con botones de copiar. Al confirmar, el saldo pasa a "Pago en validación" y aparece la fila de noviembre en el historial |

La hoja de pago (`src/familiar/HojaPago.jsx`) se superpone **solo al teléfono**, no a toda la
ventana, que es el patrón normal en móvil.

## Decisiones de la conversión

- `class Component extends DCLogic` → hook `usePanel()` + `useState`. Devuelve el mismo
  conjunto de valores que `renderVals()`, para poder comparar 1 a 1 contra el prototipo.
  Lo que sigue a `// Estado añadido` en ese archivo **no** existe en el original: es lo que
  da vida a los formularios (incidentes, evoluciones, altas, tomas PRN y signos).
- `<sc-if>` → `{cond && ...}`; `<sc-for>` → `.map()`; `{{expr}}` → `{expr}`.
- Se eliminó `support.js` (runtime del editor de diseño); su papel lo cubre React.
- Los lectores de pantalla usan la clase `.sr-only` en vez del `position:absolute` inline
  del original, que dependía de un ancestro posicionado que no existía.
- El portal familiar conserva los 390×844 del lienzo, centrado sobre un fondo neutro en
  pantallas grandes y a pantalla completa en un teléfono.

## Props del prototipo

En `src/config.js`. En el original eran ajustes del lienzo (`data-props`):

- `ACCENT` — color de acento. Alternativas: verde `#0E7C6B` (actual), azul `#2F5DA8`,
  morado `#7A4FB5`, naranja `#B4541A`.
- `START_VIEW` — vista inicial del panel.

## Módulos desarrollados

En el prototipo, los cuatro módulos de "Gestión" eran tarjetas punteadas con sus funciones
prometidas. **Los cuatro están desarrollados** — Personal y turnos, Inventario, Cocina y
dietas, y Reportes e inspecciones — y son lo único del panel que **no** existe en el
`.dc.html`: el diseño es nuevo, pero reutiliza los tokens, las tarjetas, las tablas y la
paleta de estados del resto de la app.

`ModuloPorPrototipar.jsx` sigue en el repo aunque ya no se pinte nunca: es el port fiel de la
tarjeta punteada del original y el mecanismo (`MODULOS_PENDIENTES`, ahora una lista vacía)
queda listo por si se añade un módulo nuevo.

### "Personal y turnos"

Vive en `src/panel/vistas/personal/` con su propio hook, `src/panel/usePersonal.js`, y datos
en `src/data/personal.js` (10 personas ficticias en Enfermería, Cuidadores, Cocina y Limpieza;
tres turnos: matutino 07–15, vespertino 15–23, nocturno 23–07).

Cuatro sub-pestañas, con insignia cuando algo requiere atención:

- **Calendario** — rejilla persona × día de la semana. Al tocar una casilla se abre un menú
  para reasignar el turno. Detecta los turnos **sin cobertura de enfermería** y los lista
  arriba; al cubrir uno, el aviso y la insignia bajan solos.
- **Asistencia** — entradas y salidas del día con ubicación de la checada. Marca retardo
  (más de 10 min sobre el inicio del turno) y checada fuera del perímetro como incidencias.
- **Entregas de turno** — notas firmadas de un turno al siguiente, con el modal para añadir.
- **Certificaciones** — cédulas y cursos con vigencia. Avisa 60 días antes; "Registrar
  renovación" suma un año y recalcula los contadores.

**Una nota sobre los datos:** los descansos de las tres enfermeras están puestos en días
distintos **a propósito**, para que el calendario arranque con tres huecos de cobertura y se
vea la detección funcionando. Si quieres una semana "limpia", cambia `descanso` de `p1`, `p2`
y `p3` en `src/data/personal.js`.

### "Inventario"

Vive en `src/panel/vistas/inventario/`, con `src/panel/useInventario.js` y datos en
`src/data/inventario.js` (18 referencias: nueve botiquines individuales y nueve artículos
del almacén general, más tres medicamentos controlados).

A diferencia de Personal, este módulo **no es independiente**: su hook se llama desde
`usePanel` porque el eMAR lo toca. El campo `medId` ata un artículo a una línea de la ronda
de medicación, y administrar esa dosis descuenta `porToma` unidades del botiquín del
residente. Por eso la vista de Medicación ya decía "el inventario se descuenta
automáticamente": ahora ocurre de verdad, y el aviso amarillo de esa pantalla sale de aquí
en vez de ser texto fijo.

Cuatro sub-pestañas:

- **Existencias** — botiquín por residente y almacén general, con lote, caducidad, barra
  contra el mínimo y días de cobertura. "Registrar entrada" da de alta lo que llega.
- **Alertas** — lo que está en o por debajo del mínimo y lo que caduca en 30 días. Desde
  aquí se pide la reposición a la familia (medicamentos) o al proveedor (insumos), y se
  retira un lote caducado.
- **Reposiciones** — las solicitudes y su estado. Al registrar la recepción, las existencias
  suben solas y la alerta desaparece.
- **Controlados** — grupos I a III de la Ley General de Salud: resguardo bajo llave, libro
  de control con saldo corrido y **doble firma** (el formulario no deja poner al mismo
  responsable y testigo, ni sacar más de lo que marca el libro). Incluye la conciliación
  contra el conteo físico: el Tramadol arranca con un descuadre de una tableta, y
  "Levantar acta y ajustar" lo cuadra dejando el movimiento asentado.

El ciclo completo se ve en tres clics: administrar la Levodopa de Roberto en el eMAR baja
el botiquín a 6 (su mínimo), el aviso de la ronda gana una línea, la insignia del menú sube
y la alerta ofrece pedirle 90 dosis a la familia.

### "Cocina y dietas"

Vive en `src/panel/vistas/cocina/`, con `src/panel/useCocina.js` y datos en
`src/data/cocina.js`. Igual que Inventario, su hook cuelga de `usePanel`, porque **la agenda
de Inicio lee de aquí**: la línea "13:00 · Comida · 3 dietas especiales · 2 consistencias
blandas" era texto fijo en el `.dc.html` y ahora se cuenta sola.

- **Menú de la semana** — los 7 días × 5 tiempos. Cada tiempo muestra el plato base y, debajo,
  solo las adaptaciones que hoy le tocan a alguien, con el nombre de quién las come. Si el
  plato lleva un alérgeno que un residente no tolera, aparece señalado hasta que se registre
  la alternativa. Se puede editar cualquier tiempo.
- **Dietas y consistencias** — la tabla de las seis dietas, con la consistencia como eje
  aparte (Normal, blanda, picada, licuada). Cambiar una recalcula el menú y la agenda.
- **Registro de ingesta** — rejilla residente × tiempo de comida, con cuatro niveles
  (completo, la mitad, poco, nada). Calcula la media por residente y la del día; dos tiempos
  seguidos por debajo de la mitad escalan de "vigilar" a "avisar a enfermería".
- **Lista de compras** — lo que hace falta para el menú, agrupado por categoría, con el motivo
  de cada línea y los artículos de dieta especial al final.

**Dos avisos sobre los datos.** El campo `alergias` de la ficha clínica es de
**medicamentos** (penicilina, sulfonamidas, ibuprofeno, látex) y no sirve para cocinar: las
alergias alimentarias son un campo nuevo, `evitar`, y la pantalla de Dietas lo dice en pantalla.
Y la consistencia blanda de Roberto Hernández no aparece en su ficha, porque en el prototipo
la consistencia solo existía embebida en el texto de Carmen Ruiz; aquí está puesta como
indicación del 9 de noviembre, tras su caída.

### "Reportes e inspecciones"

Vive en `src/panel/vistas/reportes/`, con `src/panel/useReportes.js` y datos en
`src/data/reportes.js`. Es el último de los cuatro y el que más depende de los demás: salvo el
histórico de meses ya cerrados y los expedientes, **no tiene datos propios**. Su hook también
cuelga de `usePanel`, y de paso obligó a subir ahí `usePersonal`, que hasta ahora vivía en su
vista y se reiniciaba al cambiar de pantalla.

- **Indicadores** — ocupación, caídas, úlceras e incidentes, mes a mes, con barras de junio a
  noviembre. Noviembre no está en el archivo de datos: se cuenta con lo que haya en la app, y
  el tipo que se elija en "Reportar incidente" decide si suma a caídas o a úlceras.
- **Expedientes** — los diez documentos de la **NOM-031-SSA3-2012** por residente. Tres de
  ellos caducan (valoración geriátrica al año, plan de atención a los seis meses, esquema de
  vacunación al año), así que un expediente puede estar completo y aun así no servir.
  "Expediente en PDF" y "Carátula de inspección (PDF)" generan el documento de verdad.
- **Bitácora de auditoría** — quién, qué y cuándo, con filtro por módulo y exportación.
- **Financieros** — facturado, cobrado, cartera vencida, CFDI timbrados y la serie mensual.

**Cómo se comparan meses parciales.** Noviembre lleva 9 de 30 días: comparar su conteo con el
de octubre no dice nada. Por eso cada indicador lleva, además del número, una tasa normalizada
—caídas por 1 000 días-residente, prevalencia de úlceras en porcentaje— y la flecha de
tendencia se calcula sobre la tasa, no sobre el conteo. Con los datos de muestra, 1 caída en 9
días sale **peor** que 3 en 31, que es justo lo que un conteo a secas escondería.

**El PDF, sin librerías.** `src/panel/documentos.js` arma un documento aparte, lo escribe en
un iframe oculto y lo manda al diálogo de impresión, donde "Guardar como PDF" es una opción
estándar. No hay dependencias nuevas ni backend. Va en un iframe y no en una ventana nueva
porque los navegadores bloquean `window.open()`, y el `print()` va un tick después de escribir
el documento porque hacerlo en el mismo tick imprime la hoja en blanco.

**La bitácora se escribe sola.** `useBitacora()` vive en `usePanel` y reparte una función
`anotar` a los demás hooks; cada acción de la app —administrar una dosis, timbrar un CFDI,
cambiar un turno, registrar una ingesta— deja su línea. La única excepción es el libro de
controlados: ya es un registro con hora, responsable, testigo y folio, así que la bitácora lo
lee de ahí en lugar de duplicarlo.

**Una nota sobre los datos.** El prototipo trae 6 facturas de muestra aunque la ocupación sea
de 42 camas, así que los totales financieros son de esas 6 cuentas y no de la residencia
entera. En vez de inventar una cartera completa que contradijera la pantalla de Facturación,
la pestaña lo dice en pantalla. Y hay tres situaciones puestas a propósito, las que encuentra
un inspector: a Roberto Hernández se le venció el plan de atención el 4 de noviembre (y encima
se cayó el 8), a Guadalupe Soto le quedan 12 días de valoración geriátrica, y Antonio Medina
nunca entregó el esquema de vacunación.
