import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const updatePostLikeCount = functions.firestore
  .document("outfits/{outfitId}/likes/{likeId}")
  .onWrite(async (change, context) => {
    const outfitId = context.params.outfitId;
    const docRef = admin.firestore().collection("outfits").doc(outfitId);

    // Obtén la colección de likes
    const likesSnapshot = await docRef.collection("likes").get();

    // Actualiza el contador de likes
    return docRef.update({"likeCount": likesSnapshot.size});
  });

export const updateUserLikeCount = functions.firestore
  .document("users/{userId}/likes/{likeId}")
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const docRef = admin.firestore().collection("users").doc(userId);

    // Obtén la colección de likes
    const likesSnapshot = await docRef.collection("likes").get();

    // Actualiza el contador de likes
    return docRef.update({"likeCount": likesSnapshot.size});
  });

export const updateUserViewCount = functions.firestore
  .document("users/{userId}/views/{viewId}")
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const docRef = admin.firestore().collection("users").doc(userId);

    // Obtén la colección de views
    const viewsSnapshot = await docRef.collection("views").get();

    // Actualiza el contador de views
    return docRef.update({"viewCount": viewsSnapshot.size});
  });

export const updatePostViewCount = functions.firestore
  .document("outfits/{outfitId}/views/{viewId}")
  .onWrite(async (change, context) => {
    const outfitId = context.params.outfitId;
    const docRef = admin.firestore().collection("outfits").doc(outfitId);

    // Obtén la colección de views
    const viewsSnapshot = await docRef.collection("views").get();

    // Actualiza el contador de views
    return docRef.update({"viewCount": viewsSnapshot.size});
  });

export const deleteUserOutfits = functions.firestore
  .document("users/{userId}")
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    // Obtén la referencia a la colección 'outfits'
    const outfitsRef = admin.firestore().collection("outfits");

    // Obtén todos los documentos en 'outfits' donde
    // 'postedBy' sea igual a 'userId'
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
