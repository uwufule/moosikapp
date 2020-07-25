import styled from 'styled-components';

import jpg from './images/bg.jpg';
import webp from './images/bg.webp';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  background: #000000;
  overflow: hidden;
  user-select: none;
  z-index: -1;
`;

const Image = styled.img`
  min-width: 110%;
  min-height: 110%;
  position: absolute;
  left: -5%;
  top: -5%;
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
