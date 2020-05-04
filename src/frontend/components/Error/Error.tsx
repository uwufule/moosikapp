import styled from 'styled-components';
import createHash from '../../utils/hash';
import { Theme } from '../ThemeProvider';

import png from './images/404.png';

const Wrapper = styled.div`
  position: relative;
  margin-top: 24px;
  flex: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.colors.otherText};
  text-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const Message = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.colors.secondary};
  text-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const NotFoundImage = styled.img`
  max-height: 100%;
  height: 240px;
  position: absolute;
  bottom: 0;
  right: 10%;
  pointer-events: none;
`;

interface ErrorProps {
  title: string;
  message: string[];
}

const Error = ({ title, message }: ErrorProps) => (
  <Wrapper>
    <Title>{title}</Title>
    <Message>
      {message.map((line) => (
        <p key={createHash().update(line).digest(36)}>{line}</p>
      ))}
    </Message>
    <NotFoundImage alt="error" src={png} />
  </Wrapper>
);

export default Error;
