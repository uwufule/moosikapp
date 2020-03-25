import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ThemeProvider from '../ThemeProvider';
import BackgroundImage from '../BackgroundImage';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Modal from '../Modal';
import Player from '../Player';
import GlobalStyle from './GlobalStyle';

import refreshAccessToken from '../../utils/transport/refreshAccessToken';
import { setTokenChain } from '../../redux/actions/login';

const Main = styled.main`
  display: flex;
  min-height: 100%;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
`;

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const asyncEffect = async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        const res = await refreshAccessToken(refreshToken);

        localStorage.setItem('refreshToken', res.refreshToken);
        // set access and refresh token in redux store
        dispatch(setTokenChain(res.accessToken, res.refreshToken));
      }
    };

    asyncEffect();
  }, []);

  return (
    <ThemeProvider>
      <GlobalStyle />
      {false && <Sidebar />}
      <Main>
        <BackgroundImage />
        <Content>
          <Header />
          {children}
        </Content>
        <Player />
      </Main>
      {false && <Modal />}
    </ThemeProvider>
  );
};

export default Layout;
