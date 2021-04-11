import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';

const ScrollbarHorizontalTrack = styled.div`
  left: 3px;
  right: 3px;
  bottom: 3px;
`;

const ScrollbarVerticalTrack = styled.div`
  right: 3px;
  top: 3px;
  bottom: 3px;
  z-index: 9999;
`;

const ScrollbarThumb = styled.div`
  background: #214883af;
  border-radius: 3px;
`;

const CustomScrollbars: React.FC = ({ children }) => (
  <Scrollbars
    universal
    hideTracksWhenNotNeeded
    autoHide
    renderTrackHorizontal={(props) => <ScrollbarHorizontalTrack {...props} />}
    renderThumbHorizontal={(props) => <ScrollbarThumb {...props} />}
    renderTrackVertical={(props) => <ScrollbarVerticalTrack {...props} />}
    renderThumbVertical={(props) => <ScrollbarThumb {...props} />}
  >
    {children}
  </Scrollbars>
);

export default CustomScrollbars;
