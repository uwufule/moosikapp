import styled from 'styled-components';
import createHash from '@utils/hash';
import { Theme } from '@components/ThemeProvider';

const Input = styled.input`
  width: 100%;
  margin: 0;
  padding: 4px 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.colors.input.background};
  color: ${(props: Theme) => props.theme.colors.input.text};
  border: 1px solid ${(props: Theme) => props.theme.colors.input.border};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: Theme) => props.theme.transition};

  &:focus {
    border-color: ${(props: Theme) => props.theme.colors.input.accent};
    box-shadow: 0 0 2px ${(props: Theme) => props.theme.colors.input.accent};
  }
`;

export enum InputType {
  text = 'text',
  email = 'email',
  tel = 'tel',
  password = 'password',
}

interface InputProps {
  children: string;
  className?: string;
  type: InputType;
  required?: boolean;
  handler: (value: string) => void;
}

const FormInput = ({
  children, className, type, required = false, handler,
}: InputProps) => {
  const id = createHash().update(children).digest(36);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label htmlFor={id} className={className} aria-label={children}>
      <Input
        id={id}
        placeholder={children}
        type={type}
        required={required}
        autoComplete="off"
        onChange={(event) => handler(event.target.value)}
      />
    </label>
  );
};

export default FormInput;
