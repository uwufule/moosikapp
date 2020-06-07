import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useRequest from '@hooks/useRequest';
import { setSongList } from '@redux/player/actions';
import { Song } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Nav, SongList } from '@components/Music';
import useRestriction from '../../hooks/useRestriction';
import useAuthorizedRequest from '../../hooks/useAuthorizedRequest';
import { Nav, SongList } from '../../components/Music';
import { setSongList } from '../../redux/player/actions';
import { RootState } from '../../redux/store';
import { Song } from '../../redux/player/types';

const MusicLikes = () => {
  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  const request = useAuthorizedRequest();

  const songs = useSelector<RootState, Song[]>((state) => state.player.songList);

  const dispatch = useDispatch();

  useEffect(() => {
    const asyncEffect = async () => {
      try {
        const res = await request('/favorites', {
          method: 'GET',
        });

        dispatch(setSongList(res.data.songs));
      } catch (e) {
        if (e.response?.status !== 404) {
          // error message (e.response.data)
        }

        dispatch(setSongList([]));
      }
    };

    asyncEffect();
  }, []);

  return (
    <section>
      <Nav />
      <SongList songs={songs} />
    </section>
  );
};

export default MusicLikes;
