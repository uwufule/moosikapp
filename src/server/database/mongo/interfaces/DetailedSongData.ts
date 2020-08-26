import GeneralSongData from './GeneralSongData';

interface DetailedSongData extends GeneralSongData {
  path: string;
  createdAt: Date;
}

export default DetailedSongData;
