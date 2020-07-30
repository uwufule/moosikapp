import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useRequest from '@hooks/useRequest';
import useRestriction from '@hooks/useRestriction';
import useErrorHandler from '@hooks/useErrorHandler';
import { setSongList } from '@redux/player/actions';
import { Song } from '@redux/player/types';
import { RootState } from '@redux/store';
import { Nav, SongList } from '@components/Music';

const MusicLikes = () => {
  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  const { authRequest } = useRequest();

  const songs = useSelector<RootState, Song[]>((state) => state.player.songList);

  const dispatch = useDispatch();

  const handlerError = useErrorHandler(() => dispatch(setSongList([])));

  useEffect(() => {
    handlerError(async () => {
      const res = await authRequest('/favorites?scope=2', {
        method: 'GET',
      });

      dispatch(setSongList(res.data.songs));
    });
  }, []);

  return (
    <section>
      <Nav />
      <SongList songs={songs} />
    </section>
  );
};

export default MusicLikes;
