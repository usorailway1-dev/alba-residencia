/*
 * "Expediente exportable en PDF", sin librerías ni backend: se arma un
 * documento aparte y se manda al diálogo de impresión del navegador, donde
 * "Guardar como PDF" es una opción estándar en Chrome, Edge y Safari.
 *
 * Va en un iframe oculto y no en una ventana nueva porque window.open() lo
 * bloquean los navegadores, y porque así la app no pierde su estado.
 */

const CSS = `
  @page { size: letter; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Figtree, system-ui, -apple-system, sans-serif; color: #1B2430; font-size: 11pt; line-height: 1.45; }
  .marca { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
           border-bottom: 2px solid #12322F; padding-bottom: 10px; margin-bottom: 18px; }
  .marca h1 { margin: 0; font-size: 17pt; }
  .marca p { margin: 2px 0 0; font-size: 10pt; color: #5B6675; }
  .sello { text-align: right; font-size: 9pt; color: #5B6675; white-space: nowrap; }
  h2 { font-size: 12pt; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #DCE1E7; }
  table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  th { text-align: left; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .04em;
       color: #5B6675; padding: 6px 8px; border-bottom: 1px solid #DCE1E7; background: #F8FAFB; }
  td { padding: 6px 8px; border-bottom: 1px solid #EEF1F4; vertical-align: top; }
  .datos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 18px; }
  .dato span { display: block; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .04em; color: #5B6675; }
  .dato strong { font-weight: 600; }
  .nota { background: #F3F5F7; border-left: 3px solid #0E7C6B; padding: 10px 12px; border-radius: 0 6px 6px 0; }
  .firma { margin-top: 6px; font-size: 9pt; color: #5B6675; }
  .mal { color: #B42318; font-weight: 600; }
  .ojo { color: #8A5300; font-weight: 600; }
  .bien { color: #0B6B5C; }
  .pie { margin-top: 26px; padding-top: 8px; border-top: 1px solid #DCE1E7; font-size: 8.5pt; color: #5B6675; }
  tr { break-inside: avoid; }
  h2 { break-after: avoid; }
`

/** Todo lo que entra viene de datos capturados: hay que escaparlo. */
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
))

const encabezado = (titulo, subtitulo, sello) => `
  <div class="marca">
    <div>
      <h1>${esc(titulo)}</h1>
      <p>${esc(subtitulo)}</p>
    </div>
    <div class="sello">
      <strong>Residencia Los Álamos</strong><br>
      ${esc(sello)}
    </div>
  </div>`

const pie = (quien, cuando) => `
  <div class="pie">
    Documento generado por Alba el ${esc(cuando)} · ${esc(quien)}.<br>
    Datos de prueba de un prototipo. No constituye un documento oficial.
  </div>`

/**
 * Crea el documento y lo manda a imprimir. El print va en un `setTimeout`
 * corto a propósito: escribir y llamar a print() en el mismo tick imprime la
 * hoja en blanco en varios navegadores, porque no ha maquetado todavía.
 */
export function imprimir(titulo, cuerpo) {
  const marco = document.createElement('iframe')
  marco.title = titulo
  marco.setAttribute('aria-hidden', 'true')
  marco.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;opacity:0;border:0'
  document.body.appendChild(marco)

  const doc = marco.contentDocument
  doc.open()
  doc.write(`<!doctype html><html lang="es"><head><meta charset="utf-8">` +
    `<title>${esc(titulo)}</title><style>${CSS}</style></head><body>${cuerpo}</body></html>`)
  doc.close()

  setTimeout(() => {
    if (!marco.isConnected) return
    marco.contentWindow.focus()
    marco.contentWindow.print()
    marco.remove()
  }, 150)
}

const filaDato = (etiqueta, valor) => `<div class="dato"><span>${esc(etiqueta)}</span><strong>${esc(valor)}</strong></div>`

/** Expediente completo de un residente. */
export function htmlExpediente(x) {
  return encabezado(
    x.residente.name,
    `Expediente ${x.residente.exp} · Habitación ${x.residente.room} · Ingreso ${x.residente.ingreso}`,
    x.sello
  ) + `
  <h2>Datos del residente</h2>
  <div class="datos">
    ${filaDato('Edad', `${x.residente.age} años`)}
    ${filaDato('Estado', x.residente.estado || 'Estable')}
    ${filaDato('Familiar responsable', x.residente.contacto)}
    ${filaDato('Teléfono', `ext. ${x.residente.tel}`)}
    ${filaDato('Alergias a medicamentos', x.residente.alergias)}
    ${filaDato('Dieta indicada', x.dieta)}
  </div>

  <h2>Diagnósticos</h2>
  <p style="margin:0">${esc(x.residente.dx)}</p>

  <h2>Valoración geriátrica</h2>
  <table>
    <thead><tr><th>Escala</th><th>Puntaje</th><th>Interpretación</th></tr></thead>
    <tbody>${x.escalas.map((e) => `
      <tr><td>${esc(e.name)}</td><td>${esc(e.score)}</td><td>${esc(e.interp)}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>Medicación vigente</h2>
  ${x.meds.length === 0 ? '<p style="margin:0">Sin medicación registrada.</p>' : `
  <table>
    <thead><tr><th>Medicamento</th><th>Dosis</th><th>Vía</th><th>Horario</th></tr></thead>
    <tbody>${x.meds.map((m) => `
      <tr><td>${esc(m.med)}</td><td>${esc(m.dose)}</td><td>${esc(m.via)}</td><td>${esc(m.time)}</td></tr>`).join('')}
    </tbody>
  </table>`}

  <h2>Última nota de evolución</h2>
  <div class="nota">${esc(x.nota)}</div>
  <p class="firma">${esc(x.firma)}</p>

  <h2>Documentos del expediente</h2>
  <table>
    <thead><tr><th>Documento</th><th>Fecha</th><th>Vigencia</th><th>Estado</th></tr></thead>
    <tbody>${x.documentos.map((d) => `
      <tr>
        <td>${esc(d.nombre)}${d.obligatorio ? '' : ' <em>(opcional)</em>'}</td>
        <td>${esc(d.fechaTexto)}</td>
        <td>${esc(d.venceTexto)}</td>
        <td class="${d.clase}">${esc(d.estado)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  ` + pie(x.quien, x.cuando)
}

/** Carátula que se le entrega a quien llega a inspeccionar. */
export function htmlCaratula(x) {
  return encabezado(
    'Carátula de inspección',
    `Corte al ${x.corte} · NOM-031-SSA3-2012`,
    x.sello
  ) + `
  <h2>Indicadores del mes en curso</h2>
  <table>
    <thead><tr><th>Indicador</th><th>Noviembre 2026</th><th>Octubre 2026</th><th>Comparable</th></tr></thead>
    <tbody>${x.indicadores.map((i) => `
      <tr>
        <td>${esc(i.titulo)}</td>
        <td><strong>${esc(i.valorTexto)}</strong></td>
        <td>${esc(i.previoTexto)}</td>
        <td>${esc(i.tasaTexto)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  <p style="font-size:9.5pt;color:#5B6675;margin:8px 0 0">
    Noviembre lleva ${esc(x.transcurridos)} de ${esc(x.diasMes)} días. Las cuentas del mes son parciales;
    la columna comparable está normalizada por días-residente.
  </p>

  <h2>Expedientes</h2>
  <table>
    <thead><tr><th>Residente</th><th>Habitación</th><th>Documentos</th><th>Pendientes</th></tr></thead>
    <tbody>${x.expedientes.map((e) => `
      <tr>
        <td>${esc(e.nombre)}</td>
        <td>${esc(e.habitacion)}</td>
        <td>${esc(e.entregados)} / ${esc(e.obligatorios)}</td>
        <td class="${e.clase}">${esc(e.resumen)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <h2>Personal y certificaciones</h2>
  <div class="datos">
    ${filaDato('Personal en plantilla', x.personal.total)}
    ${filaDato('En turno ahora', x.personal.dentro)}
    ${filaDato('Huecos de cobertura esta semana', x.personal.huecos)}
    ${filaDato('Certificaciones vencidas', x.personal.vencidas)}
    ${filaDato('Certificaciones por vencer', x.personal.porVencer)}
    ${filaDato('Descuadres de controlados', x.controlados)}
  </div>
  ` + pie(x.quien, x.cuando)
}

/** Bitácora de auditoría tal como se ve en pantalla, con el filtro aplicado. */
export function htmlBitacora(x) {
  return encabezado('Bitácora de auditoría', x.subtitulo, x.sello) + `
  <table>
    <thead><tr><th>Fecha y hora</th><th>Quién</th><th>Qué</th><th>Módulo</th></tr></thead>
    <tbody>${x.entradas.map((e) => `
      <tr>
        <td style="white-space:nowrap">${esc(e.fechaTexto)}<br>${esc(e.hora)}</td>
        <td>${esc(e.quien)}<br><span style="color:#5B6675">${esc(e.rol)}</span></td>
        <td><strong>${esc(e.accion)}</strong><br>${esc(e.detalle)}</td>
        <td>${esc(e.modulo)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  ` + pie(x.quien, x.cuando)
}
