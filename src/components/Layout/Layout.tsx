import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import useTokenManager from '../../hooks/useTokenManager';
import ThemeProvider from '../ThemeProvider';
import BackgroundImage from '../BackgroundImage';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Modal from '../Modal';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(false);

  const isLoggedIn = useSelector<RootState, boolean>(
    (state) => state.login.accessToken !== '',
  );

  const tokenManager = useTokenManager();

  useEffect(() => {
    setIsRequestCompleted(false);

    const asyncEffect = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        setIsRequestCompleted(true);
        return;
      }

      try {
        await tokenManager.releaseTokenPair(refreshToken);
      } catch (e) {
        // error message
      } finally {
        setIsRequestCompleted(true);
      }
    };

    asyncEffect();
  }, []);

  useEffect(() => {
    setIsDarkMode(localStorage.getItem('isDarkMode') === 'true');
  }, []);

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <GlobalStyle />
      {false && <Sidebar />}
      <Main>
        <BackgroundImage />
        <Content mustAddMarginBottom={isLoggedIn}>
          <Header />
          {isRequestCompleted && children}
        </Content>
        {isLoggedIn && <Player />}
      </Main>
      {false && <Modal />}
    </ThemeProvider>
  );
};

export default Layout;
