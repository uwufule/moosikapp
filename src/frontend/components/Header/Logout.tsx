import { MouseEvent } from 'react';
import useAuth from '@hooks/useAuthorization';
import { Link } from '@components/BaseNav';

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
