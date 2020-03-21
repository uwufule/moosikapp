import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Link } from '../BaseNav';
import { Theme } from '../ThemeProvider';

type StyledLinkProps = Theme<{ active: boolean }>;

const StyledLink = styled(Link)<StyledLinkProps>`
  margin-left: 6px;
  padding: 8px 6px;
  border-bottom: 2px solid ${(props: StyledLinkProps) => (
    props.active ? props.theme.colors.red : 'transparent'
  )};
  transition: border-bottom-color ${(props: StyledLinkProps) => props.theme.transition};

  &:first-child {
    margin-left: 0;
  }
`;

interface NavLinkProps {
  children: string;
  to: string;
}

const NavLink = ({ to, children }: NavLinkProps) => {
  const router = useRouter();

  return (
    <StyledLink to={to} active={router.pathname === to}>
      {children}
    </StyledLink>
  );
};

export default NavLink;
