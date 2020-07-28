import styled from 'styled-components';
import createHash from '@utils/hash';
import { Theme } from '@components/ThemeProvider';

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
  </Wrapper>
);

export default Error;
