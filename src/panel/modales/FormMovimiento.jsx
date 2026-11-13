import { useState } from 'react'
import Modal from './Modal.jsx'
import { Campo, Selector, Rejilla } from './Campos.jsx'

const S = {
  error: { fontSize: 13, fontWeight: 600, color: '#B42318' },
  pista: { fontSize: 13, color: '#5B6675', lineHeight: 1.5 }
}

/**
 * Salida o entrada de un medicamento controlado. La doble firma no es adorno:
 * un controlado no se saca del resguardo sin testigo, y el formulario no deja
 * poner a la misma persona en los dos campos.
 */
export default function FormMovimiento({ accent, controlados, personal, saldoDe, onCerrar, onGuardar }) {
  const [kid, setKid] = useState(controlados[0].id)
  const [tipo, setTipo] = useState('Salida')
  const [cantidad, setCantidad] = useState('1')
  const [responsable, setResponsable] = useState('Laura Pérez Mendoza')
  const [testigo, setTestigo] = useState('Norma Jiménez Castro')
  const [folio, setFolio] = useState('')
  const [error, setError] = useState('')

  const k = controlados.find((x) => x.id === kid)
  const saldo = saldoDe(kid)
  const gente = personal.map((p) => [p.name, `${p.name} · ${p.rol}`])

  const guardar = () => {
    const n = Number(cantidad)
    if (!n || n < 1) return setError('Escribe cuántas unidades se mueven.')
    if (responsable === testigo) return setError('El testigo tiene que ser otra persona distinta de quien registra.')
    if (tipo === 'Salida' && n > saldo) {
      return setError(`No puedes sacar ${n}: el libro solo tiene ${saldo} ${k.unidad}.`)
    }
    if (!folio.trim()) return setError('Falta el folio de la receta especial.')
    onGuardar({ kid, tipo, cantidad: n, responsable, testigo, folio: folio.trim() })
  }

  return (
    <Modal
      titulo="Registrar movimiento de controlado"
      descripcion="Queda en el libro de control con la hora, las dos firmas y el folio de la receta. No se puede editar después."
      accent={accent}
      textoGuardar="Firmar y registrar"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Selector etiqueta="Medicamento" valor={kid} alCambiar={(v) => { setKid(v); setError('') }}
        opciones={controlados.map((x) => [x.id, `${x.nombre} · ${x.grupo}`])} />

      <span style={S.pista}>
        El libro marca {saldo} {k.unidad}. {k.indicacion}
      </span>

      <Rejilla>
        <Selector etiqueta="Tipo" valor={tipo} alCambiar={(v) => { setTipo(v); setError('') }}
          opciones={[['Salida', 'Salida (se administra)'], ['Entrada', 'Entrada (llega al resguardo)']]} />
        <Campo etiqueta={`Cantidad (${k.unidad})`} valor={cantidad}
          alCambiar={(v) => { setCantidad(v); setError('') }}
          type="number" min="1" inputMode="numeric" required />
      </Rejilla>

      <Rejilla>
        <Selector etiqueta="Quién registra" valor={responsable} alCambiar={(v) => { setResponsable(v); setError('') }} opciones={gente} />
        <Selector etiqueta="Testigo" valor={testigo} alCambiar={(v) => { setTestigo(v); setError('') }} opciones={gente} />
      </Rejilla>

      <Campo etiqueta="Folio de la receta especial" valor={folio} alCambiar={(v) => { setFolio(v); setError('') }}
        placeholder="Receta especial 1182-B" required />

      {error && <span style={S.error}>{error}</span>}
    </Modal>
  )
}
