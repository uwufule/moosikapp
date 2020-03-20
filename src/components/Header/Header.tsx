import styled from 'styled-components';
import Logo from './Logo';
import Link from './Link';
import Nav from './Nav';

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
      <Link to="/login">Login</Link>
    </Group>
  </HeaderComponent>
);

export default Header;
