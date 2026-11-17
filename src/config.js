// Props configurables del prototipo original (data-props de Main.dc.html).
// En la web real son configuración fija: cámbialos aquí.

/*
 * Paleta de Casa Los Olivos, sacada del logo: verde oliva oscuro de fondo,
 * dorado cálido en el trazo y crema en el texto.
 *
 * El acento es el oliva medio y no el dorado a propósito. El dorado del logo
 * (#C9A86A) sobre texto blanco da 2.2:1 de contraste, muy por debajo del
 * mínimo legible; se usa como color decorativo —el ícono de la marca, los
 * filetes— y nunca como fondo de un texto. Para botones manda el oliva, que
 * con blanco encima da 5.9:1.
 */
export const ACCENT = '#5A6B32'
export const ACCENT_OPTIONS = ['#5A6B32', '#3C5578', '#6B4F96', '#9A5B1C']

/** Verde del logo: barra lateral, superficies oscuras y píldoras activas. */
export const VERDE = '#3A4523'

/** Dorado del logo. Decorativo: nunca lleva texto blanco encima. */
export const DORADO = '#C9A86A'

/** El mismo dorado, oscurecido hasta poder usarse como texto sobre claro. */
export const DORADO_TEXTO = '#8A6B2A'

export const MARCA = 'Casa Los Olivos'
export const LEMA = 'Bienestar en cada etapa'

// inicio | residentes | ficha | medicacion | enfermeria | facturacion
export const START_VIEW = 'inicio'
