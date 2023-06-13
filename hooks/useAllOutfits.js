import { useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const useAllOutfits = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [outfits, setOutfits] = useState([]);

  const outfitsQuery = query(collection(db, 'outfits'), orderBy('createdAt', 'desc'));

  useEffect(() => {
    console.log('useAllOutfits useEffect')
    const unsubscribe = onSnapshot(outfitsQuery, 
      (snapshot) => {
        console.log('onSnapshot')
        const newOutfits = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const filteredReportedOutfits = filterReportedOutfits(newOutfits);
        setOutfits(filteredReportedOutfits);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setError(true);
        setLoading(false);
      }
    );
  
    const filterReportedOutfits = (outfits) => {
        console.log('filterReportedOutfits')
        return outfits.filter(outfit => !outfit.reported);
    };
    // Desmontar la escucha cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return { loading, error, outfits, setOutfits };
};

export default useAllOutfits;
