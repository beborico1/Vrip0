import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';

const MeMenu = () => {
    const navigation = useNavigation();


    const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
    const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%"}}> 
        <TouchableOpacity 
        style={{ backgroundColor: '#32CD32', padding: 10, borderRadius: 5, margin: 10, alignItems: 'center', shadowColor: "#333", shadowOffset: {   width: 0,   height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}
        onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', }}>{texts.signIn}</Text>
        </TouchableOpacity>
    
        <TouchableOpacity 
        style={{flexDirection:'row',marginTop:10}}
        onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={{fontSize: 18}}>{texts.or} <Text style={{ color: '#32CD32', fontSize: 18, fontWeight:"600"}}>{texts.createAnAccount}</Text></Text>
        </TouchableOpacity>
    </View>
  )
}

export default MeMenu

// import { View, Text, TouchableOpacity } from 'react-native'
// import React from 'react'
// import { useNavigation } from '@react-navigation/native';

// const MeMenu = () => {
//   const navigation = useNavigation();

//   const translations = {
//     en: {
//     },
//     es: {

//     },
//   };

//   const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
//   const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%", backgroundColor: 'red' }}> 
//         <TouchableOpacity 
//         style={{ backgroundColor: '#32CD32', padding: 10, borderRadius: 5, margin: 10, alignItems: 'center', shadowColor: "#333", shadowOffset: {   width: 0,   height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}
//         onPress={() => navigation.navigate('LoginScreen')}
//         >
//           <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', }}>Iniciar Sesión</Text>
//         </TouchableOpacity>
    
//         <TouchableOpacity 
//         style={{flexDirection:'row',marginTop:10}}
//         onPress={() => navigation.navigate('SignUpScreen')}
//         >
//           <Text style={{fontSize: 18}}>o <Text style={{ color: '#32CD32', fontSize: 18, fontWeight:"600"}}>Crear una Cuenta</Text></Text>
//         </TouchableOpacity>
//     </View>
//   )
// }

// export default MeMenu