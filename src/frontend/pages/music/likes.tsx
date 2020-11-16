import { Nav, SongList } from '@components/Music';
import useRestriction from '@hooks/useRestriction';
import { fetchFavorites } from '@redux/songs/actions';
import debounce from 'lodash/debounce';
import React from 'react';
import { useDispatch } from 'react-redux';

const MusicLikes: React.FC = () => {
  const restriction = useRestriction();
  restriction.requireAuth();

  const dispatch = useDispatch();

  const handleScroll = React.useCallback(
    debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        dispatch(fetchFavorites({ scope: 2 }));
      }
    }, 100),
    [],
  );

  React.useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    dispatch(fetchFavorites({ skip: 0, scope: 2 }));

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

export default MusicLikes;
