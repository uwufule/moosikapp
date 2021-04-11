import checkIsMobile from 'is-mobile';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Normalize } from 'styled-normalize';
import { refresh } from '../../redux/auth/actions';
import { selectIsAuthorized } from '../../redux/auth/selectors';
import Alert from '../Alert';
import BackgroundImage from '../BackgroundImage';
import CustomScrollbars from '../CustomScrollbars';
import Sidebar from '../Sidebar';
import AuthLayout from './AuthLayout';
import GlobalStyle from './GlobalStyles';
import PageLayout from './PageLayout';

const App = styled.div`
  height: 100%;
  background: #1f232d;
`;

const AppWrapper: React.FC = ({ children }) => {
  const [ready, setReady] = useState(false);
  const isAuthorized = useSelector(selectIsAuthorized);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthorized) {
      dispatch(refresh(token));
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      setReady(true);
    }
  }, [isAuthorized]);

  return <>{ready && children}</>;
};

const DefaultLayout: React.FC = ({ children }) => {
  const isMobile = checkIsMobile();

  return (
    <App>
      <BackgroundImage />
      <CustomScrollbars>
        <AppWrapper>{children}</AppWrapper>
      </CustomScrollbars>
      {isMobile && <Sidebar />}
      <Alert />
    </App>
  );
};

const Layout: React.FC<{ isAuthPage?: boolean }> = ({ isAuthPage, children }) => (
  <DefaultLayout>
    {isAuthPage ? <AuthLayout>{children}</AuthLayout> : <PageLayout>{children}</PageLayout>}
  </DefaultLayout>
);

export default Layout;
