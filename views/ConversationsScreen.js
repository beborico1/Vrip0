import { View, Text, ScrollView, ActivityIndicator, TextInput, Button, Keyboard, TouchableOpacity, useWindowDimensions, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { containerStyles } from '../helpers/styles';
import { useNavigation } from '@react-navigation/native';
import useAlgoliaSearch from '../hooks/useAlgoliaSearch';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../helpers/LanguageContext';
import colors from '../helpers/colors';
import { auth, db } from '../firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const ConversationsScreen = () => {
    const { results, search, loadingAlgolia, errorAlgolia } = useAlgoliaSearch();
    const [algoliaQuery, setAlgoliaQuery] = useState('');
    const navigation = useNavigation();

    const { texts } = useContext(LanguageContext);

    const windowWidth = useWindowDimensions().width;

    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        if (algoliaQuery) {
            search(algoliaQuery);
        }
    }, [algoliaQuery]);

    const userId = auth.currentUser.uid;

    useEffect(() => {
        const q = query(collection(db, "conversations"), where("users", "array-contains", userId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const conversations = [];
            querySnapshot.forEach((doc) => {
                if (!doc.data().messageCount) return;
                // Asegúrate de que la estructura del objeto coincida con cómo esperas usarla
                const data = doc.data();
                data.id = doc.id;  // añade el ID del documento si es necesario
                conversations.push(data);
            });
            setConversations(conversations);
        });

        // Asegúrate de cancelar la suscripción cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    return (
        <View style={[containerStyles.container]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: 'gray', borderWidth: 1, margin: 8, paddingHorizontal: 8, borderRadius: 8 }}>
                <Ionicons name="search" size={24} color="black" />
                <TextInput
                    value={algoliaQuery}
                    onChangeText={text => setAlgoliaQuery(text)}
                    placeholder={texts.searchForUsers}
                    style={{ height: 40, flex: 1, marginLeft: 8 }}
                />
                {algoliaQuery &&
                    <Button
                        title={texts.cancel}
                        color={colors.vrip}
                        onPress={() => {
                            setAlgoliaQuery('');
                            Keyboard.dismiss();
                        }
                        }
                    />
                }
            </View>
            {algoliaQuery ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {loadingAlgolia ? <ActivityIndicator size="large" color={colors.vrip} /> :
                        errorAlgolia ? <Text>Error: {errorAlgolia.message}</Text> :
                            <ScrollView>
                                {results.map((result, index) => (
                                    <TouchableOpacity key={index} onPress={() => {
                                        setAlgoliaQuery('');
                                        navigation.navigate('ChatScreen', { result })
                                    }}
                                    >
                                        <View key={index} style={{ padding: 10, marginBottom: 5, backgroundColor: 'white', borderRadius: 5, flexDirection: 'row', alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 }, width: windowWidth * 0.9, marginHorizontal: 3 }}>
                                            <Image source={result.profile_picture ? { uri: result.profile_picture } : require('../assets/default-profile-picture.png')} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                            <Text
                                                style={{ marginLeft: 10, fontSize: 16, fontWeight: '500' }}
                                            >
                                                @{result.username}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                    }
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {conversations.length > 0 ?
                        conversations.map((conversation, index) => (
                            <TouchableOpacity key={index} onPress={() => navigation.navigate('ChatScreen', { result: conversation.users.filter(user => user !== userId)[0] })}>
                                <View key={index} style={{ padding: 10, marginBottom: 5, backgroundColor: 'white', borderRadius: 5, flexDirection: 'row', alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 }, width: windowWidth * 0.9, marginHorizontal: 3 }}>
                                    <Text
                                        style={{ marginLeft: 10, fontSize: 16, fontWeight: '500' }}
                                    >
                                        {conversation.users.filter(user => user !== userId)[0]}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))

                        :
                        <Text
                            style={{ fontSize: 20, fontWeight: '400', color: 'gray' }}
                        >
                            {texts.noConversationsYet}
                        </Text>
                    }
                </View>
            }
        </View>
    )
}

export default ConversationsScreen