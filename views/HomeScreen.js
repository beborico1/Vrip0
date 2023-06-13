import { View } from 'react-native'
import React, { useState } from 'react'
import FeedHeader from '../components/FeedHeader'
import Outfits from '../components/Outfits';
import useAllOutfits from '../hooks/useAllOutfits';
import { containerStyles } from '../helpers/styles';
import { LanguageContext } from '../helpers/LanguageContext';
import OutfitModal from './modals/OutfitModal';

const HomeScreen = () => {
  const { texts } = React.useContext(LanguageContext);

  const { loading, error, outfits, setOutfits } = useAllOutfits();

  const [selectedOutfit, setSelectedOutfit] = useState(null);

  const onOutfitPress = (outfit) => {
    console.log('outfit press', outfit);
    setSelectedOutfit(outfit);
  };

  const handleFilterReport = () => {
    const filteredOutfits = outfits.filter(outfit => outfit.reported === true);
    setOutfits(filteredOutfits);
  };

  return (
    <>
    <OutfitModal
      outfit = {selectedOutfit}
      isVisible={selectedOutfit !== null}
      closeOutfitModal={() => setSelectedOutfit(null)}
      handleFilterReport = {handleFilterReport}
    />

    <View style={containerStyles.container}>
      <FeedHeader title = {texts.communityOutfits} />
      
      <Outfits
        outfits = {outfits}
        loading = {loading}
        error = {error}
        onOutfitPress = {onOutfitPress}
      />

    </View>
    </>
  )
}

export default HomeScreen

// Optimización de la carga inicial de outfits: Puedes implementar una técnica de carga progresiva para cargar inicialmente solo un número limitado de outfits y luego cargar más outfits a medida que el usuario se desplaza hacia abajo en la lista.

// Mejorar el manejo de errores: Agrega un componente de manejo de errores que muestre un mensaje amigable al usuario en caso de que ocurra un error al cargar los outfits.

// Implementar paginación infinita: En lugar de cargar todos los outfits a la vez, considera implementar la carga paginada o infinita, donde se cargan más outfits a medida que el usuario se desplaza hacia abajo en la lista.

// Agregar un indicador de carga: Muestra un indicador de carga (por ejemplo, un spinner) mientras se cargan los outfits, para informar al usuario que la aplicación está trabajando en segundo plano.

// Agregar un indicador de fin de lista: Muestra un indicador visual cuando se llega al final de la lista de outfits para indicar que no hay más outfits disponibles.

// Agregar filtrado de outfits: Implementa la capacidad de filtrar los outfits por diferentes categorías o etiquetas para que los usuarios puedan explorar outfits específicos de su interés.

// Mejorar la experiencia de usuario al seleccionar un outfit: Además de simplemente mostrar el outfit seleccionado en un modal, considera implementar una vista más detallada del outfit, que muestre información adicional y permita al usuario interactuar con él de diversas formas.

// Agregar funcionalidad de búsqueda: Implementa una barra de búsqueda que permita a los usuarios buscar outfits por palabras clave o etiquetas relacionadas.

// Agregar acciones interactivas: Permite a los usuarios realizar acciones adicionales en los outfits, como dar "me gusta", compartir, guardar en una lista de favoritos, etc.

// Mejorar la accesibilidad: Asegúrate de que la aplicación sea accesible para usuarios con discapacidades visuales o de movilidad. Esto puede incluir el uso de etiquetas de accesibilidad, tamaños de fuente ajustables, controles de voz y más.