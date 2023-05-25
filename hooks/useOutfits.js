// import { useState, useEffect } from 'react';
// import { auth, db } from '../firebaseConfig';
// import { collection, doc, getDocs, orderBy, query, setDoc, serverTimestamp, where, getDoc } from 'firebase/firestore';

// // Fetches outfits based on the provided query
// async function fetchAndProcessOutfits(query) {
//   const querySnapshot = await getDocs(query);
//   return processQuerySnapshot(querySnapshot);
// }

// // Processes a query snapshot and return an array of outfits
// function processQuerySnapshot(querySnapshot) {
//   const fetchedOutfits = [];

//   querySnapshot.forEach((doc) => {
//     fetchedOutfits.push({
//       id: doc.id,
//       ...doc.data(),
//     });
//   });

//   return fetchedOutfits;
// }

// // Fetches the user's data from Firestore
// async function getUserData(userId) {
//   const userDoc = doc(db, 'users', userId);
//   const userDocSnapshot = await getDoc(userDoc);
  
//   return userDocSnapshot.data() || {};
// }

// // Registers the last time the user was active
// async function registerLastTimeActive() {
//   if (!auth.currentUser) {
//     return;
//   }

//   const userDoc = doc(db, 'users', auth.currentUser.uid);
//   await setDoc(userDoc, {
//     lastTimeActive: serverTimestamp(),
//   }, { merge: true });
// }

// export default function useOutfits() {
//   const [outfits, setOutfits] = useState([]);
//   const [loadingOutfits, setLoadingOutfits] = useState(true);
//   const [errorMessageLoadingOutfits, setErrorMessageLoadingOutfits] = useState(null);

//   const fetchOutfits = async () => {
//     setLoadingOutfits(true);
//     let fetchedOutfits = [];
  
//     try {
//       if (auth.currentUser) {
//         // Retrieve user data and register last active time
//         const userData = await getUserData(auth.currentUser.uid);
//         await registerLastTimeActive();
  
//         let lastActiveTime = userData.lastTimeActive || null;
//         let outfitsQuery;
  
//         if (lastActiveTime) {
//           // Fetch outfits created after the last active time
//           outfitsQuery = query(
//             collection(db, "outfits"),
//             where("createdAt", ">", lastActiveTime),
//             orderBy("createdAt"),
//             orderBy("likeCount", "desc")
//           );
          
//           const newOutfits = await fetchAndProcessOutfits(outfitsQuery);
//           fetchedOutfits = [...fetchedOutfits, ...newOutfits];
  
//           // Fetch outfits created before or at the last active time
//           outfitsQuery = query(
//             collection(db, "outfits"),
//             where("createdAt", "<=", lastActiveTime),
//             orderBy("createdAt"),
//             orderBy("likeCount", "desc")
//           );
          
//           const oldOutfits = await fetchAndProcessOutfits(outfitsQuery);
//           fetchedOutfits = [...fetchedOutfits, ...oldOutfits];
//         } else {
//           // Fetch all outfits ordered by likeCount
//           outfitsQuery = query(
//             collection(db, "outfits"),
//             orderBy("likeCount", "desc")
//           );
//           fetchedOutfits = await fetchAndProcessOutfits(outfitsQuery);
//         }
//       } else {
//         // Fetch all outfits ordered by likeCount for unauthenticated users
//         const outfitsQuery = query(
//           collection(db, "outfits"),
//           orderBy("likeCount", "desc")
//         );
//         fetchedOutfits = await fetchAndProcessOutfits(outfitsQuery);
//       }
  
//       setOutfits(fetchedOutfits);
//     } catch (error) {
//       console.error(error);
//       throw error;
//     } finally {
//       setLoadingOutfits(false);
//     }
//   };

//   const refreshOutfits = async () => {
//         console.log("Refreshing outfits...")
//         return;
//         setOutfits([]);
//         await fetchOutfits();
//     };
  
//   useEffect(() => {
//     fetchOutfits().catch(error => setErrorMessage(error.message));
//   }, []);

//   return { outfits, loadingOutfits, errorMessageLoadingOutfits, setErrorMessageLoadingOutfits, setOutfits, refreshOutfits };
// }

