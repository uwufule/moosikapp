import { Theme } from '@components/ThemeProvider';
import genHash from '@core/infrastructure/crypto/genHash';
import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  margin: 0;
  padding: 6px 8px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.forms.input.background};
  color: ${(props: Theme) => props.theme.forms.input.text};
  border: 1px solid ${(props: Theme) => props.theme.forms.input.border.inactive};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: Theme) => props.theme.transition};

  &:focus {
    border-color: ${(props: Theme) => props.theme.forms.input.border.active};
    box-shadow: 0 0 2px ${(props: Theme) => props.theme.forms.input.border.active};
  }
`;

interface TextFieldProps {
  className?: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  autoFocus?: boolean;
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const TextField = ({
  className,
  type,
  autoFocus = false,
  required = false,
  placeholder,
  onChange,
}: TextFieldProps) => {
  const id = genHash(placeholder);

  return (
    <label htmlFor={id} className={className} aria-label={placeholder}>
      <Input
        id={id}
        inputMode="text"
        type={type}
        autoFocus={autoFocus}
        required={required}
        placeholder={placeholder}
        aria-describedby={placeholder}
        autoComplete="off"
        autoCapitalize="off"
        onChange={onChange}
      />
    </label>
  );
};

export default TextField;
