import useWithAuthorization from '../../hooks/useWithAuthorization';
import { Nav, SongList } from '../../components/Music';

const MusicLikes = () => {
  useWithAuthorization();

  return (
    <section>
      <Nav />
      <SongList songs={[]} />
    </section>
  );
};

export default MusicLikes;
