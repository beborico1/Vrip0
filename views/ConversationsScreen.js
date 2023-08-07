import { View, Text, ScrollView, ActivityIndicator, TextInput, Button, Keyboard, TouchableOpacity, useWindowDimensions, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { containerStyles } from '../helpers/styles';
import { useNavigation } from '@react-navigation/native';
import useAlgoliaSearch from '../hooks/useAlgoliaSearch';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../helpers/LanguageContext';
import colors from '../helpers/colors';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

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

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const otherUsersIds = [];
            const conversations = [];

            querySnapshot.docs.forEach(conversationDoc => {
                const data = conversationDoc.data();
                if (!data.messageCount) return; // Ignora las conversaciones sin messageCount

                const otherUser = data.users.filter(user => user !== userId)[0];
                otherUsersIds.push(otherUser);
                conversations.push({ ...data, id: conversationDoc.id });
            });

            console.log(otherUsersIds);
            const otherUsersQuery = query(collection(db, "users"), where("id", "in", otherUsersIds));
            const otherUsersDocs = await getDocs(otherUsersQuery);

            const otherUsersData = {};
            otherUsersDocs.forEach((otherUserDoc) => {
                otherUsersData[otherUserDoc.id] = otherUserDoc.data();
                console.log(otherUserDoc.data());
            });

            conversations.forEach((conversation) => {
                const otherUser = conversation.users.filter(user => user !== userId)[0];
                conversation.otherUser = otherUsersData[otherUser];
            });

            setConversations(conversations);
        });

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
                                            <Image source={result.profile_picture ? { uri: result.profile_picture } : require('../assets/default-profile-picture.png')} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'lightgray' }} />
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
                <View style={{ flex: 1, justifyContent: 'start', alignItems: 'center' }}>

                    {conversations.length > 0 ?
                        <ScrollView>
                            {conversations.map((conversation, index) => (
                                conversation.otherUser &&
                                <TouchableOpacity key={index} onPress={() => navigation.navigate('ChatScreen', { result: conversation.otherUser })}>
                                    <View key={index} style={{ padding: 10, marginBottom: 5, backgroundColor: 'white', borderRadius: 5, flexDirection: 'row', alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 }, width: windowWidth * 0.9, marginHorizontal: 3 }}>
                                        <Image
                                            source={conversation.otherUser.profile_picture ? { uri: conversation.otherUser.profile_picture } : require('../assets/default-profile-picture.png')}
                                            style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'lightgray' }}
                                        />
                                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                            <Text
                                                style={{ marginLeft: 10, fontSize: 16, fontWeight: '500' }}
                                            >
                                                @{conversation.otherUser.username}
                                            </Text>
                                            <Text
                                                style={{ marginLeft: 10, fontSize: 14, fontWeight: '400', color: 'gray', marginTop: 5 }}
                                            >
                                                {conversation.lastMessageText}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        :
                        <View
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Text
                                style={{ fontSize: 20, fontWeight: '400', color: 'gray' }}
                            >
                                {texts.noConversationsYet}
                            </Text>
                        </View>
                    }
                </View>
            }
        </View>
    )
}

export default ConversationsScreen