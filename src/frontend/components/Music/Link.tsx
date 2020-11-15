import { Link as BaseLink } from '@components/Nav';
import { Theme } from '@components/ThemeProvider';
import { useRouter } from 'next/router';
import styled from 'styled-components';

type StyledLinkProps = Theme<{ active: boolean }>;

const StyledLink = styled(BaseLink)<StyledLinkProps>`
  margin-left: 6px;
  padding: 8px 6px;
  border-bottom: 2px solid
    ${(props: StyledLinkProps) =>
      props.active ? props.theme.songList.nav.underline : 'transparent'};
  transition: all ${(props: StyledLinkProps) => props.theme.transition};

  &:first-child {
    margin-left: 0;
  }
`;

interface LinkProps {
  children: string;
  to: string;
}

const Link = ({ to, children }: LinkProps) => {
  const router = useRouter();

  return (
    <StyledLink to={to} active={router.pathname === to}>
      {children}
    </StyledLink>
  );
};

export default Link;
