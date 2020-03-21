import { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../ThemeProvider';

import TextField, { TextFieldType } from '../Form/TextField';
import Button from '../Form/Button';

const StyledTextField = styled(TextField)`
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
        <StyledTextField type={TextFieldType.text} handler={setQuery}>Search</StyledTextField>
        <Button>Search</Button>
      </Form>
    </Wrapper>
  );
};

export default SearchForm;
