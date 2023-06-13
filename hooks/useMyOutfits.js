import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const useMyOutfits = () => {
  const uid = auth.currentUser.uid;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const outfitsQuery = query(
      collection(db, 'outfits'), 
      where('postedBy', '==', uid), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(outfitsQuery,
      (snapshot) => {
        const newOutfits = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setOutfits(newOutfits);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setError(true);
        setLoading(false);
      }
    );

    // Detener la escucha cuando el componente se desmonte
    return () => unsubscribe();

  }, [uid]); // Agrega uid a la lista de dependencias para refrescar la consulta si cambia

  return { loading, error, outfits };
};

export default useMyOutfits;