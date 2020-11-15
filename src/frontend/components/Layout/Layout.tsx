import BackgroundImage from '@components/BackgroundImage';
import Header from '@components/Header';
import ThemeProvider, { ThemeString } from '@components/ThemeProvider';
import { refresh } from '@redux/auth/actions';
import { selectIsLoggedIn } from '@redux/auth/selectors';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
// import Sidebar from '../Sidebar';
import Modal from '../Modal';
import Player from '../Player';
import GlobalStyle from './GlobalStyle';

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
  const [theme, setTheme] = useState<ThemeString>('default');
  const [ready, setReady] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = localStorage.getItem('token');
    if (refreshToken) {
      dispatch(refresh(refreshToken));
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setReady(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const preferredTheme = localStorage.getItem('theme') as ThemeString;
    if (!preferredTheme) {
      return;
    }

    setTheme(preferredTheme);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {/* <Sidebar /> */}
      <Main>
        <BackgroundImage />
        <Content mustAddMarginBottom={isLoggedIn}>
          <Header />
          {ready && children}
        </Content>
        {isLoggedIn && <Player />}
      </Main>
      <Modal />
    </ThemeProvider>
  );
};

export default Layout;
