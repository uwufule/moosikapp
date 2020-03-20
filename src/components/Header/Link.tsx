import NextLink from 'next/link';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

interface StyledLinkProps {
  to: string;
  children: JSX.Element | string;
}

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

const Link = ({ to, children }: StyledLinkProps) => (
  <NextLink href={to}>
    <StyledLink>
      {children}
    </StyledLink>
  </NextLink>
);

export default Link;
