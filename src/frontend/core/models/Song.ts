interface Song {
  id: string;
  author: string;
  title: string;
  cover: string;
  edit?: boolean;
  favorite?: boolean;
}

export default Song;
