import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const Label = styled.label`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 4px 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: ThemeProps) => props.theme.colors.light};
  color: ${(props: ThemeProps) => props.theme.colors.dark};
  border: 1px solid ${(props: ThemeProps) => props.theme.colors.gray};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: ThemeProps) => props.theme.transition};

  &:focus {
    border-color: ${(props: ThemeProps) => props.theme.colors.red};
    box-shadow: 0 0 2px ${(props: ThemeProps) => props.theme.colors.red};
  }
`;

export enum TextFieldType {
  text = 'text',
  email = 'email',
  tel = 'tel',
  password = 'password',
}

interface TextFieldProps {
  id: string;
  type: TextFieldType;
  required?: boolean;
  caption: string;
  handler: (value: string) => void;
}

export default ({
  id, type, required = false, caption, handler,
}: TextFieldProps) => (
  <Label htmlFor={id}>
    <Input
      id={id}
      type={type}
      required={required}
      placeholder={caption}
      onChange={(event) => handler(event.target.value)}
    />
  </Label>
);
