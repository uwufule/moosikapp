import SongData from './SongData';

interface DetaiedSongData extends SongData {
  url: string;
  uploadedBy: string;
  createdAt: Date;
}

export default DetaiedSongData;
