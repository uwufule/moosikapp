import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useTokenManager from '../../hooks/useTokenManager';
import ThemeProvider from '../ThemeProvider';
import BackgroundImage from '../BackgroundImage';
import Header from '../Header';
// import Sidebar from '../Sidebar';
// import Modal from '../Modal';
import Player from '../Player';
import GlobalStyle from './GlobalStyle';
import { RootState } from '../../redux/store';

const Main = styled.main`
  display: flex;
  min-height: 100%;
  position: relative;
`;

interface ContentProps {
  mustAddMarginBottom: boolean;
}

const Content = styled.div<ContentProps>`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1200px;
  position: relative;
  margin: 0 auto ${(props: ContentProps) => (props.mustAddMarginBottom ? 48 : 0)}px auto;

  @media (max-width: 480px) {
    & {
      margin-bottom: ${(props: ContentProps) => (props.mustAddMarginBottom ? 92 : 0)}px;
    }
  }
`;

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: LayoutProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [ready, setReady] = useState(false);

  const isAuthorized = useSelector<RootState, boolean>(
    (state) => state.auth.accessToken !== '',
  );

  const tokenManager = useTokenManager();

  const getRefreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token not found in local storage.');
    }

    return refreshToken;
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const refreshToken = getRefreshToken();
        await tokenManager.refreshTokens(refreshToken);
      } catch (e) {
        // error
      } finally {
        setReady(true);
      }
    };

    makeRequest();
  }, []);

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode') === 'true');
  }, []);

  return (
    <ThemeProvider darkMode={darkMode}>
      <GlobalStyle />
      {/* <Sidebar /> */}
      <Main>
        <BackgroundImage />
        <Content mustAddMarginBottom={isAuthorized}>
          <Header />
          {ready && children}
        </Content>
        {isAuthorized && <Player />}
      </Main>
      {/* <Modal /> */}
    </ThemeProvider>
  );
};

export default Layout;
