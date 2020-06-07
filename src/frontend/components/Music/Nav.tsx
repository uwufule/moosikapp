import styled from 'styled-components';
import BaseNav from '@components/BaseNav';
import NavLink from './NavLink';

const StyledNav = styled(BaseNav)`
  display: flex;
  margin-bottom: 48px;
`;

const Nav = () => (
  <StyledNav>
    <NavLink to="/music">All</NavLink>
    <NavLink to="/music/likes">Likes</NavLink>
    <NavLink to="/music/search">Search</NavLink>
  </StyledNav>
);

export default Nav;
