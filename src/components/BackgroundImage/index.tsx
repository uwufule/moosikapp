import styled from 'styled-components';

import jpg from './images/bg.jpg';
import webp from './images/bg.webp';

const BackgroundImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  user-select: none;
  z-index: -1;
`;

const BackgroundImage = styled.img`
  min-width: calc(100% + 20px);
  min-height: calc(100% + 20px);
  position: absolute;
  left: -10px;
  top: -10px;
  filter: blur(5px) brightness(.75);
  pointer-events: none;
`;

export default () => (
  <BackgroundImageContainer>
    <picture>
      <source srcSet={webp} type="image/webp" />
      <BackgroundImage src={jpg} alt="background" />
    </picture>
  </BackgroundImageContainer>
);
