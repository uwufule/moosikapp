import { Link } from '@components/Nav';
import { logout } from '@redux/auth/actions';
import React from 'react';
import { useDispatch } from 'react-redux';

const Logout = () => {
  const dispatch = useDispatch();

  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    event.preventDefault();
    dispatch(logout());
  };

  return (
    <Link to="?logout" handler={handleClick}>
      Logout
    </Link>
  );
};

export default Logout;
