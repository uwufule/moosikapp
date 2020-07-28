import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

export const CoverImageContainer = styled.div`
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

type CoverImageProps = Theme<{ imageUrl: string; blurred: boolean }>;

const CoverImage = styled.div.attrs((props: CoverImageProps) => ({
  style: {
    backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : '',
    filter: props.blurred ? 'blur(4px) brightness(0.6)' : '',
  },
}))<CoverImageProps>`
  width: 104%;
  height: 104%;
  position: absolute;
  top: -2%;
  left: -2%;
  background-size: cover;
  background-position: center;
`;

export default CoverImage;
