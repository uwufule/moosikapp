import isMobile from 'is-mobile';
import React from 'react';
import styled, { css } from 'styled-components';

const PlayerControlButton = styled.button<{ isActive?: boolean }>`
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 20px 0;
  background: transparent;
  border: none;
  outline: none;
  fill: ${(props) => (props.isActive ? '#4f82d1' : '#c7ccd8')};
  box-sizing: content-box;
  cursor: pointer;

  ${!isMobile() &&
  css`
    margin-left: 20px;

    :first-child {
      margin-left: 0;
    }
  `}
`;

const PlayerControlSvg = styled.svg.attrs({
  viewBox: '0 0 24 24',
  fillRule: 'evenodd',
  clipRule: 'evenodd',
})`
  width: 100%;
  height: 100%;
`;

const PlayerControl: React.FC<{ title?: string; isActive?: boolean; onClick?: () => void }> = ({
  children,
  title,
  isActive,
  onClick,
}) => {
  return (
    <PlayerControlButton title={title} isActive={isActive} onClick={onClick}>
      <PlayerControlSvg>{children}</PlayerControlSvg>
    </PlayerControlButton>
  );
};

export default PlayerControl;
