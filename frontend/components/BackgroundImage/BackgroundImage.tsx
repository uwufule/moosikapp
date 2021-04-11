import styled from 'styled-components';
import image from './images/pixiv87446153.jpg';

const BackgroundImage = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: url(${image}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  pointer-events: none;

  ::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: brightness(0.5) blur(10px);
  }

  @supports (-moz-appearance: none) {
    filter: brightness(0.5) blur(10px);
  }
`;

export default BackgroundImage;
