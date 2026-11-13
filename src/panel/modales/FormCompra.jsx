import { useState } from 'react'
import Modal from './Modal.jsx'
import { Campo, Selector, Rejilla } from './Campos.jsx'
import { CATEGORIAS_COMPRA } from '../../data/cocina.js'

export default function FormCompra({ accent, onCerrar, onGuardar }) {
  const [articulo, setArticulo] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS_COMPRA[0])
  const [motivo, setMotivo] = useState('')

  const guardar = () => {
    if (!articulo.trim() || !cantidad.trim()) return
    onGuardar({ articulo: articulo.trim(), cantidad: cantidad.trim(), categoria, motivo: motivo.trim() || 'Añadido a mano' })
  }

  return (
    <Modal
      titulo="Añadir a la lista de compras"
      descripcion="Para lo que no sale del menú: reposiciones, peticiones de un residente o lo que se acabó antes de tiempo."
      accent={accent}
      textoGuardar="Añadir"
      onCerrar={onCerrar}
      onGuardar={guardar}
    >
      <Campo etiqueta="Artículo" valor={articulo} alCambiar={setArticulo} placeholder="Pechuga de pollo" required />
      <Rejilla>
        <Campo etiqueta="Cantidad" valor={cantidad} alCambiar={setCantidad} placeholder="3 kg" required />
        <Selector etiqueta="Categoría" valor={categoria} alCambiar={setCategoria}
          opciones={CATEGORIAS_COMPRA.map((c) => [c, c])} />
      </Rejilla>
      <Campo etiqueta="Para qué" valor={motivo} alCambiar={setMotivo} placeholder="Comida del jueves · dieta hiposódica" />
    </Modal>
  )
}
