export interface SongData {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  favorite?: boolean;
  edit?: boolean;
}

export interface DetailedSongData extends SongData {
  url: string;
  uploadedBy: string;
  createdAt: Date;
}
