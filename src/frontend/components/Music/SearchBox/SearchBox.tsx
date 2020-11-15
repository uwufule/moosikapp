import { Theme } from '@components/ThemeProvider';
import React from 'react';
import styled from 'styled-components';
import Submit from './Submit';
import TextField from './TextField';

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: ${(props: Theme) => props.theme.shadow.long};
`;

interface SearchBoxProps {
  initialValue?: string;
  onValueChange: (text: string) => void;
}

const SearchBox = ({ initialValue = '', onValueChange }: SearchBoxProps) => {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onValueChange(value);
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <TextField defaultValue={value} onChange={handleChange} placeholder="Search..." />
        <Submit value="Search" />
      </Form>
    </Wrapper>
  );
};

export default SearchBox;
