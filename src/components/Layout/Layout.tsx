import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import ThemeProvider from '../ThemeProvider';
import BackgroundImage from '../BackgroundImage';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Modal from '../Modal';
import Player from '../Player';
import GlobalStyle from './GlobalStyle';
import { RootState } from '../../redux/store';

import refreshAccessToken from '../../utils/transport/refreshAccessToken';
import { setTokenChain } from '../../redux/actions/login';

const Main = styled.main`
  display: flex;
  min-height: 100%;
  position: relative;
`;

interface ContentProps {
  mustAddMarginBotton: boolean;
}

const Content = styled.div<ContentProps>`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1200px;
  position: relative;
  margin: 0 auto ${(props: ContentProps) => (props.mustAddMarginBotton ? 36 : 0)}px auto;

  @media (max-width: 480px) {
    & {
      margin-bottom: ${(props: ContentProps) => (props.mustAddMarginBotton ? 80 : 0)}px;
    }
  }
`;

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector<RootState, boolean>((state) => state.login.accessToken !== '');

  useEffect(() => {
    const asyncEffect = async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        const res = await refreshAccessToken(refreshToken);

        dispatch(setTokenChain(res.accessToken, res.refreshToken));
        localStorage.setItem('refreshToken', res.refreshToken);
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
        <Content mustAddMarginBotton={isLoggedIn}>
          <Header />
          {children}
        </Content>
        {isLoggedIn && <Player />}
      </Main>
      {false && <Modal />}
    </ThemeProvider>
  );
};

export default Layout;
