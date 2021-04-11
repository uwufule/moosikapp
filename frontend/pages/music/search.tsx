import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import SearchBox from '../../components/Music/SearchBox';
import SongList from '../../components/Music/SongList';
import { pushAlert } from '../../redux/alert/actions';
import {
  clearSongList,
  clearSongsSource,
  fetchSongs,
  setSearchSongsSource,
} from '../../redux/songs/actions';
import { selectFetchSongsStatus } from '../../redux/songs/selectors';

const MusicSearch: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>(router.query.query?.toString() ?? '');

  const success = useSelector(selectFetchSongsStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSongsSource());
    dispatch(clearSongList());
  }, []);

  useEffect(() => {
    if (query.length === 0) {
      return;
    }

    if (query.length < 2) {
      dispatch(pushAlert('Minimum query length is 2.', 'error'));
      return;
    }

    dispatch(setSearchSongsSource({ skip: 0, scope: 1, query }));
    dispatch(fetchSongs());
  }, [query]);

  return (
    <Layout>
      <SearchBox initialValue={query} onChange={setQuery} />
      <SongList isSearching={query.length < 2 || success} />
    </Layout>
  );
};

export default MusicSearch;
