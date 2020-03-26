import { useState, useEffect } from 'react';
import useWithAuthorization from '../../hooks/useWithAuthorization';
import useAuthorizedRequest from '../../hooks/useAuthorizedRequest';
import { Nav, SongList } from '../../components/Music';

const MusicIndex = () => {
  const [songs, setSongs] = useState([]);

  useWithAuthorization();

  const request = useAuthorizedRequest();

  useEffect(() => {
    const asyncEffect = async () => {
      try {
        const res = await request('/songs', {
          method: 'GET',
        });

        setSongs(res.data.songs);
      } catch (e) {
        if (e.response.status !== 404) {
          // error message
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

export default MusicIndex;
