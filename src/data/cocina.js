/*
 * Módulo "Cocina y dietas". Como los otros dos módulos desarrollados, esto no
 * viene del prototipo de Claude Design: ahí solo estaba la tarjeta punteada.
 *
 * Dos anclas del prototipo que estos datos respetan a propósito:
 *   · La agenda de Inicio dice "13:00 Comida · 3 dietas especiales · 2
 *     consistencias blandas". De aquí salen esos dos números.
 *   · El portal familiar dice que Carmen Ruiz "desayunó completo · 08:30 ·
 *     avena, fruta y té". De aquí sale ese desayuno y ese registro.
 *
 * Ojo con las alergias: el campo `alergias` de cada residente es de
 * MEDICAMENTOS (penicilina, sulfonamidas, ibuprofeno, látex). La cocina
 * necesita otra cosa, así que `evitar` es un campo nuevo.
 */

export const TIEMPOS = [
  { id: 'desayuno', nombre: 'Desayuno', hora: '08:30' },
  { id: 'colacion1', nombre: 'Colación', hora: '11:00' },
  { id: 'comida', nombre: 'Comida', hora: '13:00' },
  { id: 'colacion2', nombre: 'Colación', hora: '17:00' },
  { id: 'cena', nombre: 'Cena', hora: '19:30' }
]

export const CONSISTENCIAS = ['Normal', 'Blanda', 'Picada', 'Licuada']

/* Las claves de dieta son banderas, no categorías excluyentes: María Elena es
   diabética y además hiposódica. Por eso cada residente lleva una lista. */
export const DIETAS = {
  diabetica: { clave: 'diabetica', label: 'Diabética', corto: 'Sin azúcar' },
  hiposodica: { clave: 'hiposodica', label: 'Hiposódica', corto: 'Sin sal' },
  fibra: { clave: 'fibra', label: 'Alta en fibra', corto: 'Con fibra' }
}

export const ALERGENOS = {
  lactosa: { clave: 'lactosa', label: 'Lácteos' },
  mariscos: { clave: 'mariscos', label: 'Mariscos' }
}

export const NIVELES = [
  { id: 'completo', label: 'Completo', pct: 100, tono: 'ok' },
  { id: 'mitad', label: 'La mitad', pct: 50, tono: 'info' },
  { id: 'poco', label: 'Poco', pct: 25, tono: 'warn' },
  { id: 'nada', label: 'Nada', pct: 0, tono: 'bad' }
]

/*
 * `etiqueta` es literalmente el campo `dieta` de la ficha de cada residente,
 * para que las dos pantallas no se contradigan. La consistencia es un eje
 * aparte que el prototipo no modelaba: ahí solo aparecía embebida en el texto
 * de Carmen Ruiz.
 */
export const dietasIniciales = [
  { rid: 'r1', etiqueta: 'Diabética, baja en sodio', flags: ['diabetica', 'hiposodica'], consistencia: 'Normal', evitar: [], nota: 'Glucosa matutina elevada: vigilar la colación de las 11:00.' },
  { rid: 'r2', etiqueta: 'Normal', flags: [], consistencia: 'Normal', evitar: ['lactosa'], nota: 'Intolerancia a la lactosa. Bebida vegetal en lugar de leche.' },
  { rid: 'r3', etiqueta: 'Hiposódica, consistencia blanda', flags: ['hiposodica'], consistencia: 'Blanda', evitar: [], nota: 'Come despacio y acompañada; se le sirve en plato hondo.' },
  { rid: 'r4', etiqueta: 'Normal, alta en fibra', flags: ['fibra'], consistencia: 'Blanda', evitar: [], nota: 'Consistencia blanda desde el 9 nov, tras la caída: pendiente valorar la deglución.' },
  { rid: 'r5', etiqueta: 'Normal', flags: [], consistencia: 'Normal', evitar: ['mariscos'], nota: 'Alergia al camarón y al resto de mariscos. Reacción documentada en 2019.' },
  { rid: 'r6', etiqueta: 'Baja en sodio', flags: ['hiposodica'], consistencia: 'Normal', evitar: [], nota: 'Tensión en metas; mantener la restricción de sal.' }
]

/*
 * Menú de la semana del 9 al 15 de noviembre, indexado por día (0 = lunes).
 * `ajustes` es lo que cambia para cada dieta; `alternativas`, el plato que se
 * sirve a quien no puede comer el alérgeno. Un tiempo con alérgeno y sin
 * alternativa es justo lo que el módulo marca como pendiente.
 */
export const menuInicial = {
  0: {
    desayuno: { plato: 'Avena con leche, fruta de temporada y té de manzanilla', alergenos: ['lactosa'], alternativas: { lactosa: 'Avena con bebida de almendra' }, ajustes: { diabetica: 'Sin azúcar; fruta entera, nunca en jugo', blanda: 'Fruta en papilla' } },
    colacion1: { plato: 'Gelatina de fruta natural y agua de limón', alergenos: [], alternativas: {}, ajustes: { diabetica: 'Gelatina sin azúcar, agua sin endulzar' } },
    comida: { plato: 'Sopa de fideo, pechuga de pollo en salsa de jitomate, calabacitas y arroz', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Sin sal añadida; salsa sin consomé en polvo', diabetica: 'Media porción de arroz, doble de verdura', fibra: 'Añadir ensalada de nopal', blanda: 'Pollo deshebrado fino y calabacitas en puré' } },
    colacion2: { plato: 'Yogur natural con amaranto', alergenos: ['lactosa'], alternativas: { lactosa: 'Compota de manzana con amaranto' }, ajustes: { diabetica: 'Yogur sin azúcar' } },
    cena: { plato: 'Quesadillas de requesón con nopales y té', alergenos: ['lactosa'], alternativas: { lactosa: 'Quesadillas de frijol con nopales' }, ajustes: { hiposodica: 'Requesón bajo en sodio', blanda: 'Nopales picados finos' } }
  },
  1: {
    desayuno: { plato: 'Huevo revuelto a la mexicana, frijoles de la olla y tortilla de maíz', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Sin sal; jitomate y cebolla sin chile', blanda: 'Huevo suave y frijoles molidos' } },
    colacion1: { plato: 'Manzana picada con canela', alergenos: [], alternativas: {}, ajustes: {} },
    comida: { plato: 'Crema de zanahoria, albóndigas en caldillo, arroz blanco y ensalada', alergenos: ['lactosa'], alternativas: { lactosa: 'Crema de zanahoria con caldo de verdura' }, ajustes: { hiposodica: 'Caldillo sin sal; sin cubito de consomé', diabetica: 'Media porción de arroz', blanda: 'Albóndigas deshechas en el caldillo' } },
    colacion2: { plato: 'Pan integral con mermelada y té', alergenos: [], alternativas: {}, ajustes: { diabetica: 'Mermelada sin azúcar añadida' } },
    cena: { plato: 'Caldo de verduras con pollo deshebrado y tortilla', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Caldo sin sal', blanda: 'Verdura bien cocida y picada' } }
  },
  2: {
    desayuno: { plato: 'Chilaquiles verdes suaves con pollo y frijoles', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Salsa sin consomé ni sal', blanda: 'Tortilla muy remojada, sin totopo crujiente' } },
    colacion1: { plato: 'Papaya en cubos', alergenos: [], alternativas: {}, ajustes: { blanda: 'Papaya machacada' } },
    comida: { plato: 'Sopa de lentejas, filete de pescado al vapor, puré de papa y ejotes', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Pescado al limón, sin sal', fibra: 'Doble porción de lentejas', blanda: 'Pescado desmenuzado y ejotes en puré' } },
    colacion2: { plato: 'Galletas de avena y té de hierbabuena', alergenos: [], alternativas: {}, ajustes: { diabetica: 'Galletas sin azúcar' } },
    cena: { plato: 'Sándwich de pavo con jitomate y leche tibia', alergenos: ['lactosa'], alternativas: { lactosa: 'Té de tila en lugar de la leche' }, ajustes: { hiposodica: 'Pavo fresco en lugar de embutido; pan sin sal', blanda: 'Sándwich sin corteza, cortado en cuartos' } }
  },
  3: {
    desayuno: { plato: 'Hot cakes integrales con fruta y café de olla descafeinado', alergenos: ['lactosa'], alternativas: { lactosa: 'Hot cakes con bebida de almendra' }, ajustes: { diabetica: 'Sin miel; fruta como único endulzante', blanda: 'Hot cakes remojados en la fruta' } },
    colacion1: { plato: 'Jícama con limón y chile suave', alergenos: [], alternativas: {}, ajustes: { blanda: 'Jícama rallada' } },
    comida: { plato: 'Sopa de verduras, tinga de pollo, arroz rojo y ensalada de lechuga', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Tinga sin consomé; sin crema ni queso', diabetica: 'Media porción de arroz', blanda: 'Tinga muy deshebrada, lechuga picada fina' } },
    colacion2: { plato: 'Gelatina de leche', alergenos: ['lactosa'], alternativas: {}, ajustes: { diabetica: 'Gelatina sin azúcar' } },
    cena: { plato: 'Crema de calabaza y pan tostado', alergenos: ['lactosa'], alternativas: { lactosa: 'Crema de calabaza con caldo de verdura' }, ajustes: { hiposodica: 'Sin sal ni consomé' } }
  },
  4: {
    desayuno: { plato: 'Molletes de frijol con queso fresco y fruta', alergenos: ['lactosa'], alternativas: { lactosa: 'Molletes de frijol con aguacate' }, ajustes: { hiposodica: 'Queso fresco sin sal', blanda: 'Pan sin corteza, frijol molido' } },
    colacion1: { plato: 'Mandarina', alergenos: [], alternativas: {}, ajustes: { blanda: 'Mandarina en gajos sin membrana' } },
    comida: { plato: 'Sopa de pasta, pescado empanizado al horno, verduras al vapor y arroz', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Sin sal; empanizado casero sin sazonador', diabetica: 'Sin arroz, doble verdura', blanda: 'Pescado desmenuzado, verdura en puré' } },
    colacion2: { plato: 'Barra de amaranto y agua de jamaica', alergenos: [], alternativas: {}, ajustes: { diabetica: 'Jamaica sin azúcar; media barra' } },
    cena: { plato: 'Atole de avena y pan integral', alergenos: ['lactosa'], alternativas: { lactosa: 'Atole de avena con agua' }, ajustes: { diabetica: 'Atole sin azúcar' } }
  },
  5: {
    desayuno: { plato: 'Huevo con nopales, frijoles y tortilla de maíz', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Sin sal', blanda: 'Nopales picados finos, huevo suave' } },
    colacion1: { plato: 'Plátano', alergenos: [], alternativas: {}, ajustes: { diabetica: 'Medio plátano' } },
    comida: { plato: 'Caldo de camarón, tortitas de camarón con nopales y arroz', alergenos: ['mariscos'], alternativas: { mariscos: 'Tortitas de papa en caldillo de jitomate' }, ajustes: { hiposodica: 'Caldo sin sal; el camarón ya aporta sodio', blanda: 'Tortitas deshechas en el caldillo' } },
    colacion2: { plato: 'Fruta de temporada picada', alergenos: [], alternativas: {}, ajustes: {} },
    cena: { plato: 'Sopa de tortilla ligera con queso panela', alergenos: ['lactosa'], alternativas: { lactosa: 'Sopa de tortilla sin queso, con aguacate' }, ajustes: { hiposodica: 'Caldo sin sal, sin queso' } }
  },
  6: {
    desayuno: { plato: 'Enfrijoladas con pollo y fruta de temporada', alergenos: [], alternativas: {}, ajustes: { blanda: 'Tortilla muy remojada, pollo deshebrado fino' } },
    colacion1: { plato: 'Uvas sin semilla', alergenos: [], alternativas: {}, ajustes: { blanda: 'Uvas partidas a la mitad' } },
    comida: { plato: 'Consomé de pollo con verduras, mole poblano con pechuga y arroz', alergenos: [], alternativas: {}, ajustes: { hiposodica: 'Consomé sin sal; mole casero sin caldo en polvo', diabetica: 'Mole sin azúcar añadida, media porción de arroz', blanda: 'Pechuga deshebrada bañada en mole' } },
    colacion2: { plato: 'Pan dulce integral y té', alergenos: [], alternativas: {}, ajustes: { diabetica: 'Pan sin azúcar o galleta integral' } },
    cena: { plato: 'Quesadillas de flor de calabaza y leche', alergenos: ['lactosa'], alternativas: { lactosa: 'Quesadillas de flor sin queso; té en lugar de leche' }, ajustes: { blanda: 'Quesadilla cortada en tiras' } }
  }
}

/* Registro del desayuno de hoy. Roberto comió poco: se cayó anoche, trae
   febrícula y analgésico. Carmen "desayunó completo", como dice el portal. */
export const ingestaInicial = {
  'r1-desayuno': { nivel: 'completo', hora: '08:52', nota: '' },
  'r2-desayuno': { nivel: 'completo', hora: '08:48', nota: 'Se le sirvió la avena con bebida de almendra' },
  'r3-desayuno': { nivel: 'completo', hora: '08:55', nota: '' },
  'r4-desayuno': { nivel: 'poco', hora: '09:05', nota: 'Refiere náusea leve y dolor de cadera' },
  'r5-desayuno': { nivel: 'completo', hora: '08:44', nota: '' },
  'r6-desayuno': { nivel: 'mitad', hora: '08:50', nota: 'Dejó la mitad de la avena' }
}

export const CATEGORIAS_COMPRA = ['Frutas y verduras', 'Carnes y pescado', 'Abarrotes', 'Lácteos y sustitutos', 'Especiales de dieta']

export const comprasIniciales = [
  { id: 'q1', articulo: 'Jitomate saladet', cantidad: '6 kg', categoria: 'Frutas y verduras', motivo: 'Salsa del lunes y caldillo del sábado', comprado: false },
  { id: 'q2', articulo: 'Calabacita', cantidad: '4 kg', categoria: 'Frutas y verduras', motivo: 'Comida del lunes y crema del jueves', comprado: false },
  { id: 'q3', articulo: 'Nopales limpios', cantidad: '3 kg', categoria: 'Frutas y verduras', motivo: 'Cena del lunes, desayuno del sábado', comprado: true },
  { id: 'q4', articulo: 'Fruta de temporada surtida', cantidad: '12 kg', categoria: 'Frutas y verduras', motivo: 'Desayunos y colaciones de la semana', comprado: false },
  { id: 'q5', articulo: 'Pechuga de pollo', cantidad: '8 kg', categoria: 'Carnes y pescado', motivo: 'Lunes, jueves y domingo', comprado: false },
  { id: 'q6', articulo: 'Filete de pescado blanco', cantidad: '4 kg', categoria: 'Carnes y pescado', motivo: 'Comida del miércoles y del viernes', comprado: false },
  { id: 'q7', articulo: 'Camarón mediano', cantidad: '2 kg', categoria: 'Carnes y pescado', motivo: 'Comida del sábado · servir alternativa a Guadalupe Soto', comprado: false },
  { id: 'q8', articulo: 'Avena en hojuela', cantidad: '3 kg', categoria: 'Abarrotes', motivo: 'Desayunos y atole del viernes', comprado: true },
  { id: 'q9', articulo: 'Frijol bayo', cantidad: '5 kg', categoria: 'Abarrotes', motivo: 'Toda la semana', comprado: true },
  { id: 'q10', articulo: 'Lenteja', cantidad: '2 kg', categoria: 'Abarrotes', motivo: 'Sopa del miércoles · dieta alta en fibra', comprado: false },
  { id: 'q11', articulo: 'Leche entera', cantidad: '14 L', categoria: 'Lácteos y sustitutos', motivo: 'Desayunos y cenas', comprado: false },
  { id: 'q12', articulo: 'Bebida de almendra sin azúcar', cantidad: '6 L', categoria: 'Lácteos y sustitutos', motivo: 'Sustituto para José Luis Ramírez (intolerancia a la lactosa)', comprado: false },
  { id: 'q13', articulo: 'Queso panela bajo en sodio', cantidad: '2 kg', categoria: 'Lácteos y sustitutos', motivo: 'Cena del sábado · 3 dietas hiposódicas', comprado: false },
  { id: 'q14', articulo: 'Mermelada sin azúcar', cantidad: '3 frascos', categoria: 'Especiales de dieta', motivo: 'Colación del martes · dieta diabética', comprado: false },
  { id: 'q15', articulo: 'Gelatina sin azúcar', cantidad: '10 sobres', categoria: 'Especiales de dieta', motivo: 'Colaciones de la semana · dieta diabética', comprado: true },
  { id: 'q16', articulo: 'Sustituto de sal (sin potasio)', cantidad: '4 frascos', categoria: 'Especiales de dieta', motivo: '3 dietas hiposódicas', comprado: false }
]
