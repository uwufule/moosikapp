import SongEditForm from '@components/SongEditForm';
import { Theme } from '@components/ThemeProvider';
import UploadProgressEvent from '@core/services/api/interfaces/UploadProgressEvent';
import axios from 'axios';
import React, { memo, useState } from 'react';
import styled from 'styled-components';

const UploadFileWrapper = styled.div`
  margin-bottom: 16px;
  background: ${(props: Theme) => props.theme.uploadForm.uploadFile.background};

  &:last-child {
    margin-bottom: 0;
  }
`;

type ProgressBarProps = Theme<{ percents: number }>;

const ProgressBar = styled.div`
  height: 24px;
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const setProgress = (props: ProgressBarProps) => ({ style: { width: `${props.percents}%` } });
const ProgressBarActive = styled.div.attrs(setProgress)`
  min-width: 0px;
  max-width: 100%;
  height: 100%;
  position: absolute;
  background: ${(props: ProgressBarProps) =>
    props.theme.uploadForm.uploadFile.progressBar.foreground};
`;

const FileName = styled.span`
  position: relative;
  margin-left: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.uploadForm.uploadFile.title};
  z-index: 1;
`;

interface UploadProgressProps {
  file: File;
}

const UploadFile = ({ file }: UploadProgressProps) => {
  const [songId, setSongId] = useState<string>('');
  const [percents, setPercents] = useState<number>(0);

  const onUploadProgress = (progress: UploadProgressEvent) => {
    setPercents((progress.loaded / progress.total) * 100);
  };

  React.useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const uploadAsync = async () => {};

    uploadAsync();

    return () => {
      if (!songId) {
        cancelToken.cancel();
      }
    };
  }, []);

  return (
    <UploadFileWrapper>
      <ProgressBar>
        <ProgressBarActive percents={percents} />
        <FileName>{file.name}</FileName>
      </ProgressBar>
      {songId && <SongEditForm songId={songId} />}
    </UploadFileWrapper>
  );
};

export default memo(
  UploadFile,
  (prevProps, nextProps) => prevProps.file.name === nextProps.file.name,
);
