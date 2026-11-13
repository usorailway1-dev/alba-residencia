# Lineamientos para recrear el prototipo "Alba" en Claude Design

> Este documento describe, pantalla por pantalla y dato por dato, el prototipo "Prototipo App Hospedaje Geriátrico" (nombre de app provisional: **Alba**) para que puedas pegarlo en una conversación nueva con el tipo de artefacto **Design** de Claude y pedirle que lo regenere de forma fiel. Incluye el sistema visual, la estructura de cada vista, los textos exactos y los datos de ejemplo usados, más una nota de uso al final.

## 0. Cómo usarlo

1. Abre una conversación nueva y pide crear un artefacto de tipo **Design** (o dile a Claude "créame un diseño/prototipo con Claude Design").
2. Pega este archivo completo como instrucción, y añade algo como: *"Recrea este prototipo tal cual se describe abajo, con dos lienzos (artboards) interactivos: el panel web de la residencia y el portal familiar móvil. Usa exactamente los textos, datos y colores indicados."*
3. Si quieres la máxima fidelidad (incluido el comportamiento interactivo exacto), puedes compartir también el código fuente de referencia del Apéndice — es el `.dc.html` original de cada lienzo.

## 1. Resumen del proyecto

- **Título del lienzo:** "Prototipo App Hospedaje Geriátrico"
- **Nombre de la app (provisional):** Alba — residencia de referencia: "Residencia Los Álamos" (contexto: México)
- **Dos lienzos (artboards), ambos interactivos:**
  1. **Panel de la residencia (web)** — `Main.dc.html` — 1440 × 1080 px — para personal (enfermería, administración)
  2. **Portal familiar (móvil)** — `PortalFamiliar.dc.html` — 390 × 844 px — para familiares de residentes
- Datos ficticios de ejemplo en todo el prototipo. Moneda en pesos mexicanos (MXN); facturación con CFDI 4.0; módulo de reportes alineado a la **NOM-031-SSA3-2012**.
- Nota original del autor en el lienzo: *"Prototipo navegable con datos ficticios de ejemplo. Prueba: menú lateral, Ver ficha, Administrar en la ronda de medicación, Emitir CFDI y filtros de residentes. El nombre «Alba» es provisional."*

## 2. Sistema visual (design tokens)

- **Tipografía:** Figtree (Google Fonts), pesos 400/500/600/700/800; fallback `system-ui, sans-serif`.
- **Fondo general de la app:** `#F3F5F7`
- **Texto por defecto:** `#1B2430`
- **Verde oscuro / institucional** (barra lateral, encabezado móvil, elementos seleccionados): `#12322F`
- **Color de acento (configurable, tipo "theme"):** por defecto verde `#0E7C6B` (hover `#0A5E51`); opciones alternas: azul `#2F5DA8`, morado `#7A4FB5`, naranja/terracota `#B4541A`.
- **Tarjetas:** fondo blanco `#FFFFFF`, borde `#E3E7EC`, radio 14–16 px, separación generosa (16–24 px).
- **Botones:** alto mínimo 40–48 px (pensado para pantallas táctiles), radio 9–12 px, tipografía semibold/bold.
- **Tablas:** encabezados en mayúsculas pequeñas (12 px, letter-spacing), color `#5B6675`, fondo `#F8FAFB`; filas separadas por línea `#EEF1F4`.
- **Paleta de estado (pills, etiquetas, alertas):**
  - `ok` (estable / pagado): fondo `#E3F3EF`, texto `#0B6B5C`
  - `warn` (vigilancia / pendiente): fondo `#FFF1D6`, texto `#8A5300`
  - `bad` (atención / vencido): fondo `#FDE8E6`, texto `#B42318`
  - `info` (informativo): fondo `#E8EEF9`, texto `#2B4C8C`
  - `gray` (neutro / según necesidad): fondo `#EEF1F4`, texto `#3D4652`
- **Avatares:** círculos con iniciales; tono cálido para personas (`#F4D9B8` fondo / `#5A3410` texto) y tono verde-azulado para residentes (`#E3F0EE` fondo / `#0B5A4E` texto).

## 3. Lienzo 1 — "Panel de la residencia (web)" (1440 × 1080)

### 3.1 Estructura general

Layout de dos columnas que ocupa toda la pantalla:

- **Barra lateral izquierda** (ancho flexible ~232 px, fondo `#12322F`, texto blanco):
  - Bloque de marca: icono de "techo/casa" en cuadro redondeado con el color de acento, nombre **"Alba"** en bold, subtítulo "Residencia Los Álamos".
  - Sección **"OPERACIÓN DIARIA"** (etiqueta en mayúsculas, color `#9FB8B3`): botones de navegación:
    - Inicio
    - Residentes
    - Medicación (eMAR) — con una insignia numérica roja/clara que muestra las dosis retrasadas (solo si hay alguna)
    - Enfermería
    - Facturación
  - Sección **"GESTIÓN"**: Personal y turnos · Inventario · Cocina y dietas · Reportes e inspecciones (estos cuatro son módulos "por prototipar", ver 3.8).
  - Pie de la barra: tarjeta de usuario con avatar "LP", nombre "Laura Pérez", rol "Enfermera · Turno matutino".
- **Panel principal** (fondo `#F3F5F7`, padding generoso):
  - **Encabezado superior:** título de página dinámico según la vista activa + línea de fecha/hora "Lunes 9 de noviembre de 2026 · 09:41 · Turno matutino"; a la derecha, buscador ("Buscar residente, medicamento…") y botón de notificaciones (icono de campana).
  - Debajo, el contenido cambia según la vista seleccionada en el menú (ver 3.2–3.8).

### 3.2 Vista "Inicio" (vista inicial, título: "Buenos días, Laura")

- **Fila de 4 tarjetas KPI**, cada una con etiqueta, valor grande, subtítulo y barra de progreso:
  1. Ocupación — **42 / 48** — "88 % de camas ocupadas · 2 ingresos en proceso" — barra 88%
  2. Medicación del turno — **{administradas} / {programadas}** — "{retrasadas} retrasadas" o "Ronda al día"
  3. Alertas activas — **{número de alertas}** — "1 incidente · signos fuera de rango" — barra en rojo
  4. Por cobrar (noviembre) — **monto pendiente** — "1 cuenta vencida" — barra en naranja
- **Columna izquierda (más ancha): "Alertas que requieren atención"** (con leyenda "Actualizado hace 2 min"), tarjetas de alerta con etiqueta de color, título, detalle y botón de acción:
  1. Etiqueta **Incidente** — "Roberto Hernández · caída nocturna" — "23:40 en baño de 104-A. Contusión leve, febrícula 37.8 °C. Rx de cadera solicitada." — botón "Ver ficha" (abre la ficha de Roberto)
  2. Etiqueta **Signos** — "Carmen Ruiz · presión arterial 165/95" — "Fuera de rango en la toma de las 07:00. Nueva toma indicada a las 10:00." — botón "Ver ficha" (abre la ficha de Carmen)
  3. Etiqueta **Medicación** (solo aparece si hay dosis retrasadas) — "{n} dosis retrasadas en la ronda de 08:00" — "Pendientes de registrar en el eMAR del turno matutino." — botón "Ir a la ronda" (va a Medicación)
- **Columna derecha:**
  - **"Agenda de hoy":** 10:00 Fisioterapia grupal (Sala de usos múltiples · 8 residentes); 11:30 Visita médica · Dra. Morales (Valoración de 4 residentes); 13:00 Comida (3 dietas especiales · 2 consistencias blandas); 17:00 Visita familiar (Familia Ruiz · Carmen Ruiz, 103-A).
  - **"Acciones rápidas":** 4 botones en cuadrícula 2×2 — "Registrar signos" (va a Enfermería), "Ronda de medicación" (va a Medicación), "Reportar incidente", "Nuevo ingreso".

### 3.3 Vista "Residentes"

- Fila de **filtros tipo pill** (toggle, uno activo a la vez): Todos · Atención · Vigilancia · Estables.
- Botón "+ Nuevo residente" a la derecha.
- **Tabla** con columnas: Residente (avatar de iniciales + nombre + edad + fecha de ingreso) · Habitación · Dependencia (Barthel) · Alergias · Estado (pill de color) · acción "Ver ficha".
- Los 6 residentes de muestra (ver tabla completa en la sección 5) se listan y filtran por su estado (`ok`/`warn`/`bad`).

### 3.4 Vista "Ficha del residente" (detalle)

- Botón "← Volver a residentes".
- **Tarjeta de encabezado:** avatar grande de iniciales, nombre, pill de estado, línea "{edad} años · Habitación {room} · Ingreso {fecha} · Expediente RES-{número}"; botones "Reportar incidente" y "Nueva evolución".
- **Cuadrícula de 3 tarjetas:**
  1. "Datos y contacto": Responsable, Teléfono de emergencia (parcialmente oculto, ej. "55 •••• 7734"), Dieta, Documentos ("Consentimiento informado · Contrato de servicios · Identificación").
  2. "Alergias y diagnósticos": caja roja "ALERGIAS" con el alérgeno, y lista de diagnósticos activos.
  3. "Escalas de valoración": Barthel (AVD), Norton y Tinetti, cada uno con su puntaje grande y una interpretación de riesgo coloreada (p. ej. "Riesgo alto de caída", "Riesgo medio de úlceras", "Dependencia severa"); nota "Última valoración: 2 nov 2026".
- **Dos tarjetas inferiores:**
  1. "Medicación activa": lista de medicamentos del residente con dosis, vía y hora.
  2. "Última evolución médica": nota clínica en texto libre, y una línea de verificación con icono de check: "Firmada por Dra. Ana Morales · Céd. Prof. ••••••• · 8 nov 2026, 11:20 · Registro inmutable".

### 3.5 Vista "Medicación (eMAR)"

- Tarjeta superior: "Ronda del turno matutino · {administradas} de {programadas} administradas" con barra de progreso, y nota "Cada registro guarda hora, usuario y firma. El inventario se descuenta automáticamente."
- **Tabla eMAR**, columnas: Hora · Residente (+ habitación + alergia) · Medicamento · Dosis y vía · Estado (pill: Programada/Administrada/Retrasada/Según necesidad) · Registro:
  - Si aún no se da: botón **"Administrar"** (al presionarlo, registra la hora actual y el nombre de la enfermera).
  - Si ya se dio: texto con la hora registrada + "· L. Pérez".
  - Si es PRN ("según necesidad"): botón "Registrar toma".
- Al pie, aviso ámbar de **inventario bajo**: "Metformina 850 mg: quedan 5 dosis (2.5 días). Se generó solicitud de reposición a la familia de María Elena Torres."

### 3.6 Vista "Enfermería"

- **Tabla de signos vitales** (toma de las 07:00): Residente · Presión · FC · Temp. · Glucosa · SpO₂, con los valores fuera de rango resaltados en negrita y color de advertencia (presión sistólica ≥160 = alerta roja, ≥135 = ámbar; temperatura ≥37.5 °C = ámbar; glucosa ≥180 = ámbar).
- **Formulario "Registrar signos vitales":** selector de residente (lista desplegable), campos Presión arterial / Frec. cardiaca / Temperatura / Glucosa, textarea "Nota de turno" (placeholder: "Observaciones, ingesta, ánimo, sueño…"), botón "Guardar registro".

### 3.7 Vista "Facturación"

- 3 tarjetas KPI: Facturado noviembre · Cobrado (verde) · Por cobrar (rojo).
- **Tabla:** Residente · Concepto ("Mensualidad nov 2026") · Importe · Saldo · Estado de pago (pill: Pagado/Pendiente/Vencido) · CFDI 4.0 (si ya está timbrado: "Timbrado · PDF y XML"; si no: botón "Emitir CFDI", que al presionarlo marca la factura como timbrada).

### 3.8 Módulos "por prototipar" (patrón reutilizable)

Para las 4 secciones de "Gestión" que aún no están desarrolladas a detalle, se usa una tarjeta con borde punteado, una insignia azul "Módulo por prototipar", un párrafo de descripción y una lista de funciones previstas:

- **Personal y turnos** — "Programación de turnos rotativos del personal de enfermería, cuidadores, cocina y limpieza, con control de asistencia." — Calendario de turnos y coberturas · Registro de entrada y salida con geolocalización · Notas de entrega de turno · Cédulas, certificaciones y vencimientos.
- **Inventario** — "Control de medicamentos e insumos, incluido lo que aporta cada familia, con descuento automático desde el eMAR." — Existencias por residente y por almacén general · Alertas de stock bajo y caducidades · Solicitudes de reposición a familias · Control de medicamentos controlados.
- **Cocina y dietas** — "Menús y dietas especiales visibles para cocina, con alergias y restricciones de cada residente." — Menú semanal y dietas por residente · Consistencias (blanda, picada, licuada) · Registro de ingesta por comida · Lista de compras.
- **Reportes e inspecciones** — "Indicadores de calidad y documentación lista para inspecciones conforme a la NOM-031-SSA3-2012." — Ocupación, caídas, úlceras e incidentes por mes · Expediente exportable en PDF · Bitácora de auditoría (quién, qué, cuándo) · Reportes financieros.

### 3.9 Interactividad y props configurables

- El menú lateral cambia la vista activa (estado de componente, no recarga de página).
- Los filtros de "Residentes" cambian la lista mostrada.
- "Ver ficha" abre el detalle del residente seleccionado; "← Volver a residentes" regresa a la tabla.
- En "Medicación", presionar "Administrar" marca la dosis como dada (hora actual + enfermera), actualiza el contador de la ronda y la insignia del menú.
- En "Facturación", "Emitir CFDI" marca la factura como timbrada.
- **Props del componente** (pensados como ajustes del prototipo, no de la app real): color de acento (editor de color; opciones verde/azul/morado/naranja) y vista inicial (enum: inicio/residentes/ficha/medicacion/enfermeria/facturacion).

## 4. Lienzo 2 — "Portal familiar (móvil)" (390 × 844)

### 4.1 Encabezado (fondo `#12322F`, texto blanco)

- Línea superior: "Hola, Patricia" (izquierda) y "Alba" (derecha, bold).
- Debajo: avatar de iniciales "CR", nombre del residente "Carmen Ruiz" (grande, bold), subtítulo "Residencia Los Álamos · Hab. 103-A".

### 4.2 Navegación inferior (4 pestañas)

**Hoy** · **Mensajes** · **Pagos** · **Visitas** — la pestaña activa se marca con una barra verde y texto en negrita.

### 4.3 Pestaña "Hoy" (vista inicial)

- **"Su día de hoy"** (con fecha "Lun 9 nov"): línea de tiempo con punto de color + título + detalle:
  - Desayunó completo — 08:30 · Avena, fruta y té (punto verde)
  - Medicamentos de la mañana — Administrados a las 08:10 (punto verde)
  - Taller de pintura — 10:00 · Sala de usos múltiples (punto azul `#2F5DA8`)
  - Revisión médica — 11:30 · Dra. Ana Morales (punto naranja `#B4541A`)
- **Aviso ámbar del equipo de enfermería:** "Su presión arterial salió un poco alta esta mañana. La estamos vigilando y la doctora la revisará a las 11:30."
- **"Fotos de la semana":** cuadrícula de 3 placeholders — [Foto taller de pintura] · [Foto jardín] · [Foto cumpleaños].

### 4.4 Pestaña "Mensajes"

- Burbujas de chat (equipo a la izquierda en blanco, familiar a la derecha en verde oscuro con texto blanco), cada una con remitente + hora:
  1. Enf. Laura Pérez, 09:15 (izq.): "Buenos días. Carmen durmió bien y desayunó completo. Le avisamos después de la revisión médica."
  2. Tú, 09:20 (der.): "Gracias. ¿Necesita que le llevemos algo hoy en la visita?"
  3. Enf. Laura Pérez, 09:24 (izq.): "Si pueden, crema hidratante y un suéter ligero. Todo lo demás está cubierto."
- Campo de texto "Escribe un mensaje al equipo…" + botón "Enviar".

### 4.5 Pestaña "Pagos"

- Tarjeta de saldo: "Saldo de noviembre" — **$31,500 MXN** — "Vence el 10 de noviembre" — botón "Pagar con transferencia SPEI".
- **"Historial y facturas"** (cada fila "Pagado · CFDI PDF y XML" + monto):
  - Octubre 2026 — $31,500
  - Septiembre 2026 — $31,500
  - Agosto 2026 — $30,000

### 4.6 Pestaña "Visitas"

- **"Agendar visita"** — "Elige un horario disponible para el martes 10 de noviembre" — cuadrícula de 6 botones de horario: 10:00, 11:00, 12:00 (seleccionado por defecto, fondo oscuro), 16:00, 17:00, 18:00; botón "Confirmar visita a las {hora seleccionada}".
- **"Próxima visita confirmada":** "Hoy, 17:00 · Patricia y Daniel Ruiz".

## 5. Datos de muestra (para reutilizar tal cual)

### 5.1 Residentes

| Nombre | Edad | Hab. | Ingreso | Exp. | Estado | Barthel | Norton | Tinetti | Alergias | Diagnósticos | Contacto | Tel (4 últimos) | Dieta |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| María Elena Torres Vega | 84 | 101-A | mar 2024 | 0142 | Estable | 55 | 15 | 20 | Penicilina | Hipertensión arterial · Diabetes mellitus tipo 2 | Laura Torres (hija) | 2291 | Diabética, baja en sodio |
| José Luis Ramírez Ortiz | 79 | 102-B | ago 2025 | 0167 | Estable | 80 | 18 | 24 | Ninguna conocida | EPOC leve · Artrosis de rodilla | Jorge Ramírez (hijo) | 5810 | Normal |
| Carmen Ruiz Delgado | 91 | 103-A | ene 2023 | 0098 | Vigilancia | 30 | 11 | 12 | Sulfonamidas | Demencia tipo Alzheimer (moderada) · Hipertensión arterial · Insuficiencia cardiaca | Patricia Ruiz (hija) | 7734 | Hiposódica, consistencia blanda |
| Roberto Hernández Campos | 87 | 104-A | jun 2024 | 0151 | Atención | 45 | 13 | 10 | Ibuprofeno | Enfermedad de Parkinson · Osteoporosis | Silvia Campos (esposa) | 4406 | Normal, alta en fibra |
| Guadalupe Soto Márquez | 82 | 105-B | nov 2025 | 0173 | Estable | 70 | 17 | 21 | Ninguna conocida | Hipotiroidismo · Cataratas bilaterales | Ricardo Soto (sobrino) | 9015 | Normal |
| Antonio Medina Flores | 76 | 106-A | abr 2026 | 0188 | Estable | 90 | 19 | 26 | Látex | Secuelas de EVC leve · Hipertensión arterial | Elena Medina (hija) | 3362 | Baja en sodio |

Notas de evolución (una por residente, para la ficha): Torres Vega — "Paciente estable, glucosa matutina elevada (182 mg/dL). Se ajusta horario de colación y se solicita control capilar preprandial por 3 días."; Ramírez Ortiz — "Sin disnea en reposo. Saturación estable. Continúa con fisioterapia de rodilla dos veces por semana."; Ruiz Delgado — "Presenta TA 165/95 en toma matutina, sin datos de alarma neurológica. Se indica nueva toma en 2 h y vigilancia de edema. Cambios posturales cada 2 h por riesgo de úlceras."; Hernández Campos — "Caída desde su propia altura a las 23:40 al ir al baño. Contusión leve en cadera izquierda, sin deformidad. Febrícula 37.8 °C. Se solicita Rx de cadera y vigilancia nocturna."; Soto Márquez — "Buen estado general. Participa en actividades recreativas. Pendiente valoración oftalmológica programada."; Medina Flores — "Mejoría en marcha con andadera. Tensión arterial en metas. Continúa rehabilitación."

### 5.2 Medicación programada (eMAR)

| Residente | Medicamento | Dosis | Vía | Hora | Ya administrada al cargar |
|---|---|---|---|---|---|
| Guadalupe Soto Márquez | Levotiroxina 100 mcg | 1 tableta | Oral | 07:00 | Sí, 07:02 |
| María Elena Torres Vega | Metformina 850 mg | 1 tableta | Oral | 08:00 | Sí, 07:58 |
| María Elena Torres Vega | Losartán 50 mg | 1 tableta | Oral | 08:00 | Sí, 07:58 |
| José Luis Ramírez Ortiz | Salbutamol 100 mcg | 2 disparos | Inhalada | 08:00 | Sí, 08:03 |
| Carmen Ruiz Delgado | Donepezilo 10 mg | 1 tableta | Oral | 08:00 | No (pendiente) |
| Carmen Ruiz Delgado | Furosemida 40 mg | 1 tableta | Oral | 08:00 | Sí, 08:10 |
| Roberto Hernández Campos | Levodopa/Carbidopa 250/25 mg | 1 tableta | Oral | 10:00 | No (programada) |
| Antonio Medina Flores | Losartán 50 mg | 1 tableta | Oral | 10:00 | No (programada) |
| Roberto Hernández Campos | Paracetamol 500 mg | 1 tableta | Oral | PRN (según necesidad) | — |

### 5.3 Facturación (noviembre 2026)

| Residente | Importe | Pagado | Estado | CFDI |
|---|---|---|---|---|
| María Elena Torres Vega | $26,500 | $26,500 | Pagado | Timbrado |
| José Luis Ramírez Ortiz | $24,000 | $24,000 | Pagado | Timbrado |
| Carmen Ruiz Delgado | $31,500 | $0 | Pendiente · Vence 10 nov | Por emitir |
| Roberto Hernández Campos | $29,000 | $12,000 | Vencido · pago parcial | Por emitir |
| Guadalupe Soto Márquez | $24,000 | $24,000 | Pagado | Timbrado |
| Antonio Medina Flores | $22,500 | $0 | Pendiente · Vence 15 nov | Por emitir |

### 5.4 Signos vitales (toma 07:00)

| Residente | Presión | FC | Temp. | Glucosa | SpO₂ |
|---|---|---|---|---|---|
| María Elena Torres Vega | 132/84 | 76 | 36.5 °C | 182 mg/dL (fuera de rango) | 96% |
| José Luis Ramírez Ortiz | 128/80 | 72 | 36.7 °C | 98 mg/dL | 94% |
| Carmen Ruiz Delgado | 165/95 (fuera de rango) | 88 | 36.9 °C | 110 mg/dL | 95% |
| Roberto Hernández Campos | 118/74 | 81 | 37.8 °C (fuera de rango) | 104 mg/dL | 97% |
| Guadalupe Soto Márquez | 124/78 | 68 | 36.4 °C | 92 mg/dL | 98% |
| Antonio Medina Flores | 138/86 (fuera de rango) | 70 | 36.6 °C | 101 mg/dL | 97% |

## 6. Prompt sugerido para pegar junto con este archivo

> "Crea un prototipo de Claude Design con dos lienzos interactivos siguiendo exactamente los lineamientos de este archivo: (1) un panel web para el personal de una residencia geriátrica ('Alba'), con navegación lateral y las vistas Inicio, Residentes, Ficha del residente, Medicación (eMAR), Enfermería y Facturación, más un patrón de 'módulo por prototipar' para Personal y turnos, Inventario, Cocina y dietas y Reportes e inspecciones; (2) un portal familiar móvil con las pestañas Hoy, Mensajes, Pagos y Visitas. Usa los textos, datos de ejemplo y colores tal como se especifican, y conserva la interactividad descrita (cambiar de vista, filtrar residentes, administrar medicamentos, emitir CFDI, elegir horario de visita)."

## 7. Apéndice — código fuente original (referencia para máxima fidelidad)

Si quien recibe este archivo puede trabajar directamente con el código fuente del lienzo (formato `.dc.html` de Claude Design), aquí están los archivos originales íntegros como referencia exacta. Úsalos para verificar textos, estilos en línea y lógica de estado si algo no queda claro en la descripción anterior; no es necesario pegarlos literalmente si se sigue la guía de arriba.

- `project/canvas.json` (metadatos del lienzo, posición de los artboards)
- `project/Main.dc.html` (panel de la residencia — ~43 KB)
- `project/PortalFamiliar.dc.html` (portal familiar — ~11 KB)

Estos tres archivos se guardaron también por separado junto a este documento para facilitar compartirlos.
