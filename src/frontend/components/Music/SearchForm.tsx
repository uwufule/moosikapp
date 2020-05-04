import { useState } from 'react';
import styled from 'styled-components';
import { Input, InputType, SubmitButton } from '../Form';
import { Theme } from '../ThemeProvider';

const StyledInput = styled(Input)`
  flex: 1;
`;

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
  handler: (query: string) => void;
}

const SearchForm = ({ handler }: SearchFormProps) => {
  const [query, setQuery] = useState('');

  return (
    <Wrapper>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          handler(query);
        }}
      >
        <StyledInput type={InputType.text} handler={setQuery}>Search...</StyledInput>
        <SubmitButton>Search</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default SearchForm;
