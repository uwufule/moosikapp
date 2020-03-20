import { FormEvent } from 'react';
import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const Form = styled.form`
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.5;
  color: ${(props: ThemeProps) => props.theme.colors.light};
  text-shadow: ${(props: ThemeProps) => props.theme.shadow};
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`;

interface FormProps {
  title: string;
  children: JSX.Element | JSX.Element[];
  handler: (event: FormEvent<HTMLFormElement>) => void;
}

export default ({ title, children, handler }: FormProps) => (
  <Form
    onSubmit={(event) => {
      event.preventDefault();
      handler(event);
    }}
  >
    <Title>{title}</Title>
    <FormBody>
      {children}
    </FormBody>
  </Form>
);
