import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useRequest from '@hooks/useRequest';
import useRestriction from '@hooks/useRestriction';
import useErrorHandler from '@hooks/useErrorHandler';
import { setSongList } from '@redux/player/actions';
import { Song } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Nav, SongList } from '@components/Music';

const MusicIndex = () => {
  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  const { authRequest } = useRequest();

  const songs = useSelector<RootState, Song[]>((state) => state.player.songList);

  const dispatch = useDispatch();

  const handleError = useErrorHandler(() => dispatch(setSongList([])));

  useEffect(() => {
    handleError(async () => {
      const res = await authRequest('/songs?scope=3', {
        method: 'GET',
      });

      if (!res.data.result) {
        throw new Error('No songs.');
      }

      dispatch(setSongList(res.data.result));
    });
  }, []);

  return (
    <section>
      <Nav />
      <SongList songs={songs} />
    </section>
  );
};

export default MusicIndex;
