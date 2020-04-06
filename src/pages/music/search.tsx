import { useState, useEffect } from 'react';
import useRestriction from '../../hooks/useRestriction';
import useAuthorizedRequest from '../../hooks/useAuthorizedRequest';
import { Nav, SearchForm, SongList } from '../../components/Music';

const MusicSearch = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [songs, setSongs] = useState([]);

  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  const request = useAuthorizedRequest();

  useEffect(() => {
    const asyncEffect = async () => {
      setSearching(true);

      try {
        const res = await request('/songs/search', {
          method: 'GET',
          params: {
            query,
          },
        });

        setSongs(res.data.songs);
      } catch (e) {
        if (e.response?.status !== 404) {
          // error message (e.response.data)
        }

        setSongs([]);
      } finally {
        setSearching(false);
      }
    };

    if (query.length < 2) {
      // error message
      return;
    }

    asyncEffect();
  }, [query]);

  return (
    <section>
      <Nav />
      <SearchForm handler={setQuery} />
      <SongList songs={songs} searching={query.length < 2 || searching} />
    </section>
  );
};

export default MusicSearch;
