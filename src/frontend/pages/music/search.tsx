import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useRequest from '@hooks/useRequest';
import { setSongList } from '@redux/player/actions';
import { Song } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Nav, SongList, SearchBox } from '@components/Music';
import useRestriction from '../../hooks/useRestriction';

const MusicSearch = () => {
  const router = useRouter();

  const [query, setQuery] = useState<string>(
    typeof router.query.query === 'string' ? router.query.query : '',
  );
  const [searching, setSearching] = useState(false);

  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  const { authRequest } = useRequest();

  const songs = useSelector<RootState, Song[]>((state) => state.player.songList);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSongList([]));

    const asyncEffect = async () => {
      setSearching(true);

      try {
        const res = await authRequest('/songs/search?scope=1', {
          method: 'GET',
          params: {
            query,
          },
        });

        dispatch(setSongList(res.data.songs));
      } catch (e) {
        if (e.response?.status !== 404) {
          // error message (e.response.data)
        }

        dispatch(setSongList([]));
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
      <SearchBox
        initialQuery={typeof router.query.query === 'string' ? router.query.query : ''}
        handler={setQuery}
      />
      <SongList songs={songs} searching={query.length < 2 || searching} />
    </section>
  );
};

export default MusicSearch;
