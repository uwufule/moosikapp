import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectAccessToken, selectUserData } from '../../redux/auth/selectors';
import SongEditForm from '../SongEditForm';
import * as songsApi from '../../core/services/api/songs';
import axios from 'axios';
import { pushAlert } from '../../redux/alert/actions';
import { Maybe } from 'yup/lib/types';

const SongUploaderContainer = styled.div`
  /* background: #1d1f2b; */
  border-radius: 2px;
  box-shadow: 0 0 2px #000;
  overflow: hidden;
`;

interface SongUploaderProgressBarProps {
  progress: number;
}

const SongUploaderProgressBarContainer = styled.div`
  position: relative;
  padding: 0 1rem;
`;

const SongUploaderProgressBar = styled.div.attrs((props: SongUploaderProgressBarProps) => ({
  style: { width: `${100 * props.progress}%` },
}))<SongUploaderProgressBarProps>`
  min-width: 0;
  max-width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: #4f82d1;
  transition: 200ms ease all;
  z-index: 0;
`;

const SongName = styled.span`
  position: relative;
  color: #fff;
  line-height: 1.5;
  z-index: 1;
`;

const SongUploader: React.FC<{ song: File }> = ({ song }) => {
  const [progress, setProgress] = useState(0);
  const [songId, setSongId] = useState<Maybe<string>>();

  const accessToken = useSelector(selectAccessToken);
  const userData = useSelector(selectUserData);

  const dispatch = useDispatch();

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const upload = async () => {
      try {
        const result = await songsApi.uploadSong(
          accessToken,
          song,
          (event) => setProgress(event.loaded / event.total),
          cancelToken.token,
        );

        setSongId(result.id);
      } catch (e) {
        dispatch(pushAlert(e.message, 'error'));
      }
    };

    upload();

    return () => {
      cancelToken.cancel();
    };
  }, []);

  return (
    <SongUploaderContainer>
      <SongUploaderProgressBarContainer>
        <SongUploaderProgressBar progress={progress} />
        <SongName>{song.name}</SongName>
      </SongUploaderProgressBarContainer>
      {typeof songId === 'string' && (
        <SongEditForm
          songId={songId}
          songAuthor={userData?.username}
          songTitle={song.name.replace('.mp3', '')}
        />
      )}
    </SongUploaderContainer>
  );
};

export default SongUploader;
