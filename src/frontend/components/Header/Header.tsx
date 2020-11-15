import { Link } from '@components/Nav';
import { selectIsLoggedIn } from '@redux/auth/selectors';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Logo from './Logo';
import Logout from './Logout';
import Nav from './Nav';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <StyledHeader>
      <Group>
        <Logo linkTo="/" />
        {isLoggedIn && <Nav />}
      </Group>
      <Group>{isLoggedIn ? <Logout /> : <Link to="/login">Login</Link>}</Group>
    </StyledHeader>
  );
};

export default Header;
