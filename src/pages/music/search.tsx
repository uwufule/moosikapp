import useWithAuthorization from '../../hooks/useWithAuthorization';
import { Nav, SearchForm, SongList } from '../../components/Music';

const MusicSearch = () => {
  useWithAuthorization();

  return (
    <section>
      <Nav />
      <SearchForm handler={() => {}} />
      <SongList songs={[]} searching />
    </section>
  );
};

export default MusicSearch;
