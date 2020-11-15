import { Theme } from '@components/ThemeProvider';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  margin-top: 24px;
  flex: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.text.primary};
  text-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const Message = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.text.secondary};
  text-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const NotFound: React.FC = () => (
  <Container>
    <Title>404</Title>
    <Message>
      <p>An error 404 occurred on server</p>
    </Message>
  </Container>
);

export default NotFound;
