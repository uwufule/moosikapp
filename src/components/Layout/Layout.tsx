import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useRequest from '../../hooks/useRequest';
import { setTokenChain } from '../../redux/actions/login';
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
  margin: 0 auto ${(props: ContentProps) => (props.mustAddMarginBottom ? 36 : 0)}px auto;

  @media (max-width: 480px) {
    & {
      margin-bottom: ${(props: ContentProps) => (props.mustAddMarginBottom ? 80 : 0)}px;
    }
  }
`;

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: LayoutProps) => {
  const [loaded, setLoaded] = useState(true);

  const isLoggedIn = useSelector<RootState, boolean>(
    (state) => state.login.accessToken !== '',
  );

  const dispatch = useDispatch();

  const request = useRequest();

  useEffect(() => {
    setLoaded(false);

    const asyncEffect = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        setLoaded(true);
        return;
      }

      try {
        await tokenManager.releaseTokenPair(refreshToken);
      } catch (e) {
        // error message
      } finally {
        setLoaded(true);
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
        <Content mustAddMarginBottom={isLoggedIn}>
          <Header />
          {loaded && children}
        </Content>
        {isLoggedIn && <Player />}
      </Main>
      {false && <Modal />}
    </ThemeProvider>
  );
};

export default Layout;
