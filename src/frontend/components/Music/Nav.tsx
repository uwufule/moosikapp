import BaseNav from '@components/Nav';
import styled from 'styled-components';
import Link from './Link';

const StyledNav = styled(BaseNav)`
  display: flex;
  margin-bottom: 48px;
`;

const Nav = () => (
  <StyledNav>
    <Link to="/music">All</Link>
    <Link to="/music/likes">Likes</Link>
    <Link to="/music/search">Search</Link>
  </StyledNav>
);

export default Nav;
