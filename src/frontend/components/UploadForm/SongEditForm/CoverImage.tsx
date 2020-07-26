import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

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
