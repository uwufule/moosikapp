import styled from 'styled-components';
import BaseNav, { Link } from '../BaseNav';

const StyledNav = styled(BaseNav)`
  margin-left: 12px;
`;

const StyledLink = styled(Link)`
  margin-left: 12px;

  &:first-child {
    margin-left: 0;
  }
`;

const Nav = () => (
  <StyledNav>
    <StyledLink to="/music">Music</StyledLink>
    <StyledLink to="/upload">Upload</StyledLink>
  </StyledNav>
);

export default Nav;
