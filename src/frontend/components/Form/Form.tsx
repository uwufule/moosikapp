import { Theme } from '@components/ThemeProvider';
import React from 'react';
import styled from 'styled-components';

const FormComponent = styled.form`
  width: 100%;
  max-width: 600px;
  /* background: ${(props: Theme) => props.theme.forms.background};
  padding: 64px 32px;
  box-shadow: ${(props: Theme) => props.theme.shadow.long}; */
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.5;
  color: ${(props: Theme) => props.theme.forms.title};
  text-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

interface FormProps {
  title: string;
  children: JSX.Element | JSX.Element[];
  onSubmit: () => void;
}

const Form = ({ title, children, onSubmit }: FormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <FormComponent onSubmit={handleSubmit}>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </FormComponent>
  );
};

export default Form;
