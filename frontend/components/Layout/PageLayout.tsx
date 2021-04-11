import isMobile from 'is-mobile';
import React from 'react';
import styled, { css } from 'styled-components';
import Header from '../Header';
import Player from '../Player';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 60px auto;

  ${isMobile() &&
  css`
    margin: 0 auto 100px auto;
  `}
`;

const PageContent = styled.section`
  ${isMobile() &&
  css`
    margin: 0 5px;
  `}
`;

const PageLayout: React.FC = ({ children }) => (
  <Main>
    <Header />
    <PageContent>{children}</PageContent>
  </Main>
);

export default PageLayout;
