import { MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Logo from './Logo';
import Nav from './Nav';
import { Link } from '../BaseNav';
import logout from '../../utils/transport/logout';
import { clearTokenChain } from '../../redux/actions/login';
import { RootState } from '../../redux/store';

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
  const accessToken = useSelector<RootState, string>((state) => state.login.accessToken);
  const dispatch = useDispatch();

  const logoutHandler = async (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    event.preventDefault();

    await logout(accessToken);

    dispatch(clearTokenChain());
    localStorage.removeItem('refreshToken');
  };

  return (
    <HeaderComponent>
      <Group>
        <Logo linkTo="/" />
        {accessToken !== '' && <Nav />}
      </Group>
      <Group>
        {accessToken !== '' ? (
          <Link to="?logout" handler={logoutHandler}>Logout</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Group>
    </HeaderComponent>
  );
};

export default Header;
