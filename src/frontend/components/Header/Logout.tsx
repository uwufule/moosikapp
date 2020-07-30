import { MouseEvent } from 'react';
import useAuth from '@hooks/useAuthorization';
import useErrorHandler from '@hooks/useErrorHandler';
import { Link } from '@components/BaseNav';

const Logout = () => {
  const { deauthorize } = useAuth();

  const handleError = useErrorHandler();

  const handleClick = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    event.preventDefault();

    handleError(deauthorize);
  };

  return (
    <Link to="?logout" handler={handleClick}>
      Logout
    </Link>
  );
};

export default Logout;
