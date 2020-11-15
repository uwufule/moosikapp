import { Nav, SongList } from '@components/Music';
import useRestriction from '@hooks/useRestriction';
import { fetchFavorites } from '@redux/songs/actions';
import React from 'react';
import { useDispatch } from 'react-redux';

const MusicLikes: React.FC = () => {
  const restriction = useRestriction();
  restriction.requireAuth();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchFavorites({ scope: 2 }));
  }, []);

  return (
    <section>
      <Nav />
      <SongList />
    </section>
  );
};

export default MusicLikes;
