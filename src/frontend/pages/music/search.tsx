import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useRequest from '@hooks/useRequest';
import useRestriction from '@hooks/useRestriction';
import useErrorHandler from '@hooks/useErrorHandler';
import { setSongList } from '@redux/player/actions';
import { Song } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Nav, SongList, SearchBox } from '@components/Music';

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

  const handleError = useErrorHandler(
    () => dispatch(setSongList([])),
    () => setSearching(false),
  );

  useEffect(() => {
    dispatch(setSongList([]));

    if (query.length === 0) {
      return;
    }

    handleError(async () => {
      if (query.length < 2) {
        throw new Error('Minimum query length is 2.');
      }

      setSearching(true);

      const res = await authRequest('/songs/search?scope=1', {
        method: 'GET',
        params: {
          query,
        },
      });

      dispatch(setSongList(res.data.songs));
    });
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
