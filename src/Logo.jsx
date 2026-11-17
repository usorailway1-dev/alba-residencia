import { CASA, TALLO, HOJAS, ACEITUNAS, RABILLOS } from './marca.js'

/**
 * El isotipo de Casa Los Olivos. `trazo` pinta la casa y la rama; `relleno`
 * las hojas y las aceitunas. En la barra lateral los dos van en dorado sobre
 * el verde; en el portal familiar, al revés.
 */
export default function Logo({ tamano = 32, trazo = '#C9A86A', relleno = '#C9A86A', grosor = 1.7 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 32 32" fill="none"
      stroke={trazo} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false">
      <path d={CASA} />
      <path d={TALLO} />
      {RABILLOS.map((d) => <path key={d} d={d} />)}
      {HOJAS.map((d) => (
        <path key={d} d={d} fill={relleno} stroke={relleno} strokeWidth={0.7} />
      ))}
      {ACEITUNAS.map((o) => (
        <circle key={`${o.cx}-${o.cy}`} cx={o.cx} cy={o.cy} r={o.r} fill={relleno} stroke="none" />
      ))}
    </svg>
  )
}
