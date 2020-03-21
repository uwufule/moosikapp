import { Nav, SearchForm, SongList } from '../../components/Music';

const MusicSearch = () => (
  <section>
    <Nav />
    <SearchForm handler={() => {}} />
    <SongList songs={[]} searching />
  </section>
);

export default MusicSearch;
