import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import useUserOutfits from '../hooks/useUserOutfits';
import Outfits from '../components/Outfits';
import { LanguageContext } from '../helpers/LanguageContext';

const ProfileScreen = () => {
  const route = useRoute();
  const { result } = route.params; // get props from navigation.navigate('Profile', { result: item })

  const navigation = useNavigation();

  React.useLayoutEffect(() => { // cambiamos el header del stack navigator para que muestre el nombre del usuario en vez de "Perfil"
    navigation.setOptions({
      title: result.username
    });
  }, [navigation]);

  const { loading, error, outfits } = useUserOutfits(result.uid);

  const {texts} = React.useContext(LanguageContext);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {outfits.length > 0 ?
        <Outfits
          outfits={outfits}
          loading={loading}
          error={error}
          onOutfitPress={(item) => { 
            console.log('outfit press', item);
          }}
        /> :
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            textAlign: 'center',
            color: 'gray'
          }}

        >
          {texts.noOutfits}
        </Text>
      }
    </View>
  )
}

export default ProfileScreen