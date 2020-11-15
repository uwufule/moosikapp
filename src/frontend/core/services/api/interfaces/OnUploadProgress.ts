import UploadProgressEvent from './UploadProgressEvent';

interface OnUploadProgress {
  (progressEvent: UploadProgressEvent): void;
}

export default OnUploadProgress;
