import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import { containerStyles, textStyles } from '../helpers/styles';
import colors from '../helpers/colors';
import { LanguageContext } from '../helpers/LanguageContext';

const Outfits = ({ loading, error, outfits,onOutfitPress }) => {
  const { texts } = React.useContext(LanguageContext);
  
  const windowWidth = useWindowDimensions().width;
  
  if (loading) {
    return  <View style={[containerStyles.container, {width: windowWidth}]}>
              <ActivityIndicator size="large" color={ colors.vrip } style={containerStyles.loadingIndicator} />
            </View>;
  }

  if (error) {
    console.log(error);

    return <View style={containerStyles.errorContainer}>
             <Text style={textStyles.errorText}>{texts.errorLoadingOutfits}</Text>
           </View>
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onOutfitPress(item)}
        style={[containerStyles.outfitContainer, { width: windowWidth / 3, height: windowWidth / 2, backgroundColor: 'lightgrey', borderColor: 'white', borderWidth: 1 }]}
      >
        <Image source={{ uri: item.imageUrl }} style={{ height: windowWidth / 2, width: windowWidth / 3, resizeMode: 'cover' }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={containerStyles.container }>
       <FlatList
         data={outfits}
         renderItem={renderItem}
         keyExtractor={(item) => item.id}
         numColumns={3}
         columnWrapperStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
       />
    </View>
  )
}

export default Outfits

// import React, { useEffect, useState } from 'react';
// import { View, FlatList, TouchableOpacity, Text, Image } from 'react-native';
// import { containerStyles } from '../helpers/styles';

// const Outfits = ({ outfits, onOutfitPress, windowWidth, blockedUsers }) => {
//   const [processedOutfits, setProcessedOutfits] = useState([]); // Array of outfits to be rendered

//   useEffect(() => {
//     processOutfits()
//   }, [outfits]);

//     // Helper function to process a query snapshot and return an array of outfits
//     function processOutfits() {
//       const processed = [];
  
//       outfits.forEach((outfit) => {
//         // Only add the outfit to the list if the user who posted it is not blocked
//         // and the outfit is not reported
//         if (!blockedUsers.includes(outfit.postedBy) && !outfit.reported) {
//             processed.push(outfit);
//         }
//       });

//       setProcessedOutfits(processed);
//     }


//   const renderItem = ({ item }) => {
//     return (
//       <TouchableOpacity
//         onPress={() => onOutfitPress(item)}
//         style={[containerStyles.outfitContainer, { width: windowWidth / 3, height: windowWidth / 2, backgroundColor: 'lightgrey', borderColor: 'white', borderWidth: 1 }]}
//       >
//         <Image source={{ uri: item.imageUrl }} style={{ height: windowWidth / 2, width: windowWidth / 3, resizeMode: 'cover' }} />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={containerStyles.container }>
//       <FlatList
//         data={processedOutfits}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         numColumns={3}
//         columnWrapperStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
//       />
//     </View>
//   );
// };


// export default Outfits;
