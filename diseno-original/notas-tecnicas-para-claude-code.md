# Notas técnicas — convertir el prototipo "Alba" en una web real

Estas notas son para quien vaya a programar (Claude Code u otro desarrollador). Explican qué son los archivos `.dc.html` adjuntos y cómo leerlos, porque **no son HTML/JS estándar**: son el formato interno del lienzo de diseño de Claude ("Design Canvas"), pensado para prototipado visual, no para producción. Hay que traducirlos a una web normal (HTML/CSS/JS plano, o React/Vue si así se prefiere), conservando el marcado, los estilos en línea y los textos tal cual.

## Archivos incluidos

- `fuente-original/canvas.json` — metadatos del lienzo (solo referencia, no se usa en la web final).
- `fuente-original/Main.dc.html` — el **panel web para el personal** de la residencia (vista de escritorio).
- `fuente-original/PortalFamiliar.dc.html` — el **portal para familiares** (vista móvil).
- `lineamientos-prototipo-alba.md` — descripción en prosa de cada pantalla, textos y datos de ejemplo exactos; útil como referencia cruzada si algo no queda claro en el código.

Lo ideal es construir **dos pantallas/rutas de una misma web** (o dos apps si se prefiere separarlas): el panel de escritorio y el portal móvil, con la navegación interna descrita abajo.

## Cómo leer la sintaxis de los `.dc.html`

Cada archivo tiene esta forma:

```html
<x-dc>
  <helmet> ... </helmet>      <!-- esto va al <head>: fuentes, estilos globales -->
  <div> ... marcado ... </div> <!-- esto es el cuerpo visual, en HTML normal con estilos inline -->
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{...}'>
class Component extends DCLogic {
  state = { ... };            // estado inicial
  renderVals() {
    // lógica y datos de ejemplo
    return { ...valores usados en el marcado de arriba... };
  }
}
</script>
```

Tradúcelo así:

| En el `.dc.html` | Equivale a |
|---|---|
| `<helmet>...</helmet>` | Contenido para el `<head>` del HTML real (fuentes de Google Fonts, `<style>` globales). |
| El `<div>` dentro de `<x-dc>` | El marcado visual real. Son estilos **inline** (`style="..."`) — se pueden dejar igual o migrarse a una hoja de estilos/CSS-in-JS, pero los valores de color, tamaño y espaciado deben quedar idénticos. |
| `{{expresion}}` | Interpolación de una variable (como `${expresion}` en JS o `{expresion}` en JSX). El valor viene de lo que retorna `renderVals()`. |
| `<sc-if value="{{cond}}">...</sc-if>` | Renderizado condicional normal: si `cond` es verdadero, se muestra ese bloque (equivalente a `{cond && (...)}` en JSX, o un `if` en JS/vanilla). |
| `<sc-for list="{{arr}}" as="item">...</sc-for>` | Un `.map()` / bucle normal sobre `arr`, repitiendo el bloque interno por cada `item`. |
| `onClick="{{fn}}"` | Un manejador de clic normal; `fn` es una función definida en `renderVals()` (casi siempre llama a `this.setState({...})`). |
| `class Component extends DCLogic { state = {...}; renderVals() {...} }` | El **componente con estado** de cada pantalla. `state` es el estado inicial (p. ej. qué vista está activa, qué residente está seleccionado); `renderVals()` recalcula todos los datos derivados y las funciones de evento cada vez que cambia el estado — es, en esencia, ya un componente de React o un store reactivo casi listo para portar tal cual. |
| `data-props='{...}'` en la etiqueta `<script>` | Props configurables del prototipo (p. ej. color de acento, vista inicial). En la web real pueden volverse configuración fija, variables de entorno, o simplemente quedar como los valores por defecto. |
| `<script src="./support.js"></script>` | Runtime propio del editor de diseño (no se incluye ni se necesita). Ignorar/eliminar: en la web real el "runtime" es simplemente el framework que se elija (vanilla JS, React, Vue, etc.). |

En resumen: cada archivo ya trae, en `renderVals()`, el modelo de datos completo (listas de residentes, medicamentos, facturas, mensajes, etc.) y toda la lógica de interacción (cambiar de vista, filtrar, marcar medicamento administrado, emitir CFDI, elegir horario de visita). Es básicamately un componente con estado ya escrito; el trabajo real es:

1. Sustituir `<x-dc>`, `sc-if`, `sc-for` y `{{...}}` por el mecanismo de plantillas/renderizado real del stack elegido.
2. Convertir `class Component extends DCLogic` en un componente de verdad (p. ej. un componente de React con `useState`, o una clase/función equivalente en vanilla JS).
3. Quitar la dependencia de `./support.js` y envolver cada archivo en un documento HTML completo propio (doctype, head, body) si se construye como HTML/CSS/JS plano.
4. Conservar literalmente los textos, colores y datos de ejemplo — son los mismos que están descritos en `lineamientos-prototipo-alba.md`.

## Resumen funcional rápido (para dar contexto a Claude Code)

- **Main.dc.html** → panel de escritorio con barra lateral de navegación y 6 vistas (Inicio, Residentes, Ficha del residente, Medicación/eMAR, Enfermería, Facturación) más un patrón de "módulo por prototipar" para 4 secciones de gestión aún no desarrolladas.
- **PortalFamiliar.dc.html** → vista móvil de 390×844 con 4 pestañas (Hoy, Mensajes, Pagos, Visitas) para un familiar de un residente.
- Ambas son SPA de una sola página con estado en memoria (sin backend, sin persistencia real) — ideal para convertir primero en un front-end estático/interactivo, y después conectar a datos reales si se desea.
