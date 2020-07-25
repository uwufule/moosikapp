import { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import useRequest from '@hooks/useRequest';
import { UploadProgressEvent } from '@utils/request';
import { Theme } from '@components/ThemeProvider';
import SongEditForm from './SongEditForm';

const UploadFileWrapper = styled.div`
  margin-bottom: 8px;
  background: ${(props: Theme) => props.theme.colors.accentBackground};

  &::last-child {
    margin-bottom: 0;
  }
`;

type ProgressBarProps = Theme<{ percent: number }>;

const ProgressBar = styled.div`
  height: 24px;
  position: relative;
`;

const setWidth = (props: ProgressBarProps) => ({ style: { width: `${props.percent}%` } });
const ProgressBarActive = styled.div.attrs(setWidth)`
  min-width: 0px;
  max-width: 100%;
  height: 100%;
  position: absolute;
  background: ${(props: ProgressBarProps) => props.theme.colors.accent};
`;

const FileName = styled.span`
  position: relative;
  margin-left: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.colors.primary};
  z-index: 1;
`;

interface UploadProgressProps {
  file: File;
}

const UploadFile = ({ file }: UploadProgressProps) => {
  const [songUuid, setSongUuid] = useState<string>('');
  const [percent, setPercent] = useState<number>(0);

  const { authRequest } = useRequest();

  const onUploadProgress = (progress: UploadProgressEvent) => {
    setPercent((progress.loaded / progress.total) * 100);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();

    const upload = async () => {
      try {
        const res = await authRequest('/songs', {
          method: 'POST',
          headers: {
            'content-type': file.type,
          },
          data: file,
          cancelToken: source.token,
          onUploadProgress,
        });

        setSongUuid(res.data.uuid);
      } catch (e) {
        // e.response.data.message
      }
    };

    upload();

    return () => {
      if (!songUuid) {
        source.cancel();
      }
    };
  }, []);

  return (
    <UploadFileWrapper>
      <ProgressBar>
        <ProgressBarActive percent={percent} />
        <FileName>{file.name}</FileName>
      </ProgressBar>
      {songUuid && <SongEditForm songUuid={songUuid} />}
    </UploadFileWrapper>
  );
};

export default memo(
  UploadFile,
  (prevProps, nextProps) =>
    prevProps.file.name === nextProps.file.name && prevProps.file.size === nextProps.file.size,
);
