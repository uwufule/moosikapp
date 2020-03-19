import styled from 'styled-components';
import Logo from './Logo';
import Link from './Link';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
`;

export default () => (
  <Header>
    <Group>
      <Logo linkTo="/" />
    </Group>
    <Group>
      <Link to="/login">Login</Link>
    </Group>
  </Header>
);
