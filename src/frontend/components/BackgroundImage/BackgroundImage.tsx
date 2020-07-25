import styled from 'styled-components';

import jpg from './images/bg.jpg';
import webp from './images/bg.webp';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  user-select: none;
  z-index: -1;
`;

const Image = styled.img`
  min-width: calc(100% + 60px);
  min-height: calc(100% + 60px);
  position: absolute;
  left: -30px;
  top: -30px;
  filter: blur(15px) brightness(0.55);
  pointer-events: none;
`;

const BackgroundImage = () => (
  <Wrapper>
    <picture>
      <source srcSet={webp} type="image/webp" />
      <Image src={jpg} alt="background" />
    </picture>
  </Wrapper>
);

export default BackgroundImage;
