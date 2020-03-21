import { FormEvent } from 'react';
import styled from 'styled-components';
import { Theme } from '../ThemeProvider';

const FormComponent = styled.form`
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.colors.light};
  text-shadow: ${(props: Theme) => props.theme.shadow};
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

const Form = ({ title, children, handler }: FormProps) => (
  <FormComponent
    onSubmit={(event) => {
      event.preventDefault();
      handler(event);
    }}
  >
    <Title>{title}</Title>
    <FormBody>
      {children}
    </FormBody>
  </FormComponent>
);

export default Form;
