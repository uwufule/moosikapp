import { Nav, SongList } from '@components/Music';
import useRestriction from '@hooks/useRestriction';
import { fetchSongs } from '@redux/songs/actions';
import debounce from 'lodash/debounce';
import React from 'react';
import { useDispatch } from 'react-redux';

const Music: React.FC = () => {
  const restriction = useRestriction();
  restriction.requireAuth();

  const dispatch = useDispatch();

  const handleScroll = React.useCallback(
    debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        dispatch(fetchSongs({ scope: 3 }));
      }
    }, 100),
    [],
  );

  React.useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    dispatch(fetchSongs({ skip: 0, scope: 3 }));

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section>
      <Nav />
      <SongList />
    </section>
  );
};

export default Music;
