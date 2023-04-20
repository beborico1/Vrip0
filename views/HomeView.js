import { View, StyleSheet, Image, ScrollView, useWindowDimensions, Text } from 'react-native'
import React, { useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const HomeView = () => {
  const [outfits, setOutfits] = useState([]); // State to store the retrieved outfits
  const windowWidth = useWindowDimensions().width;

  useFocusEffect(
    React.useCallback(() => {
        const getOutfits = async () => {
            setOutfits([]); // Clear the outfits array before retrieving new outfits
            const outfitsRef = collection(db, 'outfits'); // Reference to the 'outfits' collection
            try {
              const q = query(outfitsRef, orderBy('timestamp', 'desc')); // Construct the query to order by timestamp in descending order
              const snapshot = await getDocs(q); // Get all documents in the 'outfits' collection with the query applied
              const outfitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map the data and IDs of each document to an array
              setOutfits(outfitsData); // Set the retrieved outfits to state
            } catch (error) {
              console.log('Error retrieving outfits:', error);
            }
          };
          
        getOutfits();
    }, [])
  );
  
  return (
    <View style={styles.container}>
      {outfits.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando Outfits...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {outfits.map(outfit => (
            <Image key={outfit.id} style={[styles.outfitImage, { width: windowWidth/3 , height: (windowWidth/3)/(2/3) }]} source={{ uri: outfit.imageUrl }} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 100,
      height: 100,
    },
    scrollView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Agregar esta propiedad para alinear las imágenes a la izquierda
        paddingTop: 20,
    },
    outfitImage: {
      resizeMode: 'cover',
      backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: 'lightgray',
      fontSize: 18,
      fontWeight: 'medium',
    },
});

export default HomeView
