import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';
import hash from '../../utils/hash';

const Input = styled.input`
  width: 100%;
  margin: 0;
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
  children: string;
  className?: string;
  type: TextFieldType;
  required?: boolean;
  handler: (value: string) => void;
}

const TextField = ({
  children, className, type, required = false, handler,
}: TextFieldProps) => {
  const id = hash(children);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label htmlFor={id} className={className} aria-label={children}>
      <Input
        id={id}
        placeholder={children}
        type={type}
        required={required}
        onChange={(event) => handler(event.target.value)}
      />
    </label>
  );
};

export default TextField;
