import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';
import { buttonStyles, containerStyles, textStyles } from '../helpers/styles';

const MeMenu = () => {
    const navigation = useNavigation();

    const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
    const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  return (
    <View style={ containerStyles.container }> 
        <TouchableOpacity 
          style={ buttonStyles.greenButton }
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={ buttonStyles.greenButtonText }>{texts.signIn}</Text>
        </TouchableOpacity>
    
        <TouchableOpacity 
          style={{ flexDirection:'row', marginTop:10 }}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={textStyles.label}>{texts.or} <Text style={ textStyles.greenLabel }>{texts.createAnAccount}</Text></Text>
        </TouchableOpacity>
    </View>
  )
}

export default MeMenu

// Estilos y diseño: Aplica estilos y diseños coherentes en todo el componente para asegurarte de que se ajuste al aspecto general de la aplicación y sea visualmente atractivo.

// Mejorar la presentación de los textos: Asegúrate de que los textos estén bien alineados y sean fácilmente legibles. Puedes ajustar el tamaño de fuente, el espaciado y el color para mejorar la legibilidad y la estética.

// Agrega íconos: Utiliza íconos relevantes junto a los botones de "Iniciar sesión" y "Crear una cuenta" para mejorar la comprensión visual y la usabilidad del componente.

// Ajuste de diseño responsivo: Si es necesario, asegúrate de que el diseño del componente se adapte correctamente a diferentes tamaños de pantalla y orientaciones. Esto garantizará una experiencia consistente en diferentes dispositivos.

// Uso de modales en lugar de navegación: Considera utilizar modales en lugar de navegar a pantallas separadas para el inicio de sesión y la creación de cuentas. Esto permitirá que el usuario realice estas acciones sin abandonar la pantalla actual.

// Mejorar la usabilidad: Agrega retroalimentación visual a los botones, como resaltado al pasar el cursor o al presionar, para indicar su interactividad y mejorar la usabilidad del componente.

// Mejor manejo de localización: En lugar de obtener directamente el código de idioma de la configuración regional, utiliza una biblioteca de localización para obtener el idioma preferido del dispositivo y proporcionar traducciones dinámicas basadas en ese idioma.

// Personalización de textos: Permite que los textos del componente se puedan personalizar o traducir mediante propiedades. Esto permitirá una mayor flexibilidad y adaptabilidad a diferentes idiomas o necesidades específicas.

// Uso de componentes reutilizables: Considera crear componentes reutilizables para los botones y etiquetas de texto, de modo que puedan ser utilizados en otros lugares de la aplicación sin duplicar código.

// Implementar autenticación social: Si es relevante para tu aplicación, considera agregar opciones de inicio de sesión o creación de cuentas mediante servicios externos populares, como Google o Facebook, para brindar a los usuarios más opciones y facilitar el proceso de inicio de sesión.