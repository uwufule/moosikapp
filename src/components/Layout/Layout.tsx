import styled from 'styled-components';
import ThemeProvider from '../ThemeProvider';
import BackgroundImage from '../BackgroundImage';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Modal from '../Modal';
import Player from '../Player';
import GlobalStyle from './GlobalStyle';

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

const Layout = ({ children }: LayoutProps) => (
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

export default Layout;
