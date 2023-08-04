import { View, Text, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import useUserOutfits from '../hooks/useUserOutfits';
import Outfits from '../components/Outfits';
import { LanguageContext } from '../helpers/LanguageContext';
import { textStyles } from '../helpers/styles';
import OutfitModal from './modals/OutfitModal';

const ProfileScreen = () => {
  const route = useRoute();
  const { result } = route.params; // get props from navigation.navigate('Profile', { result: item })

  const navigation = useNavigation();

  React.useLayoutEffect(() => { // cambiamos el header del stack navigator para que muestre el nombre del usuario en vez de "Perfil"
    navigation.setOptions({
      title: result.username
    });
  }, [navigation]);

  const { loading, error, outfits, setOutfits } = useUserOutfits(result.uid);

  const {texts} = React.useContext(LanguageContext);

  const [selectedOutfit, setSelectedOutfit] = React.useState(null);
  
  const handleFilterReport = () => {
    const filteredOutfits = outfits.filter(outfit => outfit.reported === true);
    setOutfits(filteredOutfits);
  };

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
      handleFilterReport = {handleFilterReport}
    />

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
        >

          <Image source={result.profile_picture ? { uri: result.profile_picture } : require('../assets/default-profile-picture.png')} style={{ width: 90, height: 90, borderRadius: 60, backgroundColor: result.profile_picture ? 'lightgray' : 'white', border: 1, borderColor: 'gray' }} />

          <View style={{ flex:1, marginLeft: 20, paddingTop: 5 }}>
             <Text
                 style={textStyles.boldLabel}
             > 
                  {result.name || texts.userHasNoName}
             </Text>
             <View style={{flexDirection: 'row'}}>
                 <Text style = {{...textStyles.label, color: 'gray'}}>
                  @{result.username || ""}
                 </Text>
             </View>

             <Text
                 style={{...textStyles.label}}                  
             > 
              {result.presentation || ""}
             </Text>

          </View>
        </View>
      </View>

      {outfits.length > 0 ?
        <Outfits
          outfits={outfits}
          loading={loading}
          error={error}
          onOutfitPress={onOutfitPress}
        /> :
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
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
        </View>
      }
    </View>
    </>
  )
}

export default ProfileScreen