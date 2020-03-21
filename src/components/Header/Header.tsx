import styled from 'styled-components';
import Logo from './Logo';
import Nav from './Nav';
import { Link } from '../BaseNav';

const HeaderComponent = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => (
  <HeaderComponent>
    <Group>
      <Logo linkTo="/" />
      <Nav />
    </Group>
    <Group>
      {false ? (
        <Link to="?logout">Logout</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </Group>
  </HeaderComponent>
);

export default Header;
