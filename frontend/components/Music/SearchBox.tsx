import debounce from 'lodash/debounce';
import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';

const SearchBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const SearchBoxInput = styled.input`
  max-width: 400px;
  padding: 0.625rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  background: #1b1d27b8;
  color: #c7ccd8;
  border: 1px solid #262838;
  outline: none;
  border-radius: 5px;
  transition: 200ms ease all;
`;

const SearchBox: React.FC<{ initialValue?: string; onChange: (value: string) => void }> = ({
  initialValue,
  onChange,
}) => {
  const onInputChange = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    }, 1000),
    [onChange],
  );

  return (
    <SearchBoxContainer>
      <SearchBoxInput
        type="text"
        defaultValue={initialValue}
        onChange={onInputChange}
        placeholder="Search..."
      />
    </SearchBoxContainer>
  );
};

export default SearchBox;
