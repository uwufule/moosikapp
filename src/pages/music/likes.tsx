import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Nav, SongList } from '../../components/Music';
import { RootState } from '../../redux/store';

const MusicLikes = () => {
  const accessToken = useSelector<RootState, string>((state) => state.login.accessToken);

  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken]);

  return (
    <section>
      <Nav />
      <SongList songs={[]} />
    </section>
  );
};

export default MusicLikes;
