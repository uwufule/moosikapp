export interface UploadProgressEvent {
  loaded: number;
  total: number;
}

export interface OnUploadProgress {
  (event: UploadProgressEvent): void;
}
