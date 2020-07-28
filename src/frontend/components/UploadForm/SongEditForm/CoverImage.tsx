import { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import useRequest from '@hooks/useRequest';
import { Theme } from '@components/ThemeProvider';
import PickImageButton from './PickImageButton';
import Loader from './Loader';

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
  const [cover, setCover] = useState<File | null>(null);
  const [isCoverLoading, setIsCoverLoading] = useState<boolean>(false);

  const { authRequest } = useRequest();

  const onCoverUpdate = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.item(0);
    if (!image) {
      return;
    }

    if (!/image\/(png|jpeg)/.test(image.type)) {
      return;
    }

    if (image.size > 1024 * 1024) {
      return;
    }

    try {
      setIsCoverLoading(true);
      setCover(image);

      await authRequest(`/songs/${songId}/cover`, {
        method: 'PUT',
        data: image,
        headers: { 'content-type': image.type },
      });

      setIsCoverLoading(false);
    } catch (e) {
      // e.response.data.message
    }
  };

  return (
    <ImageContainer>
      {cover && <Image url={URL.createObjectURL(cover)} blurred={isCoverLoading} />}
      <PickImageButton onChange={onCoverUpdate} />
      {isCoverLoading && <Loader />}
    </ImageContainer>
  );
};

export default CoverImage;
