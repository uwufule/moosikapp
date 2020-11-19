import SongEditForm from '@components/SongEditForm';
import { Theme } from '@components/ThemeProvider';
import UploadProgressEvent from '@core/services/api/interfaces/UploadProgressEvent';
import useUploadSong from '@hooks/useUploadSong';
import { showErrorMessage } from '@redux/modal/actions';
import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const FileUploaderWrapper = styled.div`
  margin-bottom: 16px;
  background: ${(props: Theme) => props.theme.uploadForm.uploadFile.background};

  &:last-child {
    margin-bottom: 0;
  }
`;

type ProgressBarProps = Theme<{ progress: number }>;

const ProgressBar = styled.div`
  height: 24px;
  position: relative;
`;

const setProgress = (props: ProgressBarProps) => ({ style: { width: `${props.progress}%` } });
const ProgressBarActive = styled.div.attrs(setProgress)`
  min-width: 0px;
  max-width: 100%;
  height: 100%;
  position: absolute;
  background: ${(props: ProgressBarProps) =>
    props.theme.uploadForm.uploadFile.progressBar.foreground};
`;

const FileNameContainer = styled.div`
  position: relative;
  padding: 0 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${(props: Theme) => props.theme.uploadForm.uploadFile.title};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  z-index: 1;
`;

interface FileUploaderProps {
  file: File;
}

const FileUploader = ({ file }: FileUploaderProps) => {
  const [songId, setSongId] = React.useState<string>();
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);

  const dispatch = useDispatch();

  const uploadSong = useUploadSong();

  const onUploadProgress = (progress: UploadProgressEvent) => {
    setUploadProgress((progress.loaded / progress.total) * 100);
  };

  React.useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const upload = async () => {
      try {
        const id = await uploadSong(file, onUploadProgress, cancelToken.token);
        setSongId(id);
      } catch (e) {
        dispatch(showErrorMessage(e.message));
      }
    };

    upload();

    return () => {
      if (!songId) {
        cancelToken.cancel();
      }
    };
  }, []);

  return (
    <FileUploaderWrapper>
      <ProgressBar>
        <ProgressBarActive progress={uploadProgress} />
        <FileNameContainer>{file.name}</FileNameContainer>
      </ProgressBar>
      {songId && <SongEditForm songId={songId} />}
    </FileUploaderWrapper>
  );
};

export default React.memo(FileUploader, (prev, next) => prev.file.name === next.file.name);
