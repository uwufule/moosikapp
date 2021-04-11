import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Content = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  flex: 1;
`;

const CloseFooter = styled.footer`
  display: flex;
  justify-content: center;
  padding: 25px 0;
  background-color: transparent;
  fill: #c7ccd8af;
  border-top: 1px solid #c7ccd83b;
  cursor: pointer;
  transition: 200ms ease all;

  :focus,
  :hover {
    background-color: #17181f3f;
    fill: #c7ccd8;
  }
`;

const AuthLayout: React.FC = ({ children }) => (
  <Main>
    <Content>{children}</Content>
    <Link href="/">
      <CloseFooter>
        <svg width="25" height="25" viewBox="0 0 20 20">
          <path
            d="M10.007 8.85L18.624.236a.799.799 0 0 1 1.131 0l.025.025a.802.802 0 0 1 0 1.132l-8.616 8.616 8.616 8.616a.8.8 0 0 1 0 1.13l-.025.027a.8.8 0 0 1-1.131 0l-8.617-8.617-8.616 8.617a.802.802 0 0 1-1.132 0l-.025-.026a.8.8 0 0 1 0-1.131l8.616-8.616L.234 1.392a.802.802 0 0 1 0-1.132L.259.235a.8.8 0 0 1 1.132 0l8.616 8.616z"
            fillRule="evenodd"
          ></path>
        </svg>
      </CloseFooter>
    </Link>
  </Main>
);

export default AuthLayout;
