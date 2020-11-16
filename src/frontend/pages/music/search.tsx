import { Nav, SearchBox, SongList } from '@components/Music';
import useRestriction from '@hooks/useRestriction';
import { showErrorMessage } from '@redux/modal/actions';
import { searchSongs, setSongList } from '@redux/songs/actions';
import { selectSongsRetrieveStatus } from '@redux/songs/selectors';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MusicSearch: React.FC = () => {
  const restriction = useRestriction();
  restriction.requireAuth();

  const router = useRouter();

  const [query, setQuery] = React.useState<string>(
    typeof router.query.query === 'string' ? router.query.query : '',
  );

  const queryRef = React.useRef<string>(query);

  const success = useSelector(selectSongsRetrieveStatus);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setSongList([]));

    queryRef.current = query;

    if (query.length === 0) {
      return;
    }

    if (query.length < 2) {
      dispatch(showErrorMessage('Minimum query length is 2.'));
      return;
    }

    dispatch(searchSongs({ skip: 0, scope: 1, query }));
  }, [query]);

  const handleScroll = React.useCallback(
    debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        queryRef.current.length >= 2
      ) {
        dispatch(searchSongs({ scope: 1, query: queryRef.current }));
      }
    }, 100),
    [],
  );

  React.useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section>
      <Nav />
      <SearchBox initialValue={query} onValueChange={setQuery} />
      <SongList searching={query.length < 2 || success} />
    </section>
  );
};

export default MusicSearch;
