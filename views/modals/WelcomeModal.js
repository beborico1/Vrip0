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