import checkIsMobile from 'is-mobile';
import Link from 'next/link';
import React, { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../redux/auth/actions';
import { selectIsAuthorized } from '../../redux/auth/selectors';
import HeaderDropdown, { HeaderDropdownLink } from './HeaderDropdown';
import Logo from './Logo';
import MobileMenuButton from './MobileMenuButton';

const StyledAnchor = styled.a`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #c7ccd8;
  text-decoration: none;
  transition: 200ms ease color;

  :hover {
    color: #fff;
  }
`;

export const HeaderLink: React.FC<{ href: string }> = ({ href, children }) => (
  <Link passHref href={href}>
    <StyledAnchor>{children}</StyledAnchor>
  </Link>
);

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1rem;
`;

const HeaderGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => {
  const isMobile = checkIsMobile();
  const isAuthorized = useSelector(selectIsAuthorized);

  const dispatch = useDispatch();

  const deauthorize = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(logout());
  };

  return (
    <StyledHeader>
      <HeaderGroup>
        <Logo />
        {!isMobile && (
          <>
            {isAuthorized && (
              <>
                <HeaderDropdown main={<HeaderLink href="/music">Music</HeaderLink>}>
                  <HeaderDropdownLink href="/music">Songs</HeaderDropdownLink>
                  <HeaderDropdownLink href="/music/likes">Likes</HeaderDropdownLink>
                  <HeaderDropdownLink href="/music/search">Search</HeaderDropdownLink>
                </HeaderDropdown>
                <HeaderLink href="/upload">Upload</HeaderLink>
              </>
            )}
          </>
        )}
      </HeaderGroup>
      <HeaderGroup>
        {isMobile ? (
          <MobileMenuButton />
        ) : (
          <>
            {isAuthorized ? (
              <HeaderDropdown
                main={<HeaderLink href="/profile">Profile</HeaderLink>}
                position="right"
              >
                <HeaderDropdownLink href="/profile">Profile</HeaderDropdownLink>
                <HeaderDropdownLink href="/profile/settings">Account settings</HeaderDropdownLink>
                <HeaderDropdownLink href="?logout" onClick={deauthorize}>
                  Logout
                </HeaderDropdownLink>
              </HeaderDropdown>
            ) : (
              <HeaderLink href="/signin">Login</HeaderLink>
            )}
          </>
        )}
      </HeaderGroup>
    </StyledHeader>
  );
};

export default Header;
