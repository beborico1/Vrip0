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