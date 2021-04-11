import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Maybe } from 'yup/lib/types';
import { validateAudioFiles } from '../../core/services/validators';
import { pushAlert } from '../../redux/alert/actions';
import FileDropArea from './FileDropArea';
import SongUploader from './SongUploader';

const SongUploadContainer = styled.div`
  padding: 10px;
  background: #1b1d27;
`;

const SongUploadList = styled.div``;

const SongUploadForm: React.FC = () => {
  const [songList, setSongList] = useState<File[]>([]);

  const dispatch = useDispatch();

  const pushItemsToSongList = async (fileList: Maybe<FileList>) => {
    if (fileList) {
      try {
        const result = await validateAudioFiles.validate([...fileList]);
        if (!result) {
          throw new Error('No files');
        }

        setSongList((list) => [...list, ...result]);
      } catch (e) {
        dispatch(pushAlert(e.message, 'error'));
      }
    }
  };

  return (
    <SongUploadContainer>
      <FileDropArea onChange={pushItemsToSongList} />
      {songList.length > 0 && (
        <SongUploadList>
          {songList.map((song, index) => (
            <SongUploader key={index} song={song} />
          ))}
        </SongUploadList>
      )}
    </SongUploadContainer>
  );
};

export default SongUploadForm;
