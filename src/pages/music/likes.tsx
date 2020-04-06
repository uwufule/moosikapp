import { useState, useEffect } from 'react';
import useRestriction from '../../hooks/useRestriction';
import useAuthorizedRequest from '../../hooks/useAuthorizedRequest';
import { Nav, SongList } from '../../components/Music';

const MusicLikes = () => {
  const [songs, setSongs] = useState([]);

  const restriction = useRestriction();
  restriction.allowOnlyAuthorizedUser();

  const request = useAuthorizedRequest();

  useEffect(() => {
    const asyncEffect = async () => {
      try {
        const res = await request('/favorites', {
          method: 'GET',
        });

        setSongs(res.data.songs);
      } catch (e) {
        if (e.response?.status !== 404) {
          // error message (e.response.data)
        }

        setSongs([]);
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
