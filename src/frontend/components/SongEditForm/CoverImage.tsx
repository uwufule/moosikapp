import { Theme } from '@components/ThemeProvider';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import Loader from './Loader';
import PickImageButton from './PickImageButton';

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
  const [cover, setCover] = React.useState<File | null>(null);
  const [isCoverUploaded, setIsCoverUploaded] = React.useState<boolean>(false);

  const onCoverUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.item(0);
    if (!image) {
      return;
    }

    const updateCoverAsync = async () => {};

    updateCoverAsync();
  };

  return (
    <ImageContainer>
      {cover && <Image url={URL.createObjectURL(cover)} blurred={isCoverUploaded} />}
      <PickImageButton onChange={onCoverUpdate} />
      {isCoverUploaded && <Loader />}
    </ImageContainer>
  );
};

export default CoverImage;
