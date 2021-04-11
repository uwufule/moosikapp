import Link from 'next/link';
import React, { MouseEventHandler, ReactNode, useState } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import styled, { css } from 'styled-components';

type HeaderDropdownPositon = 'left' | 'right';

const HeaderDropdownWrapper = styled.div`
  position: relative;
  padding: 0.75rem 0;
`;

interface HeaderDropdownContainerProps {
  status: TransitionStatus;
  position: HeaderDropdownPositon;
}

const HeaderDropdownContainer = styled.div<HeaderDropdownContainerProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  position: absolute;
  ${(props) =>
    props.position === 'left' &&
    css`
      left: 0;
    `}
  ${(props) =>
    props.position === 'right' &&
    css`
      right: 0;
      text-align: right;
    `}
  top: 100%;
  padding: 1rem;
  border-radius: 5px;
  background: #fff;
  opacity: ${(props) => (props.status === 'entered' ? 1 : 0)};
  z-index: 99;
  transition: 200ms ease opacity;

  ::before {
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    ${(props) =>
      props.position === 'left' &&
      css`
        left: 2rem;
      `}
    ${(props) =>
      props.position === 'right' &&
      css`
        right: 2rem;
      `}
    top: -0.5rem;
    background: #fff;
    z-index: -1;
    transform: rotate(-45deg);
  }
`;

const StyledAnchor = styled.a`
  color: #1f232d;
  line-height: 1.5rem;
  text-decoration: none;
  margin-bottom: 5px;

  :last-child {
    margin-bottom: 0;
  }
`;

export const HeaderDropdownLink: React.FC<{
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}> = ({ href, onClick, children }) => (
  <Link href={href} passHref>
    <StyledAnchor onClick={onClick}>{children}</StyledAnchor>
  </Link>
);

const HeaderDropdown: React.FC<{ main: ReactNode; position?: HeaderDropdownPositon }> = ({
  main,
  children,
  position = 'left',
}) => {
  const [flag, setFlag] = useState(false);

  const show = () => {
    setFlag(true);
  };

  const hide = () => {
    setFlag(false);
  };

  return (
    <HeaderDropdownWrapper onMouseOver={show} onMouseLeave={hide}>
      {main}
      <Transition in={flag} mountOnEnter unmountOnExit type="ease" timeout={200}>
        {(status) => (
          <HeaderDropdownContainer status={status} position={position}>
            {children}
          </HeaderDropdownContainer>
        )}
      </Transition>
    </HeaderDropdownWrapper>
  );
};

export default HeaderDropdown;
