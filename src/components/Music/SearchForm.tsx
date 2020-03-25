import { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../ThemeProvider';

import { TextInput, TextInputType } from '../Form';
import Button from '../Form/Button';

const StyledTextInput = styled(TextInput)`
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
  box-shadow: ${(props: Theme) => props.theme.shadow};
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
        <StyledTextInput type={TextInputType.text} handler={setQuery}>Search</StyledTextInput>
        <Button>Search</Button>
      </Form>
    </Wrapper>
  );
};

export default SearchForm;
