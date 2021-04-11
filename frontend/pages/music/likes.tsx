import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import SongList from '../../components/Music/SongList';
import { setFavoriteSongsSource } from '../../redux/songs/actions';

const MusicLikes: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFavoriteSongsSource({ skip: 0, scope: 2 }));
  }, []);

  return (
    <Layout>
      <SongList />
    </Layout>
  );
};

export default MusicLikes;
