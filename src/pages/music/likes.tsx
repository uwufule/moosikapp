import Link from 'next/link';

const MusicLikes = () => (
  <div>
    <div>
      <Link href="/music">
        <a>All</a>
      </Link>
      <Link href="/music/likes">
        <a>Likes</a>
      </Link>
      <Link href="/music/search">
        <a>Search</a>
      </Link>
    </div>
    <div>Likes</div>
  </div>
);

export default MusicLikes;
