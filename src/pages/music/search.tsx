import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Nav, SearchForm, SongList } from '../../components/Music';
import { RootState } from '../../redux/store';

const MusicSearch = () => {
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
      <SearchForm handler={() => {}} />
      <SongList songs={[]} searching />
    </section>
  );
};

export default MusicSearch;
