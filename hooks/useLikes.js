// import { useState, useEffect } from 'react';
// import { auth, db } from '../firebaseConfig';
// import { collection, doc, onSnapshot, getDoc } from 'firebase/firestore';
// import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

// export const useLikes = () => {
//   const [likedOutfits, setLikedOutfits] = useState([]);
//   const [isLoadingOutfits, setIsLoadingOutfits] = useState(true);

//   useEffect(() => {
//     const fetchLikes = async () => {
//       console.log("Fetching user likes...")
//       try {
//         setIsLoadingOutfits(true);
//         setLikedOutfits([]);
//         const userData = doc(db, "users", auth.currentUser.uid);
//         const likesCollection = collection(userData, "likes");
        
//         const unsubscribe = onSnapshot(likesCollection, async (snapshot) => {
//             const outfitIds = [];
//             snapshot.forEach((doc) => {
//                 outfitIds.push(doc.id);
//             });

//             if (outfitIds.length === 0) {
//                 console.log("User has no likes");
//                 setIsLoadingOutfits(false);
//                 return;
//             }


//             let likedOutfitsPromises = outfitIds.map(outfitId => {
//                 const outfitDoc = doc(db, "outfits", outfitId);
//                 return getDoc(outfitDoc).then((outfitSnapshot) => {
//                     if (outfitSnapshot.exists()) {
//                         return { id: outfitSnapshot.id, ...outfitSnapshot.data() }; // Aquí se agrega el ID del documento
//                     }
//                 });
//             });

//             let likedOutfits = await Promise.all(likedOutfitsPromises);
//             console.log("Liked outfits: ", likedOutfits);

//             setLikedOutfits(likedOutfits);
//             setIsLoadingOutfits(false);
//         });

//         return unsubscribe; // Remember to unsubscribe when the component unmounts

//     } catch (error) {
//         setIsLoadingOutfits(false);
//         console.log("Error getting user likes: ", error);
//     }
//   };
//   fetchLikes();
//   }, []);

//   const refreshLikes = () => {
//     console.log("Refreshing likes...");
//   };

//   return { likedOutfits, isLoadingOutfits, setLikedOutfits, refreshLikes };
// };
