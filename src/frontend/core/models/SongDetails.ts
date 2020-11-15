import Song from './Song';

interface SongDetails extends Song {
  url: string;
  uploadedBy: string;
  createdAt: Date;
}

export default SongDetails;
