import styled from 'styled-components';

import jpg from './images/bg.jpg';
import webp from './images/bg.webp';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  user-select: none;
  z-index: -1;
`;

const Image = styled.img`
  min-width: calc(100% + 20px);
  min-height: calc(100% + 20px);
  position: absolute;
  left: -10px;
  top: -10px;
  filter: blur(5px) brightness(.75);
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
