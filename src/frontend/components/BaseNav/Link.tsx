import { MouseEvent } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

const StyledLink = styled.a`
  font-size: 18px;
  line-height: 1.5;
  font-weight: 400;
  color: ${(props: Theme) => props.theme.colors.otherText};
  text-decoration: none;
  cursor: pointer;
  text-shadow: ${(props: Theme) => props.theme.shadow.long};
  transition: color ${(props: Theme) => props.theme.transition};

  &:hover {
    color: ${(props: Theme) => props.theme.colors.accent};
  }
`;

interface NavLinkProps {
  children: string;
  to: string;
  className?: string;
  handler?: (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => void;
}

const NavLink = ({
  to, children, className, handler,
}: NavLinkProps) => (
  <NextLink href={to}>
    <StyledLink className={className} onClick={handler}>
      {children}
    </StyledLink>
  </NextLink>
);

export default NavLink;
