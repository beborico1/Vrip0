import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { textStyles } from '../helpers/styles'
import * as Localization from 'expo-localization';
import translations from '../helpers/translations';
import colors from '../helpers/colors';

const windowWidth = Dimensions.get('window').width;

const UserHeader = ({ handleSelectProfilePicture, image, formData, hasChanges, handleInputChange, handleSaveChanges, isLoading, error }) => {

    const locale = Localization.locale.slice(0, 2); // Obtiene el código de idioma de dos letras (por ejemplo, 'en' o 'es')
    const texts = translations[locale] || translations.en; // Selecciona las traducciones correspondientes al idioma actual, y si no se encuentra, usa inglés por defecto

  return (
<View style={{backgroundColor: 'white', width: windowWidth, padding: 10, paddingBottom: 40}}>
                <View style= {{ flexDirection: 'row', paddingHorizontal: 10}}>
                    <TouchableOpacity onPress={handleSelectProfilePicture}>
                        <Image source={image ? { uri: image } : require('../assets/default-profile-picture.png')} style={{ width: 90, height: 90, borderRadius: 60, backgroundColor: 'gray' }} />
                    </TouchableOpacity>
                    <View style={{ flex:1, marginLeft: 20, paddingTop: 5 }}>
                        <TextInput
                            placeholder={texts.enterYourName}
                            value={formData.name}
                            onChangeText={text => handleInputChange('name', text)}
                            style={textStyles.boldLabel}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Text style = {formData.username ? {...textStyles.label, color: 'gray'} : {...textStyles.label, color: 'lightgray'}}>@</Text>
                            <TextInput
                                placeholder={texts.enterYourUsername}
                                value={formData.username}
                                onChangeText={text => handleInputChange('username', text)}
                                style={{...textStyles.label, color: 'gray', paddingBottom: 10}}
                            />
                        </View>

                        <TextInput
                            placeholder={texts.enterPresentation}
                            value={formData.presentation}
                            onChangeText={text => handleInputChange('presentation', text)}
                            multiline
                            numberOfLines={4}
                            autoGrow
                            style={{...textStyles.label}}
                            
                        />
                    </View>
                </View>

                { hasChanges && (
                    <TouchableOpacity onPress={handleSaveChanges}>
                        <Text style={[textStyles.greenLabel, {width: '100%', textAlign: 'center', paddingVertical: 20}]}>Guardar Cambios</Text>
                    </TouchableOpacity> 
                ) }


                {isLoading && (
                    <ActivityIndicator size="large" color={colors.vrip}/>
                )}

                {error && (
                    <Text style={{color: 'red'}}>{error}</Text>
                )}

            </View>

  )
}

export default UserHeader