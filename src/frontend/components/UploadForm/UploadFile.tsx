import { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import useRequest from '@hooks/useRequest';
import useErrorHandler from '@hooks/useErrorHandler';
import { UploadProgressEvent } from '@utils/request';
import { Theme } from '@components/ThemeProvider';
import SongEditForm from './SongEditForm';

const UploadFileWrapper = styled.div`
  margin-bottom: 16px;
  background: ${(props: Theme) => props.theme.uploadForm.uploadFile.background};

  &:last-child {
    margin-bottom: 0;
  }
`;

type ProgressBarProps = Theme<{ percent: number }>;

const ProgressBar = styled.div`
  height: 24px;
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const setWidth = (props: ProgressBarProps) => ({ style: { width: `${props.percent}%` } });
const ProgressBarActive = styled.div.attrs(setWidth)`
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
  const [percent, setPercent] = useState<number>(0);

  const { authRequest } = useRequest();

  const handleError = useErrorHandler();

  const onUploadProgress = (progress: UploadProgressEvent) => {
    setPercent((progress.loaded / progress.total) * 100);
  };

  useEffect(() => {
    const cancelationToken = axios.CancelToken.source();

    handleError(async () => {
      const res = await authRequest('/songs', {
        method: 'POST',
        headers: {
          'content-type': file.type,
        },
        data: file,
        cancelToken: cancelationToken.token,
        onUploadProgress,
      });

      setSongId(res.data.result.id);
    });

    return () => {
      if (!songId) {
        cancelationToken.cancel();
      }
    };
  }, []);

  return (
    <UploadFileWrapper>
      <ProgressBar>
        <ProgressBarActive percent={percent} />
        <FileName>{file.name}</FileName>
      </ProgressBar>
      {songId && <SongEditForm songId={songId} />}
    </UploadFileWrapper>
  );
};

export default memo(
  UploadFile,
  (prevProps, nextProps) =>
    prevProps.file.name === nextProps.file.name && prevProps.file.size === nextProps.file.size,
);
