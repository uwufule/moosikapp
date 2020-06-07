import { MouseEvent } from 'react';
import useAuth from '@hooks/useAuthorization';
import { Link } from '@components/BaseNav';

const Logout = () => {
  const { deauthorize } = useAuth();

  const handleClick = async (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    event.preventDefault();

    try {
      await deauthorize();
    } catch (e) {
      // error message (e.response.data)
    }
  };

  return <Link to="?logout" handler={handleClick}>Logout</Link>;
};

export default Logout;
