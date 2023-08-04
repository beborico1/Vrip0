import { View } from 'react-native'
import React from 'react'
import MeMenu from '../components/MeMenu'
import MyProfileScreen from './auth/MyProfileScreen';
import { UserContext } from '../helpers/UserContext';

const MeScreen = () => {

  const { user } = React.useContext(UserContext);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%" }}> 
        {user ? 
            <MyProfileScreen/>
            : 
            <MeMenu/>
        }
    </View>
  )
}


export default MeScreen

// Manejo de carga inicial: Mientras se carga la información del usuario, podrías mostrar un indicador de carga o un esqueleto de la pantalla para mejorar la experiencia del usuario.

// Separación de responsabilidades: Considera mover la lógica relacionada con la verificación del usuario a un componente de mayor nivel, lo que permitiría tener un componente MeScreen más limpio y centrado en la presentación.

// Enfoque en el diseño responsivo: Asegúrate de que el diseño se adapte correctamente a diferentes tamaños de pantalla y orientaciones, para brindar una experiencia de usuario coherente.

// Uso de estilos reutilizables: Considera el uso de estilos reutilizables en lugar de definir estilos directamente en el componente. Esto facilitará la gestión y mantenimiento de estilos consistentes en toda la aplicación.

// Mejorar la legibilidad del código: Asegúrate de seguir las convenciones de nombres adecuadas y de tener un formato de código coherente para facilitar la lectura y comprensión del componente.

// Agregar manejo de errores: Si se produce algún error durante la carga del perfil o el menú, podrías agregar un manejo de errores adecuado para informar al usuario y brindar opciones de recuperación.

// Optimización de rendimiento: Evalúa si hay alguna operación costosa en términos de rendimiento, como la carga de datos excesiva o cálculos innecesarios, y realiza las optimizaciones correspondientes para mejorar la velocidad de renderizado.

// Agregar navegación interna: Si el perfil y el menú son componentes independientes, podrías agregar navegación interna dentro de MeScreen para permitir una transición suave entre ellos.

// Agregar animaciones: Considera la posibilidad de agregar animaciones sutiles para mejorar la experiencia de usuario al interactuar con los elementos de la pantalla.

// Mejorar la usabilidad del menú: Si el menú tiene varias opciones, podrías organizarlas de manera más intuitiva o agregar funcionalidades adicionales, como agrupar opciones relacionadas o proporcionar accesos directos para acciones comunes.