import { Theme } from '@components/ThemeProvider';
import NextLink from 'next/link';
import { MouseEvent } from 'react';
import styled from 'styled-components';

const StyledLink = styled.a`
  font-size: 18px;
  line-height: 1.5;
  font-weight: 400;
  color: ${(props: Theme) => props.theme.nav.link.inactive};
  text-decoration: none;
  cursor: pointer;
  text-shadow: ${(props: Theme) => props.theme.shadow.long};
  transition: color ${(props: Theme) => props.theme.transition};

  &:hover {
    color: ${(props: Theme) => props.theme.nav.link.active};
  }
`;

interface LinkProps {
  children: string;
  to: string;
  className?: string;
  handler?: (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => void;
}

const Link = ({ to, children, className, handler }: LinkProps) => (
  <NextLink href={to}>
    <StyledLink className={className} onClick={handler}>
      {children}
    </StyledLink>
  </NextLink>
);

export default Link;
