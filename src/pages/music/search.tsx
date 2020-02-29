import Link from 'next/link';

const MusicSearch = () => (
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
    <div>Search</div>
  </div>
);

export default MusicSearch;
