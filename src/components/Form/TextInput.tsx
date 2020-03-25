import styled from 'styled-components';
import createHash from '../../utils/hash';
import { Theme } from '../ThemeProvider';

const Input = styled.input`
  width: 100%;
  margin: 0;
  padding: 4px 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: Theme) => props.theme.colors.light};
  color: ${(props: Theme) => props.theme.colors.dark};
  border: 1px solid ${(props: Theme) => props.theme.colors.gray};
  border-radius: 0;
  outline: 0;
  transition: all ${(props: Theme) => props.theme.transition};

  &:focus {
    border-color: ${(props: Theme) => props.theme.colors.red};
    box-shadow: 0 0 2px ${(props: Theme) => props.theme.colors.red};
  }
`;

export enum TextInputType {
  text = 'text',
  email = 'email',
  tel = 'tel',
  password = 'password',
}

interface TextInputProps {
  children: string;
  className?: string;
  type: TextInputType;
  required?: boolean;
  handler: (value: string) => void;
}

const TextInput = ({
  children, className, type, required = false, handler,
}: TextInputProps) => {
  const id = createHash().update(children).digest(36);

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

export default TextInput;
