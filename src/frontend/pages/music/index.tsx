import { Nav, SongList } from '@components/Music';
import useRestriction from '@hooks/useRestriction';
import { fetchSongs } from '@redux/songs/actions';
import React from 'react';
import { useDispatch } from 'react-redux';

const Music: React.FC = () => {
  const restriction = useRestriction();
  restriction.requireAuth();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchSongs({ scope: 3 }));
  }, []);

  return (
    <section>
      <Nav />
      <SongList />
    </section>
  );
};

export default Music;
