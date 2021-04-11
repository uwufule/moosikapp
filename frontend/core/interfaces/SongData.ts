interface SongData {
  id: string;
  author: string;
  title: string;
  cover: string;
  edit?: boolean;
  favorite?: boolean;
}

export default SongData;
