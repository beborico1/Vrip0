const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp();

const THUMB_MAX_HEIGHT = 300;
const ICON_MAX_HEIGHT = 150;
const THUMB_PREFIX = "thumb_";
const ICON_PREFIX = "icon_";

exports.updatePostLikeCount = functions.firestore
    .document("outfits/{outfitId}/likes/{likeId}")
    .onWrite(async (change, context) => {
      const outfitId = context.params.outfitId;
      const docRef = admin.firestore().collection("outfits").doc(outfitId);
      // Obtén la colección de likes
      const likesSnapshot = await docRef.collection("likes").get();
      // Actualiza el contador de likes
      return docRef.update({"likeCount": likesSnapshot.size});
    });

exports.updateUserLikeCount = functions.firestore
    .document("users/{userId}/likes/{likeId}")
    .onWrite(async (change, context) => {
      const userId = context.params.userId;
      const docRef = admin.firestore().collection("users").doc(userId);
      // Obtén la colección de likes
      const likesSnapshot = await docRef.collection("likes").get();
      // Actualiza el contador de likes
      return docRef.update({"likeCount": likesSnapshot.size});
    });

exports.updateUserViewCount = functions.firestore
    .document("users/{userId}/views/{viewId}")
    .onWrite(async (change, context) => {
      const userId = context.params.userId;
      const docRef = admin.firestore().collection("users").doc(userId);
      // Obtén la colección de views
      const viewsSnapshot = await docRef.collection("views").get();
      // Actualiza el contador de views
      return docRef.update({"viewCount": viewsSnapshot.size});
    });

exports.updatePostViewCount = functions.firestore
    .document("outfits/{outfitId}/views/{viewId}")
    .onWrite(async (change, context) => {
      const outfitId = context.params.outfitId;
      const docRef = admin.firestore().collection("outfits").doc(outfitId);
      // Obtén la colección de views
      const viewsSnapshot = await docRef.collection("views").get();
      // Actualiza el contador de views
      return docRef.update({"viewCount": viewsSnapshot.size});
    });

exports.deleteUserOutfits = functions.firestore
    .document("users/{userId}")
    .onDelete(async (snap, context) => {
      const userId = context.params.userId;
      // Obtén la referencia a la colección "outfits"
      const outfitsRef = admin.firestore().collection("outfits");
      // Obtén todos los documentos en "outfits" donde
      // "postedBy" sea igual a "userId"
      const userOutfitsSnapshot = await outfitsRef.where(
          "postedBy", "==", userId).get();
      // Crea un batch para realizar múltiples operaciones de escritura
      const batch = admin.firestore().batch();
      // Añade cada documento que quieres eliminar al batch
      userOutfitsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // Ejecuta el batch
      return batch.commit();
    });

exports.sendNotificationOnLike = functions.firestore
    .document("outfits/{postId}/likes/{likedBy}")
    .onCreate(async (snapshot, context) => {
      const postId = context.params.postId; // PARAMS: postId, likedBy
      const likedBy = context.params.likedBy;
      const postSnapshot = await admin.firestore().collection("outfits")
          .doc(postId).get();
      const userSnapshot = await admin.firestore().collection("users")
          .doc(likedBy).get();
      const user = userSnapshot.data(); // DATA: post, user
      const post = postSnapshot.data();
      const postedBy = post.postedBy; // PROPERTIES: postedBy, likedByUser
      const likedByUser = user.username;
      const postedBySnapshot = await admin.firestore().collection("users")
          .doc(postedBy).get(); // SNAPSHOTS: postedBy
      const postedByUser = postedBySnapshot.data(); // DATA: postedByUser
      const expoPushToken = postedByUser.expoPushToken;
      if (!expoPushToken) { // PROPERTIES: expoPushToken
        console.log("El usuario no tiene un token de notificación");
        return;
      }
      const message = { // We send the notification
        to: expoPushToken,
        sound: "default",
        title: "¡Nuevo Me Gusta! 🥳",
        body: `A ${likedByUser} le ha gustado tu foto`,
        data: {data: "goes here"},
      };
      // Use Axios to send the push notification through Expo"s API
      return axios.post("https://exp.host/--/api/v2/push/send", message)
          .then((response) => {
            console.log("Notificación enviada exitosamente:", response.data);
          })
          .catch((error) => {
            console.log("Error enviando la notificación:", error);
          });
    });

exports.createNotificationOnOutfitLike = functions.firestore
    .document("outfits/{outfitId}/likes/{likeId}")
    .onWrite(async (change, context) => {
      const outfitId = context.params.outfitId;
      const likeId = context.params.likeId;
      // Obtén el documento del usuario que dio el like
      const likedByUserDoc = await admin.firestore()
          .doc(`users/${likeId}`).get();
      // Obtén el username del usuario que dio el like
      const likedByUserName = likedByUserDoc.data().username;
      // Obtén el id del usuario que publicó el outfit
      const outfitDoc = await admin.firestore()
          .doc(`outfits/${outfitId}`).get();
      const outfitUserId = outfitDoc.data().postedBy;
      // Crear el id para el documento de notificación
      const notificationId = `like_${likeId}`;
      // Obtén la referencia al documento de notificación (si existe)
      const notificationRef = admin.firestore()
          .doc(`users/${outfitUserId}/notifications/${notificationId}`);
      // Si el documento "like" fue eliminado
      if (!change.after.exists) {
        // Elimina la notificación
        return notificationRef.delete();
      } else {
        // Obtén el documento del outfit
        const outfitDoc = await admin.firestore()
            .doc(`outfits/${outfitId}`).get();
        // Crear o actualizar el documento en la subcolección
        // "notifications" del usuario con los campos "type", "by",
        // "byUsername", "outfitId" y "outfitImageUrl"
        const notificationData = {
          type: "like",
          by: likeId,
          byUsername: likedByUserName,
          outfitId: outfitId,
          outfitImageUrl: outfitDoc.data().icon,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        return notificationRef.set(notificationData);
      }
    });

exports.onOutfitCreated = functions.firestore
    .document("outfits/{outfitId}")
    .onCreate(async (snap, context) => {
      const outfitData = snap.data();
      const imageUrl = outfitData.imageUrl;
      const fileName = path.basename(imageUrl);
      const bucket = admin.storage().bucket();
      try {
        // Descarga la imagen
        const response = await axios
            .get(imageUrl, {responseType: "arraybuffer"});
        const buffer = Buffer.from(response.data, "binary");
        // Redimensiona la imagen para thumbnail
        const thumbFilePath = path
            .join(os.tmpdir(), `${THUMB_PREFIX}${fileName}`);
        await sharp(buffer)
            .rotate()
            .resize({
              height: THUMB_MAX_HEIGHT,
              fit: sharp.fit.inside,
            })
            .toFile(thumbFilePath);
        // Sube la imagen redimensionada a Firebase Storage
        const thumbFileName = `${THUMB_PREFIX}${fileName}`;
        const thumbStoragePath = path.join("thumbnails", thumbFileName);
        await bucket.upload(thumbFilePath, {
          destination: thumbStoragePath,
          metadata: {
            contentType: "image/png",
          },
        });
        // Borra el archivo temporal
        fs.unlinkSync(thumbFilePath);
        // Obtiene la URL de la imagen redimensionada
        const thumbFile = bucket.file(thumbStoragePath);
        const [thumbnailUrl] = await thumbFile.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });
        // Redimensiona la imagen para icon
        const iconFilePath = path
            .join(os.tmpdir(), `${ICON_PREFIX}${fileName}`);
        await sharp(buffer)
            .rotate()
            .resize({
              height: ICON_MAX_HEIGHT,
              fit: sharp.fit.inside,
            })
            .toFile(iconFilePath);
        // Sube la imagen redimensionada a Firebase Storage
        const iconFileName = `${ICON_PREFIX}${fileName}`;
        const iconStoragePath = path.join("icons", iconFileName);
        await bucket.upload(iconFilePath, {
          destination: iconStoragePath,
          metadata: {
            contentType: "image/png",
          },
        });
        // Borra el archivo temporal
        fs.unlinkSync(iconFilePath);
        // Obtiene la URL de la imagen redimensionada
        const iconFile = bucket.file(iconStoragePath);
        const [iconUrl] = await iconFile.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });
        // Actualiza el documento con las URL de las imágenes redimensionadas
        await snap.ref.update({
          thumbnail: thumbnailUrl,
          icon: iconUrl,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    });

exports.incrementMessageCount = functions.firestore
    .document("conversations/{conversationId}/messages/{messageId}")
    .onCreate(async (snapshot, context) => {
      // Obtener el ID de la conversación desde los parámetros
      const conversationId = context.params.conversationId;

      // Obtener el contenido del mensaje desde el snapshot
      const messageData = snapshot.data();
      const lastMessageText = messageData.text;
      const lastMessageSender = messageData.user;

      // Obtener una referencia al documento de la conversación
      const conversationRef = admin.firestore()
          .collection("conversations").doc(conversationId);

      // Actualizar el documento de la conversación
      // con los campos lastMessageText y lastMessageSender
      return conversationRef.update({
        messageCount: admin.firestore.FieldValue.increment(1),
        lastMessageText: lastMessageText,
        lastMessageSender: lastMessageSender,
      });
    });


exports.sendNotificationOnMessage = functions.firestore
    .document("conversations/{conversationId}/messages/{messageId}")
    .onCreate(async (snapshot, context) => {
      const messageData = snapshot.data();
      const senderUserId = messageData.user; // El usuario que creó el mensaje
      const messageText = messageData.text; // El texto del mensaje
      const conversationId = context.params.conversationId;

      // Obtener el documento de usuario para el senderUserId
      const senderUserRef = admin.firestore()
          .collection("users").doc(senderUserId);
      const senderUserSnapshot = await senderUserRef.get();
      const senderUserData = senderUserSnapshot.data();
      const senderUsername = senderUserData.username;

      // Obtener el documento de la conversación para acceder al arreglo 'users'
      const conversationRef = admin.firestore()
          .collection("conversations").doc(conversationId);
      const conversationSnapshot = await conversationRef.get();
      const conversationData = conversationSnapshot.data();
      const usersArray = conversationData.users;
      // Filtrar el usuario que creó el mensaje
      const recipientUserIds = usersArray
          .filter((userId) => userId !== senderUserId);

      // Iterar sobre los usuarios restantes y enviar la notificación
      const promises = recipientUserIds.map(async (userId) => {
        const userRef = admin.firestore().collection("users").doc(userId);
        const userSnapshot = await userRef.get();
        const userData = userSnapshot.data();
        const expoPushToken = userData.expoPushToken;

        const message = {
          to: expoPushToken,
          sound: "default",
          title: `@${senderUsername} te ha enviado un mensaje 💭`,
          body: messageText,
          data: {data: "goes here"},
        };

        return axios.post("https://exp.host/--/api/v2/push/send", message)
            .then((response) => {
              console.log("Notificación enviada exitosamente:", response.data);
            })
            .catch((error) => {
              console.log("Error enviando la notificación:", error);
            });
      });

      // Esperar a que todas las promesas se resuelvan
      return Promise.all(promises);
    });
