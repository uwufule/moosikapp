import { Theme } from '@components/ThemeProvider';
import useUpdateSong from '@hooks/useUpdateSong';
import { showErrorMessage } from '@redux/modal/actions';
import React, { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ImageSelectButton from './ImageSelectButton';
import Throbber from './Throbber';

const ImageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  max-width: 240px;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: ${(props: Theme) => props.theme.uploadForm.editForm.cover.background};

  @media (max-width: 640px) {
    & {
      align-self: center;
    }
  }
`;

type ImageProps = Theme<{ url: string; blurred: boolean }>;

const Image = styled.div.attrs((props: ImageProps) => ({
  style: {
    backgroundImage: props.url ? `url(${props.url})` : '',
    filter: props.blurred ? 'blur(4px) brightness(0.6)' : '',
  },
}))<ImageProps>`
  width: 104%;
  height: 104%;
  position: absolute;
  top: -2%;
  left: -2%;
  background-size: cover;
  background-position: center;
`;

interface CoverImageProps {
  songId: string;
}

const CoverImage = ({ songId }: CoverImageProps) => {
  const [coverFile, setCoverFile] = React.useState<File>();
  const [uploadInProgress, setUploadInProgress] = React.useState<boolean>(false);

  const dispatch = useDispatch();

  const methods = useUpdateSong();

  const onCoverUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.item(0);
    if (selectedFile) {
      setCoverFile(selectedFile);
    }
  };

  React.useEffect(() => {
    const updateCover = async () => {
      if (!coverFile) {
        return;
      }

      setUploadInProgress(true);

      try {
        await methods.updateCover(songId, coverFile);
      } catch (e) {
        dispatch(showErrorMessage(e.message));
      } finally {
        setUploadInProgress(false);
      }
    };

    updateCover();
  }, [coverFile]);

  const blobUri = React.useMemo(() => {
    return coverFile && URL.createObjectURL(coverFile);
  }, [coverFile]);

  return (
    <ImageContainer>
      {blobUri && <Image url={blobUri} blurred={uploadInProgress} />}
      <ImageSelectButton onChange={onCoverUpdate} />
      {uploadInProgress && <Throbber />}
    </ImageContainer>
  );
};

export default React.memo(CoverImage, (prev, next) => prev.songId === next.songId);
