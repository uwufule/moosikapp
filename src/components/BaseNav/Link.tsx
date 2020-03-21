import NextLink from 'next/link';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const StyledLink = styled.a`
  font-size: 18px;
  line-height: 1.5;
  font-weight: 400;
  color: ${(props: ThemeProps) => props.theme.colors.light};
  text-decoration: none;
  cursor: pointer;
  text-shadow: ${(props: ThemeProps) => props.theme.shadow};
  transition: color ${(props: ThemeProps) => props.theme.transition};

  &:hover {
    color: ${(props: ThemeProps) => props.theme.colors.red};
  }
`;

interface NavLinkProps {
  children: string;
  to: string;
  className?: string;
}

const NavLink = ({ to, children, className }: NavLinkProps) => (
  <NextLink href={to}>
    <StyledLink className={className}>
      {children}
    </StyledLink>
  </NextLink>
);

export default NavLink;
