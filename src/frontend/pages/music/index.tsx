import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useRestriction from '../../hooks/useRestriction';
import useAuthorizedRequest from '../../hooks/useAuthorizedRequest';
import { Nav, SongList } from '../../components/Music';
import { setSongs } from '../../redux/player/actions';
import { RootState } from '../../redux/store';
import { SongData } from '../../redux/player/types';

const MusicIndex = () => {
  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  const request = useAuthorizedRequest();

  const songs = useSelector<RootState, SongData[]>((state) => state.player.songList);

  const dispatch = useDispatch();

  useEffect(() => {
    const asyncEffect = async () => {
      try {
        const res = await request('/songs', {
          method: 'GET',
        });

        dispatch(setSongs(res.data.songs));
      } catch (e) {
        if (e.response?.status !== 404) {
          // error message (e.response.data)
        }

        dispatch(setSongs([]));
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

export default MusicIndex;
