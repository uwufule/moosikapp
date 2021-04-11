import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import SongList from '../../components/Music/SongList';
import { setAllSongsSource } from '../../redux/songs/actions';

const Music: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAllSongsSource({ skip: 0, scope: 3 }));
  }, []);

  return (
    <Layout>
      <SongList />
    </Layout>
  );
};

export default Music;
