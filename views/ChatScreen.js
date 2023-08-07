import KeyboardSpacer from 'react-native-keyboard-spacer';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import React, { useEffect, useState, useCallback, memo } from 'react';
import colors from '../helpers/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, onSnapshot, addDoc, serverTimestamp, orderBy, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import * as Device from 'expo-device';

const Message = memo(({ item, index }) => (
    <View key={index} style={{ marginBottom: 10, alignSelf: item.user !== auth.currentUser.uid ? 'flex-start' : 'flex-end', backgroundColor: item.user !== auth.currentUser.uid ? 'white' : colors.vrip, padding: 10, borderRadius: 15, shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 } }}>
        <Text
            style={{ color: item.user !== auth.currentUser.uid ? 'black' : 'white', fontSize: 16 }}
        >
            {item.text}
        </Text>
    </View>
));

const ChatScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);

    const route = useRoute();
    const { result } = route.params;

    const navigation = useNavigation();
    const scrollViewRef = React.useRef();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: result.username
        });
    }, [navigation]);


    // Busca todas las conversaciones del usuario actual y devuelve el id de la conversación
    const fetchConversation = async (user1, user2) => {
        const conversationsQuery = query(
            collection(db, 'conversations'),
            where('users', 'array-contains', user1)
        );
        const querySnapshot = await getDocs(conversationsQuery);

        if (!querySnapshot.empty) {
            for (let doc of querySnapshot.docs) {
                if (doc.data().users.includes(user2)) {
                    return doc.id;
                }
            }
        }
        return null;
    }

    // Crea una nueva conversación y devuelve el id de la conversación
    const createConversation = async (user1, user2) => {
        const newConversationDoc = doc(collection(db, 'conversations'));
        await setDoc(newConversationDoc, { users: [user1, user2], createdAt: serverTimestamp(), messageCount: 0 });
        return newConversationDoc.id;
    }

    // Recupera los mensajes de la conversación y establece un observador en tiempo real
    const fetchMessages = (conversationId) => {
        const messagesCollection = collection(db, `conversations/${conversationId}/messages`);
        const messagesQuery = query(messagesCollection, orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const newMessages = querySnapshot.docs.map(doc => {
                const firebaseData = doc.data();
                const data = {
                    _id: doc.id,
                    text: '',
                    createdAt: new Date().getTime(),
                    ...firebaseData
                };
                return data;
            });
            setMessages(newMessages);
        });
        return unsubscribe;
    }

    useEffect(() => {
        const initConversation = async () => {
            const user1 = auth.currentUser.uid;
            const user2 = result.uid;

            let conversationId = await fetchConversation(user1, user2);

            if (!conversationId) {
                conversationId = await createConversation(user1, user2);
            }

            setConversationId(conversationId);
            const unsubscribe = fetchMessages(conversationId);
            return () => unsubscribe();
        }

        initConversation();
    }, []);

    const handleSendMessage = async () => {
        if (message !== '' && conversationId) {
            setMessage('');
            await addDoc(collection(db, `conversations/${conversationId}/messages`), {
                text: message,
                createdAt: serverTimestamp(),
                user: auth.currentUser.uid
            });
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }

    const handleChange = useCallback((text) => {
        setMessage(text);
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, []);

    // Efecto para desplazarse automáticamente a la parte inferior del ScrollView
    useEffect(() => {
        // Verifica que la referencia y la longitud de los mensajes sean válidas
        if (scrollViewRef.current && messages.length > 0) {
            // Desplazamiento programado con un retraso para asegurarse de que todos los elementos estén renderizados
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100); // Puedes ajustar este retraso según sea necesario
        }
    }, [messages]);

    const handleInputFocus = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
    }

    let topSpacing = 0; // Valor predeterminado

    const modelId = Device.modelId;
    console.log(modelId)

    if (Platform.OS === 'ios' && modelId.includes('iPhone12')) {
        topSpacing = -80;
    }

    return (
        <View style={{ flex: 1, paddingBottom: 10, paddingHorizontal: 10, paddingTop: 10 }}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                >
                    {messages.map((item, index) => <Message key={index} item={item} index={index} />)}
                </ScrollView>
            </View>

            <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 10, height: 40, borderRadius: 5, shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 } }}
            >
                <TextInput
                    placeholder="Escribe un mensaje"
                    style={{ height: 40, flex: 1, marginLeft: 8 }}
                    value={message}
                    onChangeText={handleChange}
                    onSubmitEditing={handleSendMessage}
                    onFocus={handleInputFocus}
                />
                <TouchableOpacity
                    onPress={handleSendMessage}
                >
                    {message !== '' &&
                        <Text
                            style={{ color: colors.vrip, fontWeight: '500', fontSize: 16 }}
                        >
                            Enviar
                        </Text>
                    }
                </TouchableOpacity>
            </View>

            {/* Agrega espacio adicional solo en iOS */}
            {Platform.OS === 'ios' && <KeyboardSpacer topSpacing={topSpacing} />}
        </View>
    )
}

export default ChatScreen

// import { View, TextInput, TouchableOpacity, Text, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import React, { useEffect, useState, useCallback, memo } from 'react';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import colors from '../helpers/colors';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { collection, onSnapshot, addDoc, serverTimestamp, orderBy, query, where, getDocs, doc, setDoc } from "firebase/firestore";
// import { auth, db } from '../firebaseConfig';

// const Message = memo(({ item, index }) => (
//     <View key={index} style={{ marginBottom: 10, alignSelf: item.user !== auth.currentUser.uid ? 'flex-start' : 'flex-end', backgroundColor: item.user !== auth.currentUser.uid ? 'white' : colors.vrip, padding: 10, borderRadius: 15, shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 } }}>
//         <Text
//             style={{ color: item.user !== auth.currentUser.uid ? 'black' : 'white', fontSize: 16 }}
//         >
//             {item.text}
//         </Text>
//     </View>
// ));

// const ChatScreen = () => {
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [conversationId, setConversationId] = useState(null);

//     const route = useRoute();
//     const { result } = route.params;

//     const navigation = useNavigation();
//     const scrollViewRef = React.useRef();

//     React.useLayoutEffect(() => {
//         navigation.setOptions({
//             title: result.username
//         });
//     }, [navigation]);


//     // Busca todas las conversaciones del usuario actual y devuelve el id de la conversación
//     const fetchConversation = async (user1, user2) => {
//         const conversationsQuery = query(
//             collection(db, 'conversations'),
//             where('users', 'array-contains', user1)
//         );
//         const querySnapshot = await getDocs(conversationsQuery);

//         if (!querySnapshot.empty) {
//             for (let doc of querySnapshot.docs) {
//                 if (doc.data().users.includes(user2)) {
//                     return doc.id;
//                 }
//             }
//         }
//         return null;
//     }

//     // Crea una nueva conversación y devuelve el id de la conversación
//     const createConversation = async (user1, user2) => {
//         const newConversationDoc = doc(collection(db, 'conversations'));
//         await setDoc(newConversationDoc, { users: [user1, user2] });
//         return newConversationDoc.id;
//     }

//     // Recupera los mensajes de la conversación y establece un observador en tiempo real
//     const fetchMessages = (conversationId) => {
//         const messagesCollection = collection(db, `conversations/${conversationId}/messages`);
//         const messagesQuery = query(messagesCollection, orderBy('createdAt', 'asc'));
//         const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
//             const newMessages = querySnapshot.docs.map(doc => {
//                 const firebaseData = doc.data();
//                 const data = {
//                     _id: doc.id,
//                     text: '',
//                     createdAt: new Date().getTime(),
//                     ...firebaseData
//                 };
//                 return data;
//             });
//             setMessages(newMessages);
//         });
//         return unsubscribe;
//     }

//     useEffect(() => {
//         const initConversation = async () => {
//             const user1 = auth.currentUser.uid;
//             const user2 = result.uid;

//             let conversationId = await fetchConversation(user1, user2);

//             if (!conversationId) {
//                 conversationId = await createConversation(user1, user2);
//             }

//             setConversationId(conversationId);
//             const unsubscribe = fetchMessages(conversationId);
//             return () => unsubscribe();
//         }

//         initConversation();
//     }, []);

//     const handleSendMessage = async () => {
//         if (message !== '' && conversationId) {
//             await addDoc(collection(db, `conversations/${conversationId}/messages`), {
//                 text: message,
//                 createdAt: serverTimestamp(),
//                 user: auth.currentUser.uid
//             });
//             setMessage('');
//             scrollViewRef.current?.scrollToEnd({ animated: true });
//         }
//     }

//     const handleChange = useCallback((text) => {
//         setMessage(text);
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//     }, []);

//     useEffect(() => {
//         scrollViewRef.current?.scrollToEnd({ animated: false });
//     }, [messages]);

//     return (
//         <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//             <KeyboardAwareScrollView
//                 contentContainerStyle={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 10 }}
//                 keyboardShouldPersistTaps="always"
//             >
//                 <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//                     <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 }}>
//                         <ScrollView
//                             ref={scrollViewRef}
//                             keyboardShouldPersistTaps="always"
//                         >
//                             {messages.map((item, index) => <Message key={index} item={item} index={index} />)}
//                         </ScrollView>
//                     </View>
//                 </TouchableWithoutFeedback>

//                 <View
//                     style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 10, height: 40, marginLeft: 8, marginRight: 8, borderRadius: 5, shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 1, height: 1 } }}
//                 >
//                     <TextInput
//                         placeholder="Escribe un mensaje"
//                         style={{ height: 40, flex: 1, marginLeft: 8 }}
//                         value={message}
//                         onChangeText={handleChange}
//                         onSubmitEditing={handleSendMessage}
//                     />
//                     <TouchableOpacity
//                         onPress={handleSendMessage}
//                     >
//                         {message !== '' &&
//                             <Text
//                                 style={{ color: colors.vrip, fontWeight: '500', fontSize: 16 }}
//                             >
//                                 Enviar
//                             </Text>
//                         }
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAwareScrollView>
//         </TouchableWithoutFeedback>
//     )
// }

// export default ChatScreen;
