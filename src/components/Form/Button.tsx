import styled from 'styled-components';
import { ThemeProps } from '../ThemeProvider';

const Button = styled.input.attrs({ type: 'submit' })`
  margin: 0;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  background: ${(props: ThemeProps) => props.theme.colors.red};
  color: ${(props: ThemeProps) => props.theme.colors.light};
  border: 0;
  border-radius: 0;
  outline: 0;
  cursor: pointer;
  transition: all ${(props: ThemeProps) => props.theme.transition};

  &:hover {
    background: ${(props: ThemeProps) => props.theme.colors.darkRed};
    box-shadow: 0 0 2px ${(props: ThemeProps) => props.theme.colors.red};
  }
`;

interface FormButtonProps {
  children: string;
  className?: string;
}

const FormButton = ({ children, className }: FormButtonProps) => (
  <Button className={className} value={children} />
);

export default FormButton;
