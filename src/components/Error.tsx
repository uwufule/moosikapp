import styled from 'styled-components';
import { ThemeProps } from './ThemeProvider';
import hash from '../utils/hash';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.5;
  color: ${(props: ThemeProps) => props.theme.colors.light};
  text-shadow: ${(props: ThemeProps) => props.theme.shadow};
`;

const Message = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props: ThemeProps) => props.theme.colors.light};
  text-shadow: ${(props: ThemeProps) => props.theme.shadow};

  & > p {
    margin: 0;
  }
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
        <p key={hash(line)}>{line}</p>
      ))}
    </Message>
  </Wrapper>
);

export default Error;
