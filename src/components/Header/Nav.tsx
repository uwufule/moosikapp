import styled from 'styled-components';
import Link from './Link';

const NavComponent = styled.nav`
  margin-left: 12px;

  & > a {
    margin-left: 12px;
  }

  & > a:first-child {
    margin-left: 0;
  }
`;

const Nav = () => (
  <NavComponent>
    <Link to="/music">Music</Link>
    <Link to="/upload">Upload</Link>
  </NavComponent>
);

export default Nav;
