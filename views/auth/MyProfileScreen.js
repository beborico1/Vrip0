import { View } from 'react-native'
import React, { useState } from 'react'
import FeedHeader from '../../components/FeedHeader'
import useMyOutfits from '../../hooks/useMyOutfits';
import Outfits from '../../components/Outfits';
import { LanguageContext } from '../../helpers/LanguageContext';
import OutfitModal from '../modals/OutfitModal';
import UserHeader from '../../components/UserHeader';

const MyProfileScreen = () => {
  const { texts } = React.useContext(LanguageContext);

  const { loading, error, outfits } = useMyOutfits();

  const [selectedOutfit, setSelectedOutfit] = useState(null);

  const onOutfitPress = (outfit) => {
    console.log('outfit press', outfit);
    setSelectedOutfit(outfit);
  };

  return (
    <>
      <OutfitModal
        outfit = {selectedOutfit}
        isVisible={selectedOutfit !== null}
        closeOutfitModal={() => setSelectedOutfit(null)}
      />
      <View>
        <UserHeader />
    
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

export default MyProfileScreen

// Mejora en la estructura del componente: Considera envolver todo el contenido del componente en un contenedor principal, como un View, para asegurarte de que el diseño esté correctamente estructurado y evitar problemas de diseño.

// Manejo de estados: Evalúa si es necesario utilizar más estados en el componente para gestionar otros aspectos, como la carga de datos, errores o interacciones con el usuario.

// Optimización de rendimiento: Si la lista de outfits es potencialmente larga, considera implementar un sistema de paginación o carga dinámica para mejorar el rendimiento y la experiencia del usuario.

// Mejora en la presentación de errores: Proporciona un mensaje de error más descriptivo y amigable para informar al usuario sobre cualquier error que pueda ocurrir durante la carga de los outfits.

// Mejora en la accesibilidad: Asegúrate de que todos los elementos visuales sean accesibles para usuarios con discapacidades visuales o de movilidad. Puedes hacer esto agregando etiquetas accessibilityLabel a los elementos visuales y asegurándote de que se pueda navegar correctamente utilizando un lector de pantalla.

// Mejora en la navegación: Evalúa si se puede agregar una función de navegación para permitir al usuario regresar a la pantalla anterior desde el modal de OutfitModal. Esto proporcionaría una experiencia de usuario más intuitiva y coherente.

// Añadir opciones de edición: Si la aplicación permite la edición de outfits, considera agregar opciones para editar o eliminar un outfit desde la pantalla de perfil.

// Mejora en la visualización de la lista de outfits: Evalúa si se pueden agregar elementos visuales adicionales, como imágenes o iconos, para mejorar la visualización de cada outfit en la lista.

// Optimización de carga de datos: Si es posible, implementa un sistema de caché o almacenamiento local para reducir la carga de datos repetitivos y mejorar el rendimiento de la aplicación.

// Estilos y diseño: Asegúrate de aplicar estilos y diseño coherentes en todo el componente, siguiendo las pautas de diseño de la aplicación y utilizando una paleta de colores consistente. Esto mejorará la apariencia visual y la experiencia del usuario.