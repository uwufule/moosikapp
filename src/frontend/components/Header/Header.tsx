import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { Link } from '@components/BaseNav';
import Logo from './Logo';
import Nav from './Nav';
import Logout from './Logout';

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
  const isLoggedIn = useSelector<RootState, boolean>((state) => state.auth.accessToken !== '');

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
