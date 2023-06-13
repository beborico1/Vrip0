import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as Localization from 'expo-localization';
import translations from '../../helpers/translations';
import { buttonStyles, containerStyles, textStyles } from '../../helpers/styles';

const WelcomeModal = ({ isVisible, closeWelcomeModal }) => {
  const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
  const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={[containerStyles.modalView, { paddingVertical: 70, paddingHorizontal: 50 }]}>
        <Text style={ textStyles.modalDescription }>{texts.description}</Text>
        <Text style={ textStyles.modalDescription }>{texts.termsTitle}</Text>
        <ScrollView style={{ flex: 1, marginBottom: 20 }}>
          <Text style={textStyles.termsText}>{texts.terms}</Text>
        </ScrollView>
        <TouchableOpacity style={buttonStyles.greenButton} onPress={closeWelcomeModal}>
          <Text style={buttonStyles.greenButtonText}>{texts.understood}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};



export default WelcomeModal

// Mejorar la legibilidad del código: Asegúrate de seguir las convenciones de nombres adecuadas y de tener un formato de código coherente para mejorar la legibilidad y la comprensión del componente.

// Separar lógica y presentación: Si hay alguna lógica adicional relacionada con el modal, considera separarla en funciones auxiliares o hooks personalizados para mantener el componente más limpio y modular.

// Optimización de estilos: Evalúa si se pueden optimizar los estilos utilizados en el modal para mejorar la legibilidad y el rendimiento, por ejemplo, agrupando estilos similares o utilizando estilos reutilizables.

// Mejorar la experiencia de usuario: Considera agregar animaciones o transiciones suaves al abrir y cerrar el modal para brindar una experiencia más agradable al usuario.

// Agregar internacionalización: Utiliza la biblioteca de internacionalización (i18n) para manejar las traducciones de manera más robusta y modular.

// Mejorar el diseño y la disposición del contenido: Evalúa si se puede mejorar la disposición y presentación del contenido en el modal para que sea más fácil de leer y comprender.

// Agregar más información legal: Si es necesario, considera agregar más información legal o detalles relevantes en el modal, como políticas de privacidad, condiciones de uso, etc.

// Mejorar la accesibilidad: Asegúrate de que el modal sea accesible para usuarios con discapacidades visuales o de movilidad, al proporcionar etiquetas descriptivas y ajustar los tamaños de fuente según las preferencias del usuario.

// Agregar capacidad de desplazamiento horizontal: Si el contenido del modal es más amplio que la pantalla, considera agregar capacidad de desplazamiento horizontal para que los usuarios puedan leer todo el contenido.

// Mejorar el manejo de cierre del modal: Evalúa si hay alguna funcionalidad adicional que se deba ejecutar al cerrar el modal y asegúrate de manejarla adecuadamente. Esto podría incluir acciones como guardar la configuración del usuario o realizar alguna operación relacionada.