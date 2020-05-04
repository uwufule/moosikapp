import { MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from '../BaseNav';
import request from '../../utils/transport/authorizedRequest';
import { RootState } from '../../redux/store';
import { removeTokenPair } from '../../redux/auth/actions';

const logout = (accessToken: string) => request('/logout', accessToken, { method: 'POST' });

const Logout = () => {
  const accessToken = useSelector<RootState, string>((state) => state.auth.accessToken);

  const dispatch = useDispatch();

  const handleClick = async (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    event.preventDefault();

    try {
      await logout(accessToken);
    } catch (e) {
      // error
    } finally {
      localStorage.removeItem('refreshToken');
      dispatch(removeTokenPair());
    }
  };

  return <Link to="?logout" handler={handleClick}>Logout</Link>;
};

export default Logout;
