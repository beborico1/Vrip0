import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import { containerStyles, textStyles } from '../helpers/styles';
import colors from '../helpers/colors';
import { LanguageContext } from '../helpers/LanguageContext';

const Outfits = ({ loading, error, outfits,onOutfitPress }) => {
  const { texts } = React.useContext(LanguageContext);
  
  const windowWidth = useWindowDimensions().width;

  if (loading) {
    return  <View style={[containerStyles.container, {width: windowWidth}]}>
              <ActivityIndicator size="large" color={ colors.vrip } style={containerStyles.loadingIndicator} />
            </View>;
  }

  if (error) {
    console.log(error);

    return <View style={containerStyles.errorContainer}>
             <Text style={textStyles.errorText}>{texts.errorLoadingOutfits}</Text>
           </View>
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onOutfitPress(item)}
        style={[containerStyles.outfitContainer, { width: windowWidth / 3, height: windowWidth / 2, backgroundColor: 'lightgrey', borderColor: 'white', borderWidth: 1 }]}
      >
        <Image source={{ uri: item.imageUrl }} style={{ height: windowWidth / 2, width: windowWidth / 3, resizeMode: 'cover' }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[containerStyles.container, {width: windowWidth}] }>
       <FlatList
         data={outfits}
         renderItem={renderItem}
         keyExtractor={(item) => item.id}
         numColumns={3}
         columnWrapperStyle={{ flexDirection: 'row', justifyContent: 'flex-start', width: windowWidth }}
       />
    </View>
  )
}

export default Outfits

// Mejorar la presentación visual de los elementos de la lista: Aplica estilos y diseños para mejorar la presentación visual de los elementos de la lista de atuendos. Esto puede incluir sombras, efectos de transición al interactuar con los elementos y ajustar el espaciado entre los elementos.

// Agrega un indicador de carga adicional: Además del indicador de carga existente, considera agregar un indicador de carga adicional al final de la lista de atuendos cuando se estén cargando más elementos. Esto proporcionará una experiencia más fluida al usuario mientras se cargan más datos.

// Manejo de errores más detallado: En lugar de simplemente mostrar un mensaje de error genérico, considera mostrar mensajes de error más descriptivos o específicos en función del tipo de error. Esto ayudará al usuario a comprender mejor el problema y tomar medidas adecuadas.

// Implementa paginación: Si hay una gran cantidad de atuendos para mostrar, considera implementar paginación para cargar y mostrar los atuendos en lotes más pequeños. Esto mejorará el rendimiento y la experiencia de usuario al reducir el tiempo de carga inicial.

// Agrega imágenes de carga progresiva: En lugar de mostrar imágenes en baja resolución mientras se cargan, considera implementar la carga progresiva de imágenes para mostrar una versión de baja calidad inicialmente y luego cargar gradualmente una versión de alta calidad. Esto mejorará la experiencia visual para el usuario.

// Personaliza el mensaje de carga: En lugar de mostrar un indicador de carga genérico, considera agregar un mensaje más informativo o atractivo para indicar que se están cargando los atuendos. Esto mantendrá al usuario comprometido mientras espera la carga completa de la lista.

// Agrega animaciones: Implementa animaciones sutiles al mostrar los atuendos, como transiciones suaves al expandir o contraer los elementos, o animaciones de desvanecimiento al cargar nuevos atuendos. Esto mejorará la estética general y la sensación de interactividad en la lista.

// Agrega filtros o categorías: Si es relevante para tu aplicación, considera agregar opciones de filtrado o categorización para permitir que los usuarios naveguen y encuentren rápidamente los atuendos deseados. Esto mejorará la usabilidad y la capacidad de descubrimiento de los usuarios.

// Mejora el manejo de eventos de presionar: Asegúrate de manejar correctamente los eventos de presionar en los elementos de la lista, proporcionando retroalimentación visual o interacciones adicionales, como mostrar detalles completos del atuendo en una pantalla separada.

// Optimización de rendimiento: Si la lista de atuendos es grande y puede afectar el rendimiento, considera implementar técnicas de optimización, como el uso de ventanas virtuales o la carga diferida de imágenes, para mejorar la velocidad de desplazamiento y la capacidad de respuesta de la lista.