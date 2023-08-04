import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch('2L363S5SIP', '7da00926958162e1cf09d1036a9e7379');
const index = searchClient.initIndex('vrip0');

const useAlgoliaSearch = () => {
  const [results, setResults] = useState([]);
  const [loadingAlgolia, setLoadingAlgolia] = useState(false);
  const [errorAlgolia, setErrorAlgolia] = useState(null);

  const search = async (query) => {
    setLoadingAlgolia(true);
    try {
      const { hits } = await index.search(query);
      setResults(hits);
    } catch (err) {
      setErrorAlgolia(err);
    } finally {
      setLoadingAlgolia(false);
    }
  };

  return { results, search, loadingAlgolia, errorAlgolia };
};

export default useAlgoliaSearch;
