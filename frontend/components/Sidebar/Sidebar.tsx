import Link from 'next/link';
import React, { createRef, MouseEvent, MouseEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transition, TransitionStatus } from 'react-transition-group';
import styled from 'styled-components';
import { logout } from '../../redux/auth/actions';
import { selectIsAuthorized } from '../../redux/auth/selectors';
import { hideSidebar } from '../../redux/sidebar/actions';
import { selectSidebarVisible } from '../../redux/sidebar/selectors';

const SidebarWrapper = styled.div<{ status: TransitionStatus }>`
  position: fixed;
  inset: 0;
  background: #00000073;
  opacity: ${(props) => (props.status === 'entered' ? 1 : 0)};
  z-index: 999;
`;

const SidebarContainer = styled.div<{ status: TransitionStatus }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 100%;
  position: fixed;
  right: ${(props) => (props.status === 'entered' ? '0' : '-100%')};
  top: 0;
  padding: 2rem;
  text-align: right;
  background: #1f232d;
  transition: 200ms ease right;
`;

const HorizontalLine = styled.hr`
  height: 1px;
  margin: 1rem 0;
  border: none;
  background: #c7ccd83b;
`;

const StyledAnchor = styled.a`
  margin-bottom: 0.5rem;
  color: #c7ccd8;
  line-height: 1.5;
  text-decoration: none;

  :last-child {
    margin-bottom: 0;
  }
`;

const SidebarLink: React.FC<{ href: string; onClick?: MouseEventHandler<HTMLAnchorElement> }> = ({
  href,
  onClick,
  children,
}) => (
  <Link href={href} passHref>
    <StyledAnchor onClick={onClick}>{children}</StyledAnchor>
  </Link>
);

const Sidebar: React.FC = () => {
  const isVisible = useSelector(selectSidebarVisible);
  const isAuthorized = useSelector(selectIsAuthorized);

  const sidebarRef = createRef<HTMLDivElement>();

  const dispatch = useDispatch();

  const hide = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === sidebarRef.current) {
      return;
    }

    dispatch(hideSidebar());
  };

  const deauthorize = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(logout());
  };

  return (
    <Transition in={isVisible} mountOnEnter unmountOnExit type="ease" timeout={200}>
      {(status) => (
        <SidebarWrapper status={status} onClick={hide}>
          <SidebarContainer ref={sidebarRef} status={status}>
            {isAuthorized ? (
              <>
                <SidebarLink href="/music">Songs</SidebarLink>
                <SidebarLink href="/music/likes">Likes</SidebarLink>
                <SidebarLink href="/music/search">Search</SidebarLink>
                <HorizontalLine />
                <SidebarLink href="/upload">Upload</SidebarLink>
                <HorizontalLine />
                <SidebarLink href="/profile">Profile</SidebarLink>
                <SidebarLink href="/profile/settings">Account settings</SidebarLink>
                <HorizontalLine />
                <SidebarLink href="?logout" onClick={deauthorize}>
                  Logout
                </SidebarLink>
              </>
            ) : (
              <SidebarLink href="/signin">Login</SidebarLink>
            )}
          </SidebarContainer>
        </SidebarWrapper>
      )}
    </Transition>
  );
};

export default Sidebar;
