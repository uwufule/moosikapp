import { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';
import Input from './Input';
import Submit from './Submit';

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

interface SearchFormProps {
  initialQuery?: string;
  handler: (query: string) => void;
}

const SearchBox = ({ initialQuery = '', handler }: SearchFormProps) => {
  const [query, setQuery] = useState('');

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handler(query);
  };

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <Input defaultValue={initialQuery} onChange={onQueryChange} placeholder="Search..." />
        <Submit value="Search" />
      </Form>
    </Wrapper>
  );
};

export default SearchBox;
