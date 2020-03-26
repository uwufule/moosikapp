import { MouseEvent } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import useAuthorization from '../../hooks/useAuthorization';
import Logo from './Logo';
import Nav from './Nav';
import { Link } from '../BaseNav';
import { RootState } from '../../redux/store';

type Event = MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>;

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

const Header = () => {
  const isLoggedIn = useSelector<RootState, boolean>(
    (state) => state.login.accessToken !== '',
  );

  const authorization = useAuthorization();

  const logoutHandler = async (event: Event) => {
    event.preventDefault();

    try {
      await authorization.deauthorize();
    } catch (e) {
      // error message (e.response.data)
    }
  };

  return (
    <HeaderComponent>
      <Group>
        <Logo linkTo="/" />
        {isLoggedIn && <Nav />}
      </Group>
      <Group>
        {isLoggedIn ? (
          <Link to="?logout" handler={logoutHandler}>Logout</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Group>
    </HeaderComponent>
  );
};

export default Header;
