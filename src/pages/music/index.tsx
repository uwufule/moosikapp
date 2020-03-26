import useWithAuthorization from '../../hooks/useWithAuthorization';
import { Nav, SongList } from '../../components/Music';

const MusicIndex = () => {
  useWithAuthorization();

  return (
    <section>
      <Nav />
      <SongList songs={[]} />
    </section>
  );
};

export default MusicIndex;
